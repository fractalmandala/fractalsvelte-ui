// node scripts/cod/token-audit.ts [kit[/name]] [--json] [--md <file>]
// Read-only. For every component part (not examples), finds literal classes that a
// tokens.ts prop should carry instead (AGENTS.md "CANONICAL PROPS"), and whether the
// part declares that prop. Written by cod, 2026-11-19.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import * as T from '../../src/lib/internal/tokens.ts';

const ROOT = join(import.meta.dirname, '../..');
const COMPONENTS = join(ROOT, 'src/lib/components');

export type Family = 'pad' | 'textSize' | 'textColor' | 'size' | 'gap' | 'radius' | 'align';

/** literal class → family, and which props satisfy that family */
const FAMILY_PROPS: Record<Family, string[]> = {
	pad: ['pad'],
	textSize: ['textSize', 'childTextSize'],
	textColor: ['textColor', 'childTextColor'],
	size: ['size'],
	gap: ['gap'],
	radius: ['shape'],
	align: ['alignContent', 'align']
};

const LITERALS = new Map<string, Family>();
for (const c of T.PADS) LITERALS.set(c, 'pad');
for (const c of T.TEXTSIZES) LITERALS.set(c, 'textSize');
for (const c of T.TEXTCOLORS) LITERALS.set(c, 'textColor');
for (const c of T.SIZES) LITERALS.set(c, 'size');
for (const c of T.GAPS) if (c) LITERALS.set(c, 'gap');
for (const c of ['xleft', 'xcenter', 'xright', 'xbetween', 'ta-l', 'ta-c', 'ta-r']) LITERALS.set(c, 'align');
const RADIUS = /^radius-[\w-]+$/;

export interface Finding {
	file: string;
	line: number;
	token: string;
	family: Family;
	propDeclared: boolean;
	context: string;
}

export interface PartReport {
	file: string;
	props: string[];
	findings: Finding[];
}

function walk(dir: string, out: string[] = []): string[] {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) {
			if (name !== 'examples') walk(p, out);
		} else if (name.endsWith('.svelte')) out.push(p);
	}
	return out;
}

/** Prop names declared in `interface Props { … }` (top level only). */
export function declaredProps(src: string): string[] {
	const m = /interface Props[^{]*\{/.exec(src);
	if (!m) return [];
	let depth = 1;
	let i = m.index + m[0].length;
	const start = i;
	while (i < src.length && depth > 0) {
		if (src[i] === '{') depth++;
		else if (src[i] === '}') depth--;
		i++;
	}
	const body = src.slice(start, i - 1);
	const names: string[] = [];
	let d = 0;
	for (const line of body.split('\n')) {
		if (d === 0) {
			const pm = /^\s*([A-Za-z_$][\w$]*)\??\s*:/.exec(line);
			if (pm) names.push(pm[1]);
		}
		for (const ch of line) {
			if (ch === '{' || ch === '(' || ch === '[') d++;
			else if (ch === '}' || ch === ')' || ch === ']') d--;
		}
	}
	return names;
}

/** Blank out spans that legitimately hold token literals: types, defaults, imports, comments. */
function maskNonUsage(src: string): string {
	const blank = (s: string) => s.replace(/[^\n]/g, ' ');
	return src
		.replace(/<!--[\s\S]*?-->/g, blank)
		.replace(/\/\*[\s\S]*?\*\//g, blank)
		.replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)))
		.replace(/^\s*import[^;]*;/gm, blank)
		.replace(/interface Props[\s\S]*?\n\t?\}/g, blank)
		.replace(/let\s*\{[\s\S]*?\}\s*:\s*Props\s*=\s*\$props\(\)/g, blank)
		.replace(/^\s*type\s+\w+\s*=[^;]*;/gm, blank);
}

export function auditFile(file: string): PartReport {
	const src = readFileSync(file, 'utf8');
	const props = declaredProps(src);
	const masked = maskNonUsage(src);
	const lines = masked.split('\n');
	const raw = src.split('\n');
	const findings: Finding[] = [];
	const strRe = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;
	lines.forEach((line, idx) => {
		for (const m of line.matchAll(strRe)) {
			const body = m[2].replace(/\$\{[^}]*\}/g, ' ');
			for (const token of body.split(/\s+/)) {
				const family = LITERALS.get(token) ?? (RADIUS.test(token) ? 'radius' : undefined);
				if (!family) continue;
				findings.push({
					file: relative(ROOT, file),
					line: idx + 1,
					token,
					family,
					propDeclared: FAMILY_PROPS[family].some((p) => props.includes(p)),
					context: raw[idx].trim().slice(0, 140)
				});
			}
		}
	});
	return { file: relative(ROOT, file), props, findings };
}

export function audit(scope?: string): PartReport[] {
	const base = scope ? join(COMPONENTS, scope) : COMPONENTS;
	return walk(base).sort().map(auditFile);
}

function toMarkdown(reports: PartReport[]): string {
	const hit = reports.filter((r) => r.findings.length);
	const byFamily = new Map<Family, { files: Set<string>; n: number; missing: number }>();
	for (const r of hit)
		for (const f of r.findings) {
			const e = byFamily.get(f.family) ?? { files: new Set(), n: 0, missing: 0 };
			e.files.add(f.file);
			e.n++;
			if (!f.propDeclared) e.missing++;
			byFamily.set(f.family, e);
		}
	let out = `# Token audit (cod)\n\nGenerated ${new Date().toISOString()} by \`node scripts/cod/token-audit.ts\`.\n`;
	out += `Parts scanned: ${reports.length}. Parts with hardcoded prop-family classes: ${hit.length}.\n\n`;
	out += `| family | literals | parts | prop not declared |\n|:--|--:|--:|--:|\n`;
	for (const [fam, e] of [...byFamily].sort((a, b) => b[1].n - a[1].n))
		out += `| ${fam} | ${e.n} | ${e.files.size} | ${e.missing} |\n`;
	out += `\n## By part\n`;
	for (const r of hit) {
		out += `\n### ${r.file}\n`;
		for (const f of r.findings)
			out += `- L${f.line} \`${f.token}\` (${f.family}${f.propDeclared ? ', prop exists but literal used' : ', **no prop**'}): \`${f.context.replace(/`/g, "'")}\`\n`;
	}
	return out;
}

if (import.meta.main) {
	const args = process.argv.slice(2);
	const scope = args.find((a) => !a.startsWith('-') && !args[args.indexOf(a) - 1]?.startsWith('--md'));
	const reports = audit(scope);
	if (args.includes('--json')) console.log(JSON.stringify(reports, null, 2));
	const mdAt = args.indexOf('--md');
	const md = toMarkdown(reports);
	if (mdAt >= 0) writeFileSync(args[mdAt + 1], md);
	if (!args.includes('--json')) console.log(md.split('\n## By part')[0]);
}
