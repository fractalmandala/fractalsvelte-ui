// The gate's rules. Each check returns diagnostics; nothing here throws on bad input.

import ts from 'typescript';
import path from 'node:path';
import type { ComponentAnalysis, KitInfo } from './analysis.ts';
import { parseTs } from './api.ts';
import type { LayerBuild } from './css.ts';
import { extractScripts, markupOf, matchJsBrace, skipQuoted, stringLiterals } from './svelte.ts';
import { PATHS, closest, cssCodeLines, escapeRe, lineAt, listDir, readText, rel, walkFiles } from './util.ts';

export interface Diag {
	rule: string;
	severity: 'error' | 'warning';
	file: string;
	line: number | null;
	message: string;
	fix: string;
}

export const KIT_BUDGET = 90;

// ── the class allowlist ─────────────────────────────────────────────────────

export interface Allowlist {
	classes: Set<string>;
	stems: string[];
	registryFound: boolean;
}

export function loadAllowlist(layers: LayerBuild): Allowlist {
	const classes = new Set<string>();
	const stems: string[] = [];
	const raw = readText(PATHS.fsRegistry);
	let registryFound = false;
	if (raw) {
		try {
			const rows = JSON.parse(raw) as { class?: string }[];
			registryFound = Array.isArray(rows);
			for (const row of Array.isArray(rows) ? rows : []) {
				const name = (row.class ?? '').replace(/^\./, '').trim();
				if (!name) continue;
				if (name.includes('*')) stems.push(name.replace(/\*.*$/, ''));
				else classes.add(name);
			}
		} catch {
			registryFound = false;
		}
	}
	for (const c of layers.harvested) classes.add(c);
	return { classes, stems, registryFound };
}

export function isAllowed(cls: string, allow: Allowlist): boolean {
	return allow.classes.has(cls) || allow.stems.some((s) => cls.startsWith(s)) || /-(mob|desk)$/.test(cls);
}

function unknownClass(cls: string, file: string, line: number, allow: Allowlist): Diag {
	const near = closest(cls, allow.classes, 3);
	return {
		rule: 'class/unknown',
		severity: 'error',
		file,
		line,
		message: `class "${cls}" is not in the fractalstyler registry or the fractalsvelte-ui extension layer`,
		fix: near.length
			? `did you mean ${near.map((n) => `"${n}"`).join(', ')}? (registry.md / src/lib/styles/layers)`
			: 'compose from registry.md, or add the smallest general primitive to your kit fragment'
	};
}

// ── class tokens in markup ──────────────────────────────────────────────────

const CLASSY = /^[a-z][a-z0-9-]*$/;
const COMPARE_BEFORE = /(===|!==|==|!=|\bin|\bcase)\s*$/;
const COMPARE_AFTER = /^\s*(===|!==|==|!=|in\b)/;

/** Class-looking tokens of the string literals inside a JS expression (comparison operands skipped). */
function expressionClassTokens(expr: string): { token: string; offset: number }[] {
	const out: { token: string; offset: number }[] = [];
	for (const lit of stringLiterals(expr)) {
		if (lit.interpolated) continue;
		// comparison operands (`x === 'vertical'`), `case 'x':` labels and `'x' in o` are not class lists
		if (COMPARE_BEFORE.test(expr.slice(0, lit.start)) || COMPARE_AFTER.test(expr.slice(lit.end))) continue;
		let pos = 0;
		for (const tok of lit.value.split(/(\s+)/)) {
			if (tok && !/^\s+$/.test(tok) && CLASSY.test(tok)) out.push({ token: tok, offset: lit.start + 1 + pos });
			pos += tok.length;
		}
	}
	return out;
}

interface ScriptVar {
	init: string;
	offset: number;
}

/** `const x = …` / `let x = …` initialisers of the instance script, by name. */
function scriptVars(src: string): Map<string, ScriptVar> {
	const out = new Map<string, ScriptVar>();
	for (const s of extractScripts(src)) {
		const sf = parseTs(s.content, 'vars.ts');
		const visit = (n: ts.Node) => {
			if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
				const start = n.initializer.getStart(sf);
				out.set(n.name.text, { init: n.initializer.getText(sf), offset: s.offset + start });
			}
			ts.forEachChild(n, visit);
		};
		visit(sf);
	}
	return out;
}

export function checkSvelteClasses(file: string, src: string, allow: Allowlist): Diag[] {
	const out: Diag[] = [];
	const markup = markupOf(src);
	const vars = scriptVars(src);
	const relFile = rel(file);
	const checked = new Set<string>();
	const check = (cls: string, offset: number) => {
		if (!isAllowed(cls, allow)) out.push(unknownClass(cls, relFile, lineAt(src, offset), allow));
	};
	const checkExpr = (expr: string, base: number) => {
		for (const t of expressionClassTokens(expr)) check(t.token, base + t.offset);
		// identifiers that name script variables: check their initialisers too
		for (const m of expr.matchAll(/(?<![\w$.'"`-])([A-Za-z_$][\w$]*)(?![\w$])/g)) {
			const v = vars.get(m[1]);
			if (!v || checked.has(m[1])) continue;
			// only identifiers used as class values — not comparison operands, calls or member bases
			const at = m.index ?? 0;
			if (/^\s*(===|!==|==|!=|\.|\(|\[)/.test(expr.slice(at + m[1].length)) || /(===|!==|==|!=|\.)\s*$/.test(expr.slice(0, at))) continue;
			checked.add(m[1]);
			for (const t of expressionClassTokens(v.init)) check(t.token, v.offset + t.offset);
		}
	};

	const ATTR = /(?<=[\s])class\s*=\s*/g;
	for (const m of markup.matchAll(ATTR)) {
		const at = (m.index ?? 0) + m[0].length;
		const q = markup[at];
		if (q === '"' || q === "'") {
			let i = at + 1;
			let staticText = '';
			while (i < markup.length && markup[i] !== q) {
				if (markup[i] === '{') {
					const close = matchJsBrace(markup, i);
					if (close < 0) break;
					checkExpr(markup.slice(i + 1, close), i + 1);
					staticText += ' '.repeat(close - i + 1);
					i = close + 1;
					continue;
				}
				staticText += markup[i];
				i++;
			}
			let pos = 0;
			for (const tok of staticText.split(/(\s+)/)) {
				if (tok && !/^\s+$/.test(tok)) check(tok, at + 1 + pos);
				pos += tok.length;
			}
		} else if (q === '{') {
			const close = matchJsBrace(markup, at);
			if (close > at) checkExpr(markup.slice(at + 1, close), at + 1);
		}
	}
	for (const m of markup.matchAll(/(?<=[\s])class:([\w-]+)/g)) check(m[1], m.index ?? 0);
	return out;
}

/** String literals of the exported `Record<…, string>` maps in tokens.ts. */
export function checkTokenMaps(allow: Allowlist): Diag[] {
	const src = readText(PATHS.tokensTs);
	if (!src) return [];
	const out: Diag[] = [];
	const sf = parseTs(src, 'tokens.ts');
	for (const st of sf.statements) {
		if (!ts.isVariableStatement(st) || !st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
		for (const d of st.declarationList.declarations) {
			if (!d.type || !/^Record</.test(d.type.getText(sf)) || !d.initializer || !ts.isObjectLiteralExpression(d.initializer)) continue;
			for (const p of d.initializer.properties) {
				if (!ts.isPropertyAssignment(p) || !ts.isStringLiteral(p.initializer)) continue;
				for (const tok of p.initializer.text.split(/\s+/).filter(Boolean)) {
					if (!isAllowed(tok, allow)) {
						out.push(unknownClass(tok, rel(PATHS.tokensTs), sf.getLineAndCharacterOfPosition(p.getStart(sf)).line + 1, allow));
					}
				}
			}
		}
	}
	return out;
}

// ── Law 1: no styles, no svg, JS writes only custom properties ──────────────

function startsWithDashes(arg: ts.Expression | undefined): boolean {
	if (!arg) return false;
	if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) return arg.text.startsWith('--');
	if (ts.isTemplateExpression(arg)) return arg.head.text.startsWith('--');
	return false;
}

function isStyleAccess(n: ts.Expression): boolean {
	return (ts.isPropertyAccessExpression(n) && n.name.text === 'style') || (ts.isElementAccessExpression(n) && ts.isStringLiteral(n.argumentExpression) && n.argumentExpression.text === 'style');
}

/** AST checks on one script / TS module. */
export function checkScriptAst(code: string, file: string, lineBase: number, inMotion: boolean): Diag[] {
	const out: Diag[] = [];
	const sf = parseTs(code, path.basename(file) + '.ts');
	const line = (n: ts.Node) => lineBase + sf.getLineAndCharacterOfPosition(n.getStart(sf)).line;
	const push = (n: ts.Node, message: string, fix: string) =>
		out.push({ rule: 'style/js-write', severity: 'error', file, line: line(n), message, fix });
	const CP_FIX = "write a custom property — node.style.setProperty('--x', v) or the vars() attachment — and let a class own the real property";

	const visit = (n: ts.Node) => {
		if (ts.isBinaryExpression(n) && n.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && n.operatorToken.kind <= ts.SyntaxKind.LastAssignment) {
			const left = n.left;
			if (isStyleAccess(left)) push(n, 'assigns element.style directly', CP_FIX);
			else if ((ts.isPropertyAccessExpression(left) || ts.isElementAccessExpression(left)) && isStyleAccess(left.expression)) {
				const prop = ts.isPropertyAccessExpression(left) ? left.name.text : left.argumentExpression.getText(sf);
				push(n, prop === 'cssText' ? 'writes .style.cssText' : `assigns .style.${prop.replace(/['"]/g, '')}`, CP_FIX);
			}
		}
		if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression)) {
			const method = n.expression.name.text;
			const target = n.expression.expression;
			if (method === 'setProperty' && isStyleAccess(target) && !startsWithDashes(n.arguments[0]) && !inMotion) {
				const lit = n.arguments[0] && (ts.isStringLiteral(n.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(n.arguments[0]));
				push(
					n,
					lit ? `style.setProperty(${n.arguments[0].getText(sf)}) sets a real property` : 'style.setProperty() with a non-literal name (only src/lib/motion and src/lib/theme may)',
					"name a custom property literally: setProperty('--x', …)"
				);
			}
			if (method === 'setAttribute' && n.arguments[0] && (ts.isStringLiteral(n.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(n.arguments[0])) && n.arguments[0].text.toLowerCase() === 'style') {
				push(n, "setAttribute('style', …)", CP_FIX);
			}
			if (method === 'assign' && target.getText(sf) === 'Object' && n.arguments[0] && isStyleAccess(n.arguments[0])) {
				push(n, 'Object.assign(element.style, …)', CP_FIX);
			}
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return out;
}

// ── imports ─────────────────────────────────────────────────────────────────

const LIB_BARE = /^(svelte(\/.*)?|@fractaldesign\/icons(\/.*)?)$/;
const EXAMPLE_ALLOWED = /^(svelte(\/.*)?|@fractaldesign\/icons(\/.*)?|@fractaldesign\/fractalsvelte-ui(\/motion|\/theme)?)$/;

export function moduleSpecifiers(code: string): { spec: string; line: number }[] {
	const sf = parseTs(code, 'imports.ts');
	const out: { spec: string; line: number }[] = [];
	const add = (lit: ts.Expression | undefined) => {
		if (lit && ts.isStringLiteral(lit)) out.push({ spec: lit.text, line: sf.getLineAndCharacterOfPosition(lit.getStart(sf)).line });
	};
	const visit = (n: ts.Node) => {
		if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) add(n.moduleSpecifier);
		else if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword) add(n.arguments[0]);
		else if (ts.isImportTypeNode(n) && ts.isLiteralTypeNode(n.argument)) add(n.argument.literal);
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return out;
}

export function checkImports(code: string, file: string, lineBase: number, isExample: boolean): Diag[] {
	const out: Diag[] = [];
	for (const { spec, line } of moduleSpecifiers(code)) {
		let bad = false;
		let fix = '';
		if (isExample) {
			if (!EXAMPLE_ALLOWED.test(spec)) {
				bad = true;
				fix = "examples import exactly what a consumer writes: '@fractaldesign/fractalsvelte-ui' (/motion, /theme), '@fractaldesign/icons*', 'svelte*'";
			}
		} else if (spec.startsWith('.')) {
			const target = path.resolve(path.dirname(path.join(PATHS.root, file)), spec);
			if (!target.startsWith(PATHS.lib + path.sep)) {
				bad = true;
				fix = 'relative imports must stay inside src/lib';
			}
		} else if (!LIB_BARE.test(spec)) {
			bad = true;
			fix = "inside src/lib import relatively (no $lib, no #lib); only 'svelte*' and '@fractaldesign/icons*' are bare";
		}
		if (bad) out.push({ rule: 'import/forbidden', severity: 'error', file, line: lineBase + line, message: `import '${spec}'`, fix });
	}
	return out;
}

// ── per-file Law 1 ──────────────────────────────────────────────────────────

const GLYPHS = /[✓✔✗✘✕✖☰▾▴▸◂▶◀★☆⨯]/;

export function checkFile(full: string, allow: Allowlist | null): Diag[] {
	const file = rel(full);
	const src = readText(full);
	if (src === null) return [];
	const out: Diag[] = [];
	// the runtime modules that own custom-property channels may name them through variables
	const inMotion = full.startsWith(PATHS.motion + path.sep) || full.startsWith(PATHS.theme + path.sep);
	const isExample = file.split('/').includes('examples');
	try {
		if (full.endsWith('.svelte')) {
			const noComments = src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
			const markup = markupOf(src);
			const styleBlock = noComments.search(/<style[\s>]/);
			if (styleBlock >= 0)
				out.push({ rule: 'style/block', severity: 'error', file, line: lineAt(src, styleBlock), message: '<style> block', fix: 'delete it; compose fractalstyler classes in markup' });
			for (const m of markup.matchAll(/\sstyle\s*=/g))
				out.push({ rule: 'style/inline', severity: 'error', file, line: lineAt(src, m.index ?? 0), message: 'style="…" attribute', fix: 'use classes; pass dynamic values as custom properties with the vars() attachment' });
			for (const m of markup.matchAll(/\sstyle:([\w-]+)/g))
				out.push({ rule: 'style/inline', severity: 'error', file, line: lineAt(src, m.index ?? 0), message: `style:${m[1]} directive`, fix: 'use classes; pass dynamic values as custom properties with the vars() attachment' });
			for (const m of noComments.matchAll(/<svg[\s>/]/g))
				out.push({ rule: 'icons/inline-svg', severity: 'error', file, line: lineAt(src, m.index ?? 0), message: 'inline <svg>', fix: "use <Icon icon={luName} /> from '@fractaldesign/icons'" });
			// visible text only: strip tags and expressions
			const text = markup.replace(/<[^>]*>/g, (m) => m.replace(/[^\n]/g, ' ')).replace(/\{[^}]*\}/g, (m) => m.replace(/[^\n]/g, ' '));
			const g = text.search(GLYPHS);
			if (g >= 0)
				out.push({ rule: 'icons/glyph', severity: 'warning', file, line: lineAt(src, g), message: `unicode glyph "${text[g]}" used as an icon`, fix: "use <Icon icon={luName} /> from '@fractaldesign/icons'" });
			for (const m of markup.matchAll(/\.style\.(cssText|[a-zA-Z]+)\s*=(?!=)|setAttribute\(\s*['"`]style['"`]/g))
				out.push({ rule: 'style/js-write', severity: 'error', file, line: lineAt(src, m.index ?? 0), message: `writes a real style property in markup (${m[0].trim()})`, fix: "write a custom property — setProperty('--x', v) or vars()" });
			for (const s of extractScripts(src)) {
				out.push(...checkScriptAst(s.content, file, s.line, inMotion));
				out.push(...checkImports(s.content, file, s.line, isExample));
			}
			if (allow) out.push(...checkSvelteClasses(full, src, allow));
		} else if (full.endsWith('.ts')) {
			out.push(...checkScriptAst(src, file, 1, inMotion));
			out.push(...checkImports(src, file, 1, isExample));
			const noComments = src.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
			for (const m of noComments.matchAll(/<svg[\s>/]/g))
				out.push({ rule: 'icons/inline-svg', severity: 'error', file, line: lineAt(src, m.index ?? 0), message: 'inline <svg> markup in a string', fix: "use <Icon icon={luName} /> from '@fractaldesign/icons'" });
		}
	} catch (err) {
		out.push({ rule: 'analysis/crash', severity: 'error', file, line: null, message: `could not analyse: ${(err as Error).message}`, fix: 'fix the syntax error' });
	}
	return out;
}

// ── a component folder ──────────────────────────────────────────────────────

export interface GateContext {
	allow: Allowlist;
	kits: KitInfo[];
	slugs: Set<string>;
	/** export name → component ids exporting it. */
	exportOwners: Map<string, string[]>;
}

const DOC_KEYS = new Set(['name', 'summary', 'description', 'parts', 'features', 'accessibility', 'keyboard', 'api', 'related', 'status']);
const EXEMPT = new Set(['class', 'children', 'ref']);

function isNonEmptyString(v: unknown): v is string {
	return typeof v === 'string' && v.trim() !== '';
}

export function checkComponent(a: ComponentAnalysis, ctx: GateContext): Diag[] {
	const out: Diag[] = [];
	const dir = a.ref.relDir;
	const f = (name: string) => `${dir}/${name}`;
	const err = (rule: string, file: string, line: number | null, message: string, fix: string) =>
		out.push({ rule, severity: 'error', file, line, message, fix });
	const warn = (rule: string, file: string, line: number | null, message: string, fix: string) =>
		out.push({ rule, severity: 'warning', file, line, message, fix });

	if (a.crash) {
		err('analysis/crash', dir, null, a.crash.split('\n')[0], 'fix the syntax error in this folder');
		return out;
	}
	if (!ctx.kits.some((k) => k.id === a.ref.kit))
		err('kit/unknown', dir, null, `kit "${a.ref.kit}" is not listed in src/lib/components/kits.ts`, `use one of: ${ctx.kits.map((k) => k.id).join(', ')}`);
	if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(a.ref.slug))
		err('folder/name', dir, null, `folder "${a.ref.slug}" is not kebab-case`, 'rename the folder (e.g. icon-button)');

	// ── structure
	if (!a.hasPrimary) err('folder/primary', f(a.primaryFile), null, `missing the primary component ${a.primaryFile}`, `create ${a.primaryFile} (PascalCase of the folder name)`);
	if (!a.hasIndex) err('folder/index', f('index.ts'), null, 'missing index.ts', `export { default as ${a.name} } from './${a.primaryFile}';`);
	if (!a.hasDoc) err('doc/missing', f('doc.ts'), null, 'missing doc.ts', "export default defineDoc({ … }) — see AGENTS.md 'doc.ts'");
	if (a.examples.length === 0) err('examples/missing', f('examples/'), null, 'no examples', 'add examples/01-usage.svelte (the minimal usage)');
	else if (!a.examples.some((e) => e.file.startsWith('01'))) err('examples/first', f('examples/01-usage.svelte'), null, 'example 01 is missing', 'name the minimal usage examples/01-usage.svelte');
	for (const e of a.examples) {
		if (!e.headerOk)
			err('examples/header', f(`examples/${e.file}`), 1, 'first line is not an example header', 'start with <!-- @example Title :: One sentence describing what it shows. -->');
	}

	// ── index.ts (rule 1)
	if (a.indexError) err('index/parse', f('index.ts'), null, a.indexError, 'fix index.ts');
	if (a.hasIndex) {
		const svelteExports = a.exports.filter((e) => e.svelteFile).map((e) => (e.svelteFile ?? '').replace(/^\.\//, ''));
		if (a.hasPrimary && !a.exports.some((e) => e.name === a.name && e.svelteFile?.replace(/^\.\//, '') === a.primaryFile))
			err('index/export', f('index.ts'), null, `index.ts does not export ${a.name}`, `export { default as ${a.name} } from './${a.primaryFile}';`);
		for (const s of a.svelteFiles) {
			if (s !== a.primaryFile && !svelteExports.includes(s))
				err('index/export', f('index.ts'), null, `part ${s} is not exported`, `export { default as ${s.replace(/\.svelte$/, '')} } from './${s}';`);
		}
		for (const e of a.exports) {
			const owners = ctx.exportOwners.get(e.name) ?? [];
			if (owners.length > 1)
				err('index/duplicate', f('index.ts'), e.line, `export "${e.name}" is also exported by ${owners.filter((o) => o !== `${a.ref.kit}/${a.ref.slug}`).join(', ')}`, 'export names are global (one barrel) — rename one');
		}
	}

	// ── Props + JSDoc (rule 2)
	for (const p of a.parts) {
		for (const prob of p.problems) err('props/missing', f(p.file), 1, prob, 'add <script lang="ts"> with interface Props');
		if (!p.hasProps && p.problems.length === 0) {
			err('props/missing', f(p.file), 1, `${p.name} declares no interface Props`, 'declare interface Props in the instance script, every member with a JSDoc comment');
			continue;
		}
		for (const prop of p.props) {
			if (!prop.description)
				err('props/undocumented', f(p.file), prop.line, `prop "${prop.name}" has no JSDoc description`, `/** One sentence: what ${prop.name} does. */`);
		}
	}

	// ── doc.ts (rule 3)
	if (a.doc) {
		const docFile = f('doc.ts');
		if (a.doc.error || !a.doc.value) {
			err('doc/static', docFile, a.doc.line, a.doc.error ?? 'unreadable', 'pass a plain object literal (strings, arrays, objects) to defineDoc');
		} else {
			const d = a.doc.value;
			const line = a.doc.line;
			for (const k of Object.keys(d)) if (!DOC_KEYS.has(k)) err('doc/unknown-key', docFile, line, `unknown key "${k}"`, `keys: ${[...DOC_KEYS].join(', ')}`);
			if (d.name !== a.name) err('doc/name', docFile, line, `name is ${JSON.stringify(d.name ?? null)}, expected "${a.name}"`, `name: '${a.name}'`);
			if (!isNonEmptyString(d.summary)) err('doc/summary', docFile, line, 'summary is missing', 'one sentence, ending with a period');
			else {
				if (d.summary.length > 160) err('doc/summary', docFile, line, `summary is ${d.summary.length} chars (max 160)`, 'shorten it to one sentence');
				if (!d.summary.trim().endsWith('.')) err('doc/summary', docFile, line, 'summary does not end with a period', 'end the sentence with "."');
			}
			if (!isNonEmptyString(d.description) || d.description.trim().length < 80)
				err('doc/description', docFile, line, `description is ${typeof d.description === 'string' ? d.description.trim().length : 0} chars (min 80)`, 'one to three paragraphs on what it is and when to use it');
			if (!Array.isArray(d.accessibility) || d.accessibility.length === 0 || !d.accessibility.every(isNonEmptyString))
				err('doc/accessibility', docFile, line, 'accessibility needs at least one non-empty statement', "accessibility: ['Renders a native <button> …']");

			const partNames = a.parts.filter((p) => p.name !== a.name).map((p) => p.name).sort();
			const docParts = d.parts && typeof d.parts === 'object' && !Array.isArray(d.parts) ? d.parts : {};
			if (d.parts !== undefined && (typeof d.parts !== 'object' || Array.isArray(d.parts) || d.parts === null))
				err('doc/parts', docFile, line, 'parts must be an object { PartName: "what it is for" }', 'parts: { DialogTitle: "…" }');
			const keys = Object.keys(docParts).sort();
			for (const n of partNames) if (!keys.includes(n)) err('doc/parts', docFile, line, `part ${n} is not described in parts`, `parts: { ${n}: 'One line: what this part is for.' }`);
			for (const k of keys) {
				if (!partNames.includes(k)) err('doc/parts', docFile, line, `parts.${k} is not an exported .svelte part`, 'remove it, or export the part from index.ts');
				else if (!isNonEmptyString((docParts as Record<string, unknown>)[k])) err('doc/parts', docFile, line, `parts.${k} is empty`, 'one line on what the part is for');
			}

			if (d.features !== undefined && (!Array.isArray(d.features) || !d.features.every(isNonEmptyString)))
				err('doc/empty', docFile, line, 'features must be non-empty strings', "features: ['Spring-pressed', …]");
			if (d.keyboard !== undefined) {
				const ok = Array.isArray(d.keyboard) && d.keyboard.every((k) => k !== null && typeof k === 'object' && !Array.isArray(k) && isNonEmptyString(k.keys) && isNonEmptyString(k.action));
				if (!ok) err('doc/keyboard', docFile, line, 'keyboard entries need non-empty keys and action', "keyboard: [{ keys: 'Enter', action: 'Activates.' }]");
			}
			const apiNames: string[] = [];
			if (d.api !== undefined) {
				const ok = Array.isArray(d.api) && d.api.every((x) => x !== null && typeof x === 'object' && !Array.isArray(x) && isNonEmptyString(x.name) && isNonEmptyString(x.type) && isNonEmptyString(x.description));
				if (!ok) err('doc/api', docFile, line, 'api entries need non-empty name, type and description', "api: [{ name: 'toast(message)', type: '(m: string) => string', description: '…' }]");
				else for (const x of d.api as { name: string }[]) apiNames.push(x.name.split(/[(<\s.]/)[0]);
			}
			for (const e of a.exports) {
				if (e.isType || e.svelteFile) continue;
				if (!apiNames.includes(e.name))
					warn('doc/api-missing', docFile, line, `non-component export "${e.name}" is not in doc.api`, `api: [{ name: '${e.name}(…)', type: '…', description: '…' }]`);
			}
			if (d.related !== undefined) {
				if (!Array.isArray(d.related) || !d.related.every(isNonEmptyString)) err('doc/related', docFile, line, 'related must be an array of slugs', "related: ['icon-button']");
				else for (const r of d.related as string[]) if (!ctx.slugs.has(r)) warn('doc/related', docFile, line, `related slug "${r}" does not exist (yet)`, 'check the slug, or wait for that kit to land');
			}
			if (d.status !== undefined && d.status !== 'stable' && d.status !== 'beta') err('doc/status', docFile, line, `status is ${JSON.stringify(d.status)}`, "status: 'stable' | 'beta'");
		}
	}

	// ── coverage (rule 5)
	if (a.examples.length) {
		const corpus = a.examples.map((e) => e.source).join('\n');
		for (const p of a.parts) {
			for (const prop of p.props) {
				if (EXEMPT.has(prop.name)) continue;
				if (!new RegExp(`\\b${escapeRe(prop.name)}\\b`).test(corpus))
					err('coverage/prop', f(p.file), prop.line, `prop "${prop.name}" of ${p.name} appears in no example`, `use ${prop.name} in an example (examples/NN-….svelte)`);
				for (const v of prop.resolvedValues ?? []) {
					if (!corpus.includes(`'${v}'`) && !corpus.includes(`"${v}"`) && !corpus.includes('`' + v + '`'))
						err('coverage/value', f(p.file), prop.line, `${prop.name}="${v}" appears in no example`, `show ${prop.name}="${v}" (a literal array like {#each ['${v}', …] as v} counts)`);
				}
			}
		}
	}

	// ── Law 1 + imports on every file of the folder (rules 6, 7)
	const files = [...a.svelteFiles, ...a.tsFiles].map((n) => path.join(a.ref.dir, n));
	for (const e of a.examples) files.push(e.full);
	for (const sub of listDir(a.ref.dir, 'dir')) {
		if (sub === 'examples') continue;
		files.push(...walkFiles(path.join(a.ref.dir, sub), (n) => n.endsWith('.svelte') || n.endsWith('.ts')));
	}
	for (const full of files) out.push(...checkFile(full, ctx.allow));
	return out;
}

// ── styles + library ────────────────────────────────────────────────────────

/** `kits/motion.css` and `kits/motion-b.css` both belong to kit `motion`. */
export function fragmentKit(name: string, kits: KitInfo[]): string {
	const base = name.replace(/^kits\//, '').replace(/\.css$/, '');
	const parts = base.split('-');
	for (let n = parts.length; n > 0; n--) {
		const candidate = parts.slice(0, n).join('-');
		if (kits.some((k) => k.id === candidate)) return candidate;
	}
	return base;
}

export function checkKitFragments(layers: LayerBuild, kits: KitInfo[], onlyKit: string | null): Diag[] {
	const out: Diag[] = [];
	for (const fl of layers.files) {
		if (!fl.name.startsWith('kits/')) continue;
		const kit = fragmentKit(fl.name, kits);
		if (onlyKit && kit !== onlyKit) continue;
		const file = rel(fl.full);
		const n = cssCodeLines(fl.source);
		if (n > KIT_BUDGET)
			out.push({ rule: 'layer/budget', severity: 'error', file, line: null, message: `${n} lines (budget ${KIT_BUDGET})`, fix: 'compose more in markup; keep only the smallest general primitives' });
		if (!kits.some((k) => k.id === kit))
			out.push({ rule: 'kit/unknown', severity: 'error', file, line: null, message: `kit fragment for unknown kit "${kit}"`, fix: 'name the fragment kits/<kit>.css or kits/<kit>-<suffix>.css after a kit in kits.ts' });
		for (const m of fl.source.matchAll(/&/g)) {
			out.push({ rule: 'layer/nesting', severity: 'error', file, line: lineAt(fl.source, m.index ?? 0), message: '`&` nesting in a plain CSS layer', fix: 'write the selector out in full' });
			break;
		}
	}
	return out;
}

/** Law 1 + imports for src/lib outside the component folders. */
export function checkLibraryFiles(allow: Allowlist): Diag[] {
	const out: Diag[] = [];
	const files = walkFiles(PATHS.lib, (n) => n.endsWith('.ts') || n.endsWith('.svelte')).filter((full) => {
		const r = rel(full);
		return !r.startsWith('src/lib/components/') && !r.startsWith('src/lib/docs/generated/') && r !== 'src/lib/index.ts';
	});
	for (const full of files) out.push(...checkFile(full, allow));
	out.push(...checkTokenMaps(allow));
	return out;
}
