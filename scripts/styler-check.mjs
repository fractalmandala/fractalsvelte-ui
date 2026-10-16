#!/usr/bin/env node
// @ts-nocheck
// Closed-world check for src/lib/styler: every class must exist in the compiled
// fractalstyler stylesheet, and nothing may style an element any other way.
//
// Fails on:
//   - <style> blocks, style="" attributes, style: directives
//   - a class token (static, or a string literal inside a class expression)
//     that the compiled fractalstyler CSS does not define
//   - svelte/transition, svelte/animate, el.style, el.animate(), setProperty —
//     runtime ways of writing CSS that bypass the class registry
//
// Usage: node scripts/styler-check.mjs [dir-or-file ...]   (default: src/lib/styler)

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parse } from 'svelte/compiler';

const require = createRequire(import.meta.url);
const cssPath = require.resolve('@fractaldesign/fractalstyler/css');
const css = fs.readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

// Harvest class names from selectors only (text before each "{"), so url() and
// declaration values never leak in.
const known = new Set();
let buf = '';
for (const ch of css) {
	if (ch === '{') {
		for (const m of buf.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) known.add(m[1]);
		buf = '';
	} else if (ch === '}' || ch === ';') buf = '';
	else buf += ch;
}

// Modifiers that only resolve as a compound with a base (.row.ycenter, ...).
const MODIFIER_BASES = {
	xcenter: ['box', 'row', 'grid'],
	xleft: ['box', 'row', 'grid'],
	xright: ['box', 'row', 'grid'],
	xbetween: ['row', 'grid'],
	xevenly: ['row', 'grid'],
	xaround: ['row', 'grid'],
	xstretch: ['grid'],
	ycenter: ['box', 'row', 'grid'],
	ytop: ['box', 'row', 'grid'],
	ybot: ['box', 'row', 'grid'],
	ybetween: ['box', 'grid'],
	yevenly: ['box', 'grid'],
	yaround: ['box', 'grid'],
	ystretch: ['grid'],
	center: ['grid'],
	fitted: ['input', 'select'],
	vertical: ['button-group', 'split-button']
};
const GRID_ALIASES = ['grid-1', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6'];

// Classes that set `display`. On a <dialog>, a [popover], or anything toggled
// with the `hidden` attribute, they beat the UA's display:none and the element
// never hides.
const DISPLAY_CLASSES = new Set([
	'box', 'row', 'grid', 'grid-1', 'grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6', 'card-grid',
	'prose', 'prose-section', 'nav-section', 'page-header', 'inputs-wrapper', 'checkbox-wrapper',
	'button-group', 'split-button', 'reel', 'app-shell', 'app-header', 'app-main', 'app-footer',
	'breadcrumb', 'sidebar-left', 'sidebar-right', 'input', 'select', 'button'
]);
const hidesNatively = (node) =>
	node.name === 'dialog' ||
	node.attributes.some((a) => a.type === 'Attribute' && (a.name === 'hidden' || a.name === 'popover'));

// By design, a button's data-variant owns its paint: every button[data-variant]
// rule except iconbox sets color, background and border. Ink, fill and border
// utilities on the same button therefore have no effect — choose the variant
// that paints what you want, or paint an inner element.
const INK_CLASSES = /^(text-(primary|secondary|muted|inverse|white|black|theme|theme-alt|theme-sub|success|warning|danger|info)|orange\d|yellow\d|green\d|bg-(main|surface|panel|sunken|raised|extra|success|warning|danger|info)|border(-subtle|-strong)?|b[trbl](-str|-sub)?)$/;
const paintsInk = (node) => {
	const dv = node.attributes.find((a) => a.type === 'Attribute' && a.name === 'data-variant');
	if (!dv) return false;
	const v = Array.isArray(dv.value) && dv.value.length === 1 && dv.value[0].type === 'Text' ? dv.value[0].data : null;
	return v !== 'iconbox';
};

const BANNED_SCRIPT = [
	[/from\s+['"]svelte\/transition['"]/, 'svelte/transition writes CSS at runtime'],
	[/from\s+['"]svelte\/animate['"]/, 'svelte/animate writes CSS at runtime'],
	[/\.style\b/, 'element.style writes inline CSS'],
	[/\.animate\(/, 'element.animate() writes CSS at runtime'],
	[/setProperty\(/, 'setProperty writes inline CSS']
];

const targets = process.argv.slice(2);
const roots = targets.length ? targets : ['src/lib/styler'];
const files = [];
function collect(p) {
	const st = fs.statSync(p);
	if (st.isDirectory()) for (const e of fs.readdirSync(p)) collect(path.join(p, e));
	else if (p.endsWith('.svelte')) files.push(p);
}
roots.forEach(collect);

const problems = [];
function report(file, source, offset, msg) {
	const line = source.slice(0, offset).split('\n').length;
	problems.push(`${file}:${line}  ${msg}`);
}

function stringsIn(node, out = []) {
	if (!node || typeof node !== 'object') return out;
	if (node.type === 'Literal' && typeof node.value === 'string') out.push(node.value);
	else if (node.type === 'TemplateLiteral') {
		for (const q of node.quasis) out.push(q.value.cooked ?? q.value.raw);
		for (const e of node.expressions) stringsIn(e, out);
		return out;
	} else if (node.type === 'Property' && node.key) {
		// class={{ 'bg-raised': active }} — the key is the class
		if (node.key.type === 'Identifier') out.push(node.key.name);
		else if (node.key.type === 'Literal') out.push(String(node.key.value));
		stringsIn(node.value, out);
		return out;
	}
	for (const [k, v] of Object.entries(node)) {
		if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue;
		if (k === 'callee' || k === 'test') continue; // fn names / conditions are not classes
		if (k === 'property' && node.computed) continue; // MAP[key ?? 'left'] — the key is not a class
		if (v && typeof v === 'object' && v.type === 'BinaryExpression') continue; // comparisons
		if (Array.isArray(v)) v.forEach((c) => stringsIn(c, out));
		else if (v && typeof v === 'object') stringsIn(v, out);
	}
	return out;
}

function checkClassString(file, source, offset, text, isStatic) {
	const tokens = text.split(/\s+/).filter(Boolean);
	for (const t of tokens) {
		if (!known.has(t)) report(file, source, offset, `unknown class ".${t}"`);
	}
	if (!isStatic) return;
	for (const t of tokens) {
		const bases = MODIFIER_BASES[t];
		if (!bases) continue;
		const ok = tokens.some((b) => bases.includes(b) || (bases.includes('grid') && GRID_ALIASES.includes(b)));
		if (!ok) report(file, source, offset, `modifier ".${t}" needs one of .${bases.join(', .')} on the same element`);
	}
}

for (const file of files) {
	const source = fs.readFileSync(file, 'utf8');
	let ast;
	try {
		ast = parse(source, { modern: true });
	} catch (err) {
		problems.push(`${file}  parse error: ${err.message}`);
		continue;
	}
	if (ast.css) report(file, source, ast.css.start, '<style> block');

	for (const script of [ast.instance, ast.module]) {
		if (!script) continue;
		const text = source.slice(script.start, script.end);
		for (const [re, why] of BANNED_SCRIPT) {
			const m = re.exec(text);
			if (m) report(file, source, script.start + m.index, why);
		}
		// Class maps declared in a component follow a naming convention
		// (FOO_CLASS / FOO_CLASSES) so their values can be verified here too.
		for (const m of text.matchAll(/const\s+[A-Z_]*CLASS(?:ES)?\b[^=]*=\s*\{([^}]*)\}/g)) {
			for (const v of m[1].matchAll(/:\s*'([^']*)'/g)) {
				checkClassString(file, source, script.start + m.index, v[1], false);
			}
		}
	}

	const walk = (node) => {
		if (!node || typeof node !== 'object') return;
		if (Array.isArray(node)) return node.forEach(walk);
		if (node.attributes && (node.type === 'RegularElement' || node.type === 'SvelteElement' || node.type === 'Component' || node.type === 'SvelteComponent')) {
			for (const attr of node.attributes) {
				if (attr.type === 'StyleDirective') report(file, source, attr.start, `style:${attr.name} directive`);
				if (attr.type === 'Attribute' && attr.name === 'style') report(file, source, attr.start, 'style attribute');
				if (attr.type === 'ClassDirective' && !known.has(attr.name)) report(file, source, attr.start, `unknown class directive class:${attr.name}`);
				if (attr.type === 'Attribute' && attr.name === 'class' && hidesNatively(node)) {
					const values = attr.value === true ? [] : Array.isArray(attr.value) ? attr.value : [attr.value];
					const tokens = values.flatMap((v) => (v.type === 'Text' ? [v.data] : stringsIn(v.expression))).join(' ').split(/\s+/);
					const bad = tokens.filter((t) => DISPLAY_CLASSES.has(t));
					if (bad.length)
						report(file, source, attr.start, `display class .${bad.join(', .')} on <${node.name}> overrides its native hidden state`);
				}
				if (attr.type === 'Attribute' && attr.name === 'class' && node.name === 'button' && paintsInk(node)) {
					const values = attr.value === true ? [] : Array.isArray(attr.value) ? attr.value : [attr.value];
					const tokens = values.flatMap((v) => (v.type === 'Text' ? [v.data] : stringsIn(v.expression))).join(' ').split(/\s+/);
					const ink = tokens.filter((t) => INK_CLASSES.test(t));
					if (ink.length)
						report(file, source, attr.start, `.${ink.join(', .')} on a <button data-variant>: the variant owns the button's color/background/border — choose a different variant or paint an inner element`);
				}
				if (attr.type === 'Attribute' && attr.name === 'class' && node.name === 'button') {
					const values = attr.value === true ? [] : Array.isArray(attr.value) ? attr.value : [attr.value];
					const tokens = values.flatMap((v) => (v.type === 'Text' ? [v.data] : stringsIn(v.expression))).join(' ').split(/\s+/);
					if (tokens.includes('card'))
						report(file, source, attr.start, '.card on a <button>: its data-variant also triggers button[data-variant] paint');
				}
				if (attr.type === 'Attribute' && attr.name === 'class') {
					const values = attr.value === true ? [] : Array.isArray(attr.value) ? attr.value : [attr.value];
					const allStatic = values.every((v) => v.type === 'Text');
					const staticText = values.filter((v) => v.type === 'Text').map((v) => v.data).join(' ');
					// A component's own `class` prop is forwarded, so a bare {className}
					// passthrough is fine; literals inside expressions are still checked.
					checkClassString(file, source, attr.start, staticText, allStatic);
					for (const v of values) {
						if (v.type === 'ExpressionTag') {
							for (const s of stringsIn(v.expression)) checkClassString(file, source, attr.start, s, false);
						}
					}
				}
			}
		}
		for (const [k, v] of Object.entries(node)) {
			if (k === 'attributes' || k === 'start' || k === 'end') continue;
			if (v && typeof v === 'object') walk(v);
		}
	};
	walk(ast.fragment);
}

// Class lookup tables: every string value in them must be a real class.
for (const root of roots) {
	const tables = path.join(fs.statSync(root).isDirectory() ? root : path.dirname(root), 'classes.ts');
	if (!fs.existsSync(tables)) continue;
	const source = fs.readFileSync(tables, 'utf8');
	for (const m of source.matchAll(/:\s*'([^']+)'/g)) {
		checkClassString(tables, source, m.index, m[1], false);
	}
}

if (problems.length) {
	console.log(problems.join('\n'));
	console.log(`\n✖ ${problems.length} problem(s) in ${files.length} file(s) (registry: ${known.size} classes)`);
	process.exit(1);
}
console.log(`✔ ${files.length} file(s) clean against ${known.size} fractalstyler classes`);
