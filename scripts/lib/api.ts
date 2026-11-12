// Static API extraction with the TypeScript compiler API: Props interfaces,
// $props() destructuring, index.ts exports, string-literal unions.

import ts from 'typescript';
import path from 'node:path';
import type { ApiExample, ApiPart, ApiProp } from '../../src/lib/docs/api-types.ts';
import { extractScripts } from './svelte.ts';
import { PATHS, byCodepoint, listDir, readText } from './util.ts';

export function parseTs(code: string, name = 'x.ts'): ts.SourceFile {
	return ts.createSourceFile(name, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

export function norm(text: string): string {
	return text.replace(/\s+/g, ' ').replace(/^\|\s*/, '').trim();
}

// ── type aliases ─────────────────────────────────────────────────────────────

export type Aliases = Map<string, ts.TypeNode>;

export function collectAliases(sf: ts.SourceFile, exportedOnly: boolean, into: Aliases = new Map()): Aliases {
	for (const st of sf.statements) {
		if (!ts.isTypeAliasDeclaration(st)) continue;
		const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
		if (exportedOnly && !exported) continue;
		if (!into.has(st.name.text)) into.set(st.name.text, st.type);
	}
	return into;
}

let tokenAliasCache: { src: string; aliases: Aliases } | null = null;

export function tokenAliases(): Aliases {
	const src = readText(PATHS.tokensTs) ?? '';
	if (tokenAliasCache && tokenAliasCache.src === src) return tokenAliasCache.aliases;
	const aliases = collectAliases(parseTs(src, 'tokens.ts'), true);
	tokenAliasCache = { src, aliases };
	return aliases;
}

/** The literals of a string-literal union (optionally `| undefined`), resolving aliases by name. */
export function resolveLiterals(node: ts.TypeNode | undefined, aliases: Aliases[], seen = new Set<string>()): string[] | null {
	if (!node) return null;
	if (ts.isParenthesizedTypeNode(node)) return resolveLiterals(node.type, aliases, seen);
	if (ts.isLiteralTypeNode(node)) {
		if (ts.isStringLiteral(node.literal) || ts.isNoSubstitutionTemplateLiteral(node.literal)) return [node.literal.text];
		return null;
	}
	if (node.kind === ts.SyntaxKind.UndefinedKeyword) return [];
	if (ts.isUnionTypeNode(node)) {
		const out: string[] = [];
		for (const t of node.types) {
			const r = resolveLiterals(t, aliases, seen);
			if (r === null) return null;
			for (const v of r) if (!out.includes(v)) out.push(v);
		}
		return out.length ? out : null;
	}
	if (ts.isTypeReferenceNode(node) && !node.typeArguments && ts.isIdentifier(node.typeName)) {
		const name = node.typeName.text;
		if (seen.has(name)) return null;
		for (const map of aliases) {
			const target = map.get(name);
			if (target) {
				const next = new Set(seen);
				next.add(name);
				const r = resolveLiterals(target, aliases, next);
				return r && r.length ? r : null;
			}
		}
	}
	return null;
}

// ── index.ts exports ─────────────────────────────────────────────────────────

export interface ExportEntry {
	name: string;
	/** The module specifier it is re-exported from, if any. */
	from: string | null;
	isType: boolean;
	/** `export { default as X } from './X.svelte'`. */
	svelteFile: string | null;
	line: number;
}

export function parseExports(src: string, dir: string, depth = 0): ExportEntry[] {
	const sf = parseTs(src, 'index.ts');
	const out: ExportEntry[] = [];
	const lineOf = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
	const isExported = (n: ts.Node) =>
		(ts.canHaveModifiers(n) && ts.getModifiers(n)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) ?? false;

	for (const st of sf.statements) {
		if (ts.isExportDeclaration(st)) {
			const from = st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) ? st.moduleSpecifier.text : null;
			if (!st.exportClause) {
				// export * from './x.js' — follow one level into a sibling TS module.
				if (from && from.startsWith('.') && depth < 2) {
					const base = path.join(dir, from.replace(/\.js$/, ''));
					const file = [base + '.ts', base.replace(/\.svelte$/, '') + '.svelte.ts', base].find((f) => f.endsWith('.ts') && readText(f) !== null);
					if (file) {
						for (const e of parseExports(readText(file) ?? '', path.dirname(file), depth + 1)) {
							out.push({ ...e, from, svelteFile: null, line: lineOf(st) });
						}
					}
				}
				continue;
			}
			if (ts.isNamedExports(st.exportClause)) {
				for (const el of st.exportClause.elements) {
					const local = (el.propertyName ?? el.name).text;
					const svelteFile = from && from.endsWith('.svelte') && local === 'default' ? from : null;
					out.push({ name: el.name.text, from, isType: st.isTypeOnly || el.isTypeOnly, svelteFile, line: lineOf(el) });
				}
			}
			continue;
		}
		if (!isExported(st)) continue;
		if (ts.isVariableStatement(st)) {
			for (const d of st.declarationList.declarations) {
				if (ts.isIdentifier(d.name)) out.push({ name: d.name.text, from: null, isType: false, svelteFile: null, line: lineOf(d) });
			}
		} else if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name) {
			out.push({ name: st.name.text, from: null, isType: false, svelteFile: null, line: lineOf(st) });
		} else if ((ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) && st.name) {
			out.push({ name: st.name.text, from: null, isType: true, svelteFile: null, line: lineOf(st) });
		}
	}
	return out;
}

// ── a .svelte part ───────────────────────────────────────────────────────────

export interface PropInfo extends ApiProp {
	line: number;
}

export interface PartInfo {
	name: string;
	file: string;
	inherits: string[];
	props: PropInfo[];
	/** False when no `interface Props` / `type Props` was found. */
	hasProps: boolean;
	propsLine: number;
	/** Parse problems, reported by the gate. */
	problems: string[];
}

function findProps(sf: ts.SourceFile): { members: ts.TypeElement[]; inherits: string[]; node: ts.Node } | null {
	for (const st of sf.statements) {
		if (ts.isInterfaceDeclaration(st) && st.name.text === 'Props') {
			const inherits = (st.heritageClauses ?? []).flatMap((h) => h.types.map((t) => norm(t.getText(sf))));
			return { members: [...st.members], inherits, node: st };
		}
		if (ts.isTypeAliasDeclaration(st) && st.name.text === 'Props') {
			const members: ts.TypeElement[] = [];
			const inherits: string[] = [];
			const visit = (t: ts.TypeNode) => {
				if (ts.isParenthesizedTypeNode(t)) visit(t.type);
				else if (ts.isTypeLiteralNode(t)) members.push(...t.members);
				else if (ts.isIntersectionTypeNode(t)) t.types.forEach(visit);
				else inherits.push(norm(t.getText(sf)));
			};
			visit(st.type);
			return { members, inherits, node: st };
		}
	}
	return null;
}

function jsdocOf(node: ts.Node, sf: ts.SourceFile): { description: string; defaultTag: string | null } {
	let description = '';
	let defaultTag: string | null = null;
	for (const doc of ts.getJSDocCommentsAndTags(node)) {
		if (!ts.isJSDoc(doc)) continue;
		const text = ts.getTextOfJSDocComment(doc.comment);
		if (text) description = norm(text);
		for (const tag of doc.tags ?? []) {
			if (tag.tagName.text === 'default') {
				const t = ts.getTextOfJSDocComment(tag.comment);
				defaultTag = t ? norm(t).replace(/^`(.*)`$/, '$1') : null;
			}
		}
	}
	void sf;
	return { description, defaultTag };
}

function memberName(m: ts.TypeElement, sf: ts.SourceFile): string | null {
	if (!m.name) return null;
	if (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name)) return m.name.text;
	return m.name.getText(sf);
}

interface Destructured {
	default: string | null;
	bindable: boolean;
}

function findPropsDestructuring(sf: ts.SourceFile): Map<string, Destructured> {
	const out = new Map<string, Destructured>();
	const visit = (n: ts.Node) => {
		if (
			ts.isVariableDeclaration(n) &&
			n.initializer &&
			ts.isCallExpression(n.initializer) &&
			n.initializer.expression.getText(sf) === '$props' &&
			ts.isObjectBindingPattern(n.name)
		) {
			for (const el of n.name.elements) {
				if (el.dotDotDotToken) continue;
				const key = el.propertyName
					? ts.isIdentifier(el.propertyName) || ts.isStringLiteral(el.propertyName)
						? el.propertyName.text
						: el.propertyName.getText(sf)
					: ts.isIdentifier(el.name)
						? el.name.text
						: null;
				if (!key) continue;
				const init = el.initializer;
				if (init && ts.isCallExpression(init) && init.expression.getText(sf) === '$bindable') {
					out.set(key, { bindable: true, default: init.arguments[0] ? norm(init.arguments[0].getText(sf)) : null });
				} else {
					out.set(key, { bindable: false, default: init ? norm(init.getText(sf)) : null });
				}
			}
			return;
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return out;
}

/** Exported type aliases of every plain .ts module in the component folder. */
export function folderAliases(dir: string): Aliases {
	const aliases: Aliases = new Map();
	for (const name of listDir(dir, 'file')) {
		if (!name.endsWith('.ts') || name === 'doc.ts') continue;
		collectAliases(parseTs(readText(path.join(dir, name)) ?? '', name), true, aliases);
	}
	return aliases;
}

export function analyzePart(name: string, file: string, src: string, folderTypes: Aliases): PartInfo {
	const part: PartInfo = { name, file, inherits: [], props: [], hasProps: false, propsLine: 1, problems: [] };
	const scripts = extractScripts(src);
	const instance = scripts.find((s) => !s.module);
	const moduleScript = scripts.find((s) => s.module);
	if (!instance) {
		part.problems.push('no instance <script lang="ts">');
		return part;
	}
	const sf = parseTs(instance.content, file + '.ts');
	const msf = moduleScript ? parseTs(moduleScript.content, file + '.module.ts') : null;
	const local: Aliases = collectAliases(sf, false);
	if (msf) collectAliases(msf, false, local);
	const aliasChain = [local, folderTypes, tokenAliases()];

	let found = findProps(sf);
	let foundIn = sf;
	let foundLine = instance.line;
	if (!found && msf && moduleScript) {
		found = findProps(msf);
		foundIn = msf;
		foundLine = moduleScript.line;
	}
	if (!found) return part;

	part.hasProps = true;
	part.inherits = found.inherits;
	part.propsLine = foundLine + foundIn.getLineAndCharacterOfPosition(found.node.getStart(foundIn)).line;
	const destructured = findPropsDestructuring(sf);

	for (const m of found.members) {
		const pname = memberName(m, foundIn);
		if (!pname) continue;
		let typeText = 'unknown';
		let typeNode: ts.TypeNode | undefined;
		if (ts.isPropertySignature(m) && m.type) {
			typeNode = m.type;
			typeText = norm(m.type.getText(foundIn));
		} else if (ts.isMethodSignature(m)) {
			const params = m.parameters.map((p) => norm(p.getText(foundIn))).join(', ');
			typeText = `(${params}) => ${m.type ? norm(m.type.getText(foundIn)) : 'void'}`;
		}
		const { description, defaultTag } = jsdocOf(m, foundIn);
		const d = destructured.get(pname);
		part.props.push({
			name: pname,
			type: typeText,
			resolvedValues: resolveLiterals(typeNode, aliasChain),
			optional: Boolean(m.questionToken),
			bindable: d?.bindable ?? false,
			default: defaultTag ?? d?.default ?? null,
			description,
			snippet: /^Snippet\b/.test(typeText),
			line: foundLine + foundIn.getLineAndCharacterOfPosition(m.getStart(foundIn)).line
		});
	}
	return part;
}

export function toApiPart(p: PartInfo): ApiPart {
	return {
		name: p.name,
		file: p.file,
		inherits: p.inherits,
		props: p.props.map(({ line: _line, ...rest }) => rest)
	};
}

// ── examples ─────────────────────────────────────────────────────────────────

export const EXAMPLE_HEADER = /<!--\s*@example\s+(.+?)\s*::\s*(.+?)\s*-->/;

export interface ExampleInfo extends ApiExample {
	full: string;
	source: string;
	headerOk: boolean;
}

export function readExamples(dir: string): ExampleInfo[] {
	const exDir = path.join(dir, 'examples');
	return listDir(exDir, 'file')
		.filter((n) => n.endsWith('.svelte'))
		.sort(byCodepoint)
		.map((file) => {
			const full = path.join(exDir, file);
			const source = readText(full) ?? '';
			const first = source.split('\n').find((l) => l.trim() !== '') ?? '';
			const m = first.match(EXAMPLE_HEADER);
			return {
				file,
				full,
				source,
				headerOk: Boolean(m),
				title: m ? m[1] : file.replace(/^\d+-/, '').replace(/\.svelte$/, ''),
				description: m ? m[2] : ''
			};
		});
}
