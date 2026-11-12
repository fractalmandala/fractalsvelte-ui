// Splitting a .svelte source into its scripts and its markup — offsets preserved.

import { blank, lineAt } from './util.ts';

export interface ScriptBlock {
	/** The script body. */
	content: string;
	/** Offset of the body in the file. */
	offset: number;
	/** 1-based line of the body's first character. */
	line: number;
	module: boolean;
	ts: boolean;
}

const SCRIPT = /<script(\s[^>]*)?>([\s\S]*?)<\/script\s*>/g;

/** HTML comments, blanked (so a commented-out `<script>` does not count). */
function withoutComments(src: string): string {
	return src.replace(/<!--[\s\S]*?-->/g, (m) => blank(m));
}

export function extractScripts(src: string): ScriptBlock[] {
	const clean = withoutComments(src);
	const out: ScriptBlock[] = [];
	for (const m of clean.matchAll(SCRIPT)) {
		const attrs = m[1] ?? '';
		const offset = (m.index ?? 0) + m[0].indexOf('>') + 1;
		out.push({
			content: src.slice(offset, offset + m[2].length),
			offset,
			line: lineAt(src, offset),
			module: /\bmodule\b|context\s*=\s*["']module["']/.test(attrs),
			ts: /lang\s*=\s*["']ts["']/.test(attrs)
		});
	}
	return out;
}

/** The markup only: scripts, style blocks and HTML comments blanked out. */
export function markupOf(src: string): string {
	return withoutComments(src)
		.replace(SCRIPT, (m) => blank(m))
		.replace(/<style(\s[^>]*)?>[\s\S]*?<\/style\s*>/g, (m) => blank(m));
}

/** Index of the brace closing the one at `open`, aware of JS strings and template literals. */
export function matchJsBrace(src: string, open: number): number {
	let depth = 0;
	for (let i = open; i < src.length; i++) {
		const c = src[i];
		if (c === '"' || c === "'") {
			i = skipQuoted(src, i);
		} else if (c === '`') {
			i = skipTemplate(src, i);
		} else if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

export function skipQuoted(src: string, i: number): number {
	const q = src[i];
	let j = i + 1;
	while (j < src.length && src[j] !== q && src[j] !== '\n') {
		if (src[j] === '\\') j++;
		j++;
	}
	return j;
}

export function skipTemplate(src: string, i: number): number {
	let j = i + 1;
	while (j < src.length && src[j] !== '`') {
		if (src[j] === '\\') j++;
		else if (src[j] === '$' && src[j + 1] === '{') {
			const close = matchJsBrace(src, j + 1);
			if (close < 0) return src.length;
			j = close;
		}
		j++;
	}
	return j;
}

export interface StringLit {
	value: string;
	/** Offset of the opening quote within the scanned text. */
	start: number;
	end: number;
	interpolated: boolean;
}

/** Top-level string literals of a JS expression (template literals reported whole). */
export function stringLiterals(expr: string): StringLit[] {
	const out: StringLit[] = [];
	for (let i = 0; i < expr.length; i++) {
		const c = expr[i];
		if (c === '"' || c === "'") {
			const end = skipQuoted(expr, i);
			out.push({ value: expr.slice(i + 1, end), start: i, end: end + 1, interpolated: false });
			i = end;
		} else if (c === '`') {
			const end = skipTemplate(expr, i);
			const raw = expr.slice(i + 1, end);
			out.push({ value: raw, start: i, end: end + 1, interpolated: raw.includes('${') });
			i = end;
		} else if (c === '/' && expr[i + 1] === '/') {
			const nl = expr.indexOf('\n', i);
			i = nl < 0 ? expr.length : nl;
		} else if (c === '/' && expr[i + 1] === '*') {
			const close = expr.indexOf('*/', i + 2);
			i = close < 0 ? expr.length : close + 1;
		}
	}
	return out;
}
