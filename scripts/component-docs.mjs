// @ts-nocheck
// Steps 1 + 2 of the component-docs pipeline (AGENTS.md):
//   1. Component list  <- src/lib/components/index.ts (export name, path, category from `// Section` comments),
//      plus a one-line description from the component's `<!-- @component ... -->` comment.
//   2. Props per comp  <- `interface Props` + `$props()` defaults, plus preview props
//      from src/site/data/component-previews.ts resolved against src/lib/types.ts.
// Usage: node scripts/component-docs.mjs [Name ...]   (no names = every component)
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

/** @typedef {{ name: string, title: string, path: string, category: string | null, description: string | null }} ComponentEntry */
/** @typedef {{ name: string, type: string, optional: boolean, comment: string | null }} RawProp */
/** @typedef {RawProp & { default: string | null, bindable: boolean }} PropEntry */
/** @typedef {{ label: string, value: unknown, extra?: Record<string, unknown> }} CoreExample */
/** @typedef {{ extends: string[], props: PropEntry[], coreProps: Record<string, CoreExample[]> }} ComponentProps */

const root = path.resolve(import.meta.dirname, '..');
const compsDir = path.join(root, 'src/lib/components');
const outDir = path.join(root, 'src/site/doc/data');
const only = process.argv.slice(2);

// --- src/lib/types.ts: const arrays and the union types built from them ---------------
const typesSrc = fs.readFileSync(path.join(root, 'src/lib/types.ts'), 'utf8');
/** @type {Record<string, string[]>} Variants -> ['primary', ...] */
const consts = {};
for (const m of typesSrc.matchAll(/export const (\w+) = \[([\s\S]*?)\] as const/g))
	consts[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
/** @type {Record<string, string>} Variant -> Variants */
const unions = {};
for (const m of typesSrc.matchAll(/export type (\w+) = \(typeof (\w+)\)\[number\]/g)) unions[m[1]] = m[2];

// --- Step 1: component list -----------------------------------------------------
/**
 * First line of the Svelte `<!-- @component ... -->` doc comment.
 * @param {string} rel path under lib/components, without .svelte
 * @returns {string | null}
 */
function describe(rel) {
	const src = fs.readFileSync(path.join(compsDir, rel + '.svelte'), 'utf8');
	const m = src.match(/<!--\s*@component\s*([\s\S]*?)-->/);
	const line = m?.[1].split('\n').map((l) => l.trim()).find(Boolean);
	return line ?? null;
}

const titleOf = (name) =>
	name.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

/** @type {ComponentEntry[]} */
const components = [];
/** @type {string | null} */
let category = null;
for (const line of fs.readFileSync(path.join(compsDir, 'index.ts'), 'utf8').split('\n')) {
	const c = line.match(/^\/\/\s*(.+)$/);
	if (c) category = c[1].trim();
	const e = line.match(/export \{ default as (\w+) \} from '\.\/(.+)\.svelte'/);
	if (e && (!only.length || only.includes(e[1])))
		components.push({ name: e[1], title: titleOf(e[1]), path: e[2], category, description: describe(e[2]) });
}

// --- Step 2: props per component ------------------------------------------------
function extract(file) {
	const src = fs.readFileSync(file, 'utf8');
	const scripts = [...src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
	const code = scripts.map((m) => m[2]).join('\n');
	const sf = ts.createSourceFile('c.ts', code, ts.ScriptTarget.Latest, true);
	const text = (n) => n.getText(sf).replace(/\s+/g, ' ').trim();
	const raw = [];
	let ext = [];
	const defaults = {};
	const bindable = new Set();

	function visit(n) {
		if (ts.isInterfaceDeclaration(n) && n.name.text === 'Props') {
			ext = (n.heritageClauses ?? []).flatMap((h) => h.types.map(text));
			for (const m of n.members) {
				if (!ts.isPropertySignature(m)) continue;
				const jsdoc = ts
					.getJSDocCommentsAndTags(m)
					.filter(ts.isJSDoc)
					.map((d) => ts.getTextOfJSDocComment(d.comment))
					.filter(Boolean)
					.join(' ');
				raw.push({
					name: m.name.getText(sf),
					type: m.type ? text(m.type) : 'unknown',
					optional: !!m.questionToken,
					comment: jsdoc || null
				});
			}
		}
		if (
			ts.isVariableDeclaration(n) &&
			ts.isObjectBindingPattern(n.name) &&
			n.initializer &&
			/\$props\(\)/.test(text(n.initializer))
		) {
			for (const el of n.name.elements) {
				if (el.dotDotDotToken || !el.initializer) continue;
				const key = (el.propertyName ?? el.name).getText(sf);
				const init = text(el.initializer);
				const b = init.match(/^\$bindable\((.*)\)$/);
				if (b) bindable.add(key);
				const d = b ? b[1] : init;
				if (d) defaults[key] = d;
			}
		}
		ts.forEachChild(n, visit);
	}
	visit(sf);

	const props = raw.map((p) => ({ ...p, default: defaults[p.name] ?? null, bindable: bindable.has(p.name) }));
	return { extends: ext, props, coreProps: {} };
}

// --- Step 3: preview props from src/site/data/component-previews.ts ------------------
const curatedSrc = fs.readFileSync(path.join(root, 'src/site/data/component-previews.ts'), 'utf8');
/** @type {Record<string, string[]>} */
const curated = {};
for (const m of curatedSrc.matchAll(/'([\w/]+)':\s*\[([^\]]*)\]/g))
	curated[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);

const CARDLIKE = new Set(['layout/Card', 'layout/ClickableCard', 'layout/SelectableCard']);
const SAMPLE_TEXT = {
	avatar: 'https://picsum.photos/id/64/80/80',
	timeframe: 'vs last month',
	title: 'Title',
	label: 'Label',
	description: 'A short description.',
	badge: 'New',
	placeholder: 'Type here…',
	popularLabel: 'Best value',
	helperText: 'Helper text',
	unit: '%',
	prefix: '$',
	suffix: 'k',
	shortcut: '⌘K',
	counter: '12/50',
	error: 'Something went wrong'
};

/** Local type aliases across lib/components */
const aliases = {};
(function scan(dir) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const f = path.join(dir, e.name);
		if (e.isDirectory()) scan(f);
		else if (/\.(svelte|ts)$/.test(e.name))
			for (const m of fs.readFileSync(f, 'utf8').matchAll(/(?:export\s+)?type\s+(\w+)\s*=\s*([^;=]+?)(?:;|\n\s*(?:export|const|let|interface|type|\/\/|\/\*|<\/script>|$))/g))
				if (!(m[1] in aliases)) aliases[m[1]] = m[2].replace(/\s+/g, ' ').replace(/^\|\s*/, '').trim();
	}
})(compsDir);

function parts(type) {
	const out = []; let depth = 0, cur = '';
	for (const ch of type) {
		if ('<([{'.includes(ch)) depth++;
		if ('>)]}'.includes(ch)) depth--;
		if (ch === '|' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
	}
	if (cur.trim()) out.push(cur.trim());
	return out;
}

function examples(name, prop, compPath) {
	if (!prop) return [{ label: 'snippet', value: { $snippet: 'Sample' } }];
	const t = prop.type;
	const ex = [];
	const add = (v, label = v === undefined ? 'none' : String(v)) => ex.push({ label, value: v });
	const expand = (type, depth = 0) =>
		parts(type).flatMap((pt) => (aliases[pt] && !unions[pt] && depth < 4 ? expand(aliases[pt], depth + 1) : [pt]));
	for (let part of expand(t)) {
		const ex2 = part.match(/^Exclude<(\w+),\s*(.+)>$/);
		let values = null;
		if (ex2) {
			const drop = [...ex2[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
			values = (consts[unions[ex2[1]]] ?? []).filter((v) => !drop.includes(v));
		} else if (unions[part]) values = consts[unions[part]];
		if (values) { values.forEach((v) => add(v)); continue; }
		if (/^'.*'$/.test(part)) { add(part.slice(1, -1)); continue; }
		if (/^-?\d+(\.\d+)?$/.test(part)) { add(Number(part)); continue; }
		if (part === 'boolean') { add(false); add(true); continue; }
		if (/^Snippet/.test(part)) { add(undefined); ex.push({ label: 'snippet', value: { $snippet: SAMPLE_TEXT[name] ?? 'Sample' } }); continue; }
		if (part === 'IconData') { add(undefined); ex.push({ label: 'icon', value: { $icon: 'luStar' } }); continue; }
		if (part === 'string') { ex.push({ label: SAMPLE_TEXT[name] ?? 'Sample', value: SAMPLE_TEXT[name] ?? 'Sample' }); continue; }
		if (part === 'number') {
			const d = Number(prop.default);
			const a = Number.isFinite(d) ? d : 1;
			if (name === 'decimals') { add(0); add(2); continue; }
			add(a); add(a === 0 ? 50 : a * 3);
			continue;
		}
	}
	if (!ex.length && /\[\]$/.test(t)) { ex.push({ label: 'none', value: [] }, { label: 'sample', value: { $base: name } }); }
	if (!ex.length) ex.push({ label: 'sample', value: { $base: name } });
	const out = CARDLIKE.has(compPath) && name === 'shape' ? ex.filter((e) => e.value !== 'round') : ex;
	return out.filter((e, i) => out.findIndex((x) => x.label === e.label) === i);
}

/** @type {Record<string, ComponentProps>} */
const propsData = {};
for (const c of components) {
	const d = extract(path.join(compsDir, c.path + '.svelte'));
	const list = curated[c.path] ?? [];
	d.coreProps = Object.fromEntries(list.map((n) => [n, examples(n, d.props.find((p) => p.name === n), c.path)]));
	propsData[c.path] = d;
}

fs.mkdirSync(outDir, { recursive: true });
const banner = { _generated: 'by scripts/component-docs.mjs — do not edit by hand' };
fs.writeFileSync(path.join(outDir, 'components.json'), JSON.stringify({ ...banner, components }, null, '\t') + '\n');
fs.writeFileSync(path.join(outDir, 'props.json'), JSON.stringify({ ...banner, props: propsData }, null, '\t') + '\n');
console.log(`[component-docs] ${components.length} component(s) -> src/site/doc/data/{components,props}.json`);
