/**
 * A small, dependency-free syntax highlighter for the docs: svelte, ts, css,
 * bash, json and html. It never drops or reorders characters — the token text
 * of every line, concatenated with newlines, is exactly the input. Token
 * classes (`tok-kw`, `tok-str`, …) live in the display kit stylesheet, next to `.code`.
 */

export type HighlightLang = 'svelte' | 'ts' | 'css' | 'bash' | 'json' | 'html';

export type TokenClass =
	| 'tok-kw'
	| 'tok-str'
	| 'tok-com'
	| 'tok-tag'
	| 'tok-attr'
	| 'tok-num'
	| 'tok-fn'
	| 'tok-punc'
	| 'tok-type';

export interface HighlightToken {
	text: string;
	cls: TokenClass | null;
}

type Emit = (text: string, cls: TokenClass | null) => void;

const TS_KEYWORDS = new Set(
	(
		'import export from default const let var function return if else for while do switch case break continue new this ' +
		'typeof instanceof in of as type interface extends implements class await async yield try catch finally throw ' +
		'true false null undefined void delete satisfies keyof readonly enum declare namespace public private protected static get set'
	).split(' ')
);

const IDENT = /^[A-Za-z_$][\w$]*/;
const NUMBER = /^(?:0[xXbBoO][\da-fA-F_]+n?|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?n?|\.\d+(?:[eE][+-]?\d+)?)/;
const OPERATORS = /^[{}()[\];,.<>=+\-*/%!&|^~?:@#]+/;

/** Index of the `}` closing the `{` at `open` (string- and template-aware); -1 if none. */
function closeBrace(src: string, open: number): number {
	let depth = 0;
	for (let i = open; i < src.length; i++) {
		const c = src[i];
		if (c === '"' || c === "'") i = endOfQuote(src, i);
		else if (c === '`') i = endOfTemplate(src, i);
		else if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

/** Index of the closing quote of the string at `i` (or the end of the line / input). */
function endOfQuote(src: string, i: number): number {
	const q = src[i];
	let j = i + 1;
	while (j < src.length && src[j] !== q && src[j] !== '\n') {
		if (src[j] === '\\' && j + 1 < src.length) j++;
		j++;
	}
	return Math.min(j, src.length - 1);
}

function endOfTemplate(src: string, i: number): number {
	let j = i + 1;
	while (j < src.length && src[j] !== '`') {
		if (src[j] === '\\' && j + 1 < src.length) j++;
		else if (src[j] === '$' && src[j + 1] === '{') {
			const close = closeBrace(src, j + 1);
			if (close < 0) return src.length - 1;
			j = close;
		}
		j++;
	}
	return Math.min(j, src.length - 1);
}

// ── TypeScript / JavaScript ─────────────────────────────────────────────────

function lexTs(src: string, emit: Emit): void {
	let i = 0;
	let lastWord = '';
	while (i < src.length) {
		const rest = src.slice(i);
		const c = src[i];
		if (c === '/' && src[i + 1] === '/') {
			const nl = src.indexOf('\n', i);
			const end = nl < 0 ? src.length : nl;
			emit(src.slice(i, end), 'tok-com');
			i = end;
		} else if (c === '/' && src[i + 1] === '*') {
			const close = src.indexOf('*/', i + 2);
			const end = close < 0 ? src.length : close + 2;
			emit(src.slice(i, end), 'tok-com');
			i = end;
		} else if (c === '"' || c === "'") {
			const end = endOfQuote(src, i) + 1;
			emit(src.slice(i, end), 'tok-str');
			i = end;
		} else if (c === '`') {
			i = lexTemplate(src, i, emit);
		} else if (/[\d]/.test(c) || (c === '.' && /\d/.test(src[i + 1] ?? ''))) {
			const m = rest.match(NUMBER);
			const text = m ? m[0] : c;
			emit(text, 'tok-num');
			i += text.length;
		} else if (/[A-Za-z_$]/.test(c)) {
			const word = (rest.match(IDENT) ?? [c])[0];
			const after = /^\s*\(/.test(src.slice(i + word.length)) || lastWord === 'function';
			let cls: TokenClass | null = null;
			if (TS_KEYWORDS.has(word)) cls = 'tok-kw';
			else if (after) cls = 'tok-fn';
			else if (/^[A-Z]/.test(word)) cls = 'tok-type';
			emit(word, cls);
			lastWord = word;
			i += word.length;
		} else if (/\s/.test(c)) {
			const m = rest.match(/^\s+/);
			const text = m ? m[0] : c;
			emit(text, null);
			i += text.length;
		} else {
			const m = rest.match(OPERATORS);
			// keep `/*`, `//`, quotes and backticks out of an operator run
			let text = m ? m[0] : c;
			const cut = text.search(/\/\/|\/\*/);
			if (cut > 0) text = text.slice(0, cut);
			emit(text, m ? 'tok-punc' : null);
			i += text.length;
		}
	}
}

/** A template literal from the backtick at `i`; returns the index after it. */
function lexTemplate(src: string, i: number, emit: Emit): number {
	let j = i + 1;
	let seg = i;
	while (j < src.length && src[j] !== '`') {
		if (src[j] === '\\' && j + 1 < src.length) {
			j += 2;
			continue;
		}
		if (src[j] === '$' && src[j + 1] === '{') {
			const close = closeBrace(src, j + 1);
			if (close < 0) break;
			emit(src.slice(seg, j), 'tok-str');
			emit('${', 'tok-punc');
			lexTs(src.slice(j + 2, close), emit);
			emit('}', 'tok-punc');
			j = close + 1;
			seg = j;
			continue;
		}
		j++;
	}
	const end = Math.min(j + 1, src.length);
	emit(src.slice(seg, end), 'tok-str');
	return end;
}

// ── CSS ─────────────────────────────────────────────────────────────────────

function lexCss(src: string, emit: Emit): void {
	let i = 0;
	let depth = 0;
	while (i < src.length) {
		const rest = src.slice(i);
		const c = src[i];
		if (c === '/' && src[i + 1] === '*') {
			const close = src.indexOf('*/', i + 2);
			const end = close < 0 ? src.length : close + 2;
			emit(src.slice(i, end), 'tok-com');
			i = end;
			continue;
		}
		if (c === '"' || c === "'") {
			const end = endOfQuote(src, i) + 1;
			emit(src.slice(i, end), 'tok-str');
			i = end;
			continue;
		}
		if (/\s/.test(c)) {
			const text = (rest.match(/^\s+/) ?? [c])[0];
			emit(text, null);
			i += text.length;
			continue;
		}
		if (c === '{' || c === '}') {
			depth += c === '{' ? 1 : -1;
			emit(c, 'tok-punc');
			i++;
			continue;
		}
		if (c === '@') {
			const text = (rest.match(/^@[\w-]+/) ?? [c])[0];
			emit(text, 'tok-kw');
			i += text.length;
			continue;
		}
		// declaration or selector? Look ahead to the first `;`, `{` or `}`.
		const ahead = rest.match(/^[^;{}]*([;{}]|$)/);
		const isDeclaration = depth > 0 && ahead !== null && ahead[1] !== '{' && /^\s*-?-?[\w-]+\s*:/.test(rest);
		if (isDeclaration) {
			const prop = (rest.match(/^-?-?[\w-]+/) ?? [c])[0];
			emit(prop, 'tok-attr');
			i += prop.length;
			// the value, up to `;` or `}`
			const vEnd = i + (src.slice(i).match(/^[^;}]*/) ?? [''])[0].length;
			lexCssValue(src.slice(i, vEnd), emit);
			i = vEnd;
			continue;
		}
		// selector run
		const sel = (rest.match(/^[^\s{},;"'/]+/) ?? [c])[0];
		if (/^[.#]/.test(sel) || /^[a-z][\w-]*/.test(sel) || sel.startsWith(':') || sel.startsWith('*')) emit(sel, 'tok-tag');
		else emit(sel, /^[,;>+~]$/.test(sel) ? 'tok-punc' : null);
		i += sel.length;
	}
}

function lexCssValue(src: string, emit: Emit): void {
	let i = 0;
	while (i < src.length) {
		const rest = src.slice(i);
		const c = src[i];
		let m: RegExpMatchArray | null;
		if (c === '"' || c === "'") {
			const end = endOfQuote(src, i) + 1;
			emit(src.slice(i, end), 'tok-str');
			i = end;
		} else if (c === '/' && src[i + 1] === '*') {
			const close = src.indexOf('*/', i + 2);
			const end = close < 0 ? src.length : close + 2;
			emit(src.slice(i, end), 'tok-com');
			i = end;
		} else if ((m = rest.match(/^--[\w-]+/))) {
			emit(m[0], 'tok-type');
			i += m[0].length;
		} else if ((m = rest.match(/^[\w-]+(?=\()/))) {
			emit(m[0], 'tok-fn');
			i += m[0].length;
		} else if ((m = rest.match(/^#[\da-fA-F]{3,8}\b/)) || (m = rest.match(/^-?(?:\d*\.)?\d+(?:%|[a-zA-Z]+)?/))) {
			emit(m[0], 'tok-num');
			i += m[0].length;
		} else if ((m = rest.match(/^!important\b/))) {
			emit(m[0], 'tok-kw');
			i += m[0].length;
		} else if ((m = rest.match(/^[:;,()/*+]/))) {
			emit(m[0], 'tok-punc');
			i += m[0].length;
		} else if ((m = rest.match(/^\s+/)) || (m = rest.match(/^[\w-]+/))) {
			emit(m[0], null);
			i += m[0].length;
		} else {
			emit(c, null);
			i++;
		}
	}
}

// ── HTML / Svelte markup ────────────────────────────────────────────────────

const BLOCK_SIGIL = /^[#:/@][a-z]+/;

/** A `{…}` expression (or block tag) starting at `i`; returns the index after it. */
function lexBrace(src: string, i: number, emit: Emit): number {
	const close = closeBrace(src, i);
	const end = close < 0 ? src.length : close;
	emit('{', 'tok-punc');
	let j = i + 1;
	const sigil = src.slice(j, end).match(BLOCK_SIGIL);
	if (sigil) {
		emit(sigil[0], 'tok-kw');
		j += sigil[0].length;
	}
	lexTs(src.slice(j, end), emit);
	if (close >= 0) emit('}', 'tok-punc');
	return close < 0 ? src.length : close + 1;
}

function lexMarkup(src: string, emit: Emit, svelte: boolean): void {
	let i = 0;
	while (i < src.length) {
		const c = src[i];
		if (src.startsWith('<!--', i)) {
			const close = src.indexOf('-->', i + 4);
			const end = close < 0 ? src.length : close + 3;
			emit(src.slice(i, end), 'tok-com');
			i = end;
		} else if (c === '<' && /[A-Za-z/!]/.test(src[i + 1] ?? '')) {
			const name = (src.slice(i).match(/^<\/?([A-Za-z][\w:.-]*)/) ?? ['', ''])[1].toLowerCase();
			const closing = src[i + 1] === '/';
			i = lexTag(src, i, emit, svelte);
			if (!closing && (name === 'script' || name === 'style')) {
				const endTag = src.toLowerCase().indexOf(`</${name}`, i);
				const end = endTag < 0 ? src.length : endTag;
				const body = src.slice(i, end);
				if (name === 'script') lexTs(body, emit);
				else lexCss(body, emit);
				i = end;
			}
		} else if (svelte && c === '{') {
			i = lexBrace(src, i, emit);
		} else {
			const stop = svelte ? /[<{]/ : /</;
			let j = i + 1;
			while (j < src.length && !stop.test(src[j])) j++;
			// a `<` not starting a tag is plain text
			emit(src.slice(i, j), null);
			i = j;
		}
	}
}

/** A tag from `<` at `i` to its `>`; returns the index after it. */
function lexTag(src: string, i: number, emit: Emit, svelte: boolean): number {
	const open = src.slice(i).match(/^<\/?!?/);
	const lt = open ? open[0] : '<';
	emit(lt, 'tok-punc');
	let j = i + lt.length;
	const nameMatch = src.slice(j).match(/^[A-Za-z][\w:.-]*/);
	if (nameMatch) {
		const n = nameMatch[0];
		emit(n, /^[A-Z]/.test(n) || n.includes('.') ? 'tok-type' : 'tok-tag');
		j += n.length;
	}
	while (j < src.length) {
		const c = src[j];
		const rest = src.slice(j);
		let m: RegExpMatchArray | null;
		if (c === '>') {
			emit('>', 'tok-punc');
			return j + 1;
		}
		if (c === '/' && src[j + 1] === '>') {
			emit('/>', 'tok-punc');
			return j + 2;
		}
		if (svelte && c === '{') {
			j = lexBrace(src, j, emit);
		} else if (c === '"' || c === "'") {
			j = lexAttrValue(src, j, emit, svelte);
		} else if (c === '=') {
			emit('=', 'tok-punc');
			j++;
		} else if ((m = rest.match(/^\s+/))) {
			emit(m[0], null);
			j += m[0].length;
		} else if ((m = rest.match(/^[^\s=>/"'{}]+/))) {
			emit(m[0], 'tok-attr');
			j += m[0].length;
		} else {
			emit(c, null);
			j++;
		}
	}
	return j;
}

function lexAttrValue(src: string, i: number, emit: Emit, svelte: boolean): number {
	const q = src[i];
	let j = i + 1;
	let seg = i;
	while (j < src.length && src[j] !== q) {
		if (svelte && src[j] === '{') {
			emit(src.slice(seg, j), 'tok-str');
			j = lexBrace(src, j, emit);
			seg = j;
			continue;
		}
		j++;
	}
	const end = Math.min(j + 1, src.length);
	emit(src.slice(seg, end), 'tok-str');
	return end;
}

// ── bash ────────────────────────────────────────────────────────────────────

function lexBash(src: string, emit: Emit): void {
	let i = 0;
	let commandStart = true;
	while (i < src.length) {
		const c = src[i];
		const rest = src.slice(i);
		let m: RegExpMatchArray | null;
		if (c === '\n') {
			emit('\n', null);
			commandStart = true;
			i++;
		} else if (c === '#' && (i === 0 || /\s/.test(src[i - 1]))) {
			const nl = src.indexOf('\n', i);
			const end = nl < 0 ? src.length : nl;
			emit(src.slice(i, end), 'tok-com');
			i = end;
		} else if (c === '"' || c === "'") {
			const end = endOfQuote(src, i) + 1;
			emit(src.slice(i, end), 'tok-str');
			i = end;
			commandStart = false;
		} else if ((m = rest.match(/^[ \t]+/))) {
			emit(m[0], null);
			i += m[0].length;
		} else if ((m = rest.match(/^(&&|\|\||[|;&])/))) {
			emit(m[0], 'tok-punc');
			commandStart = true;
			i += m[0].length;
		} else if ((m = rest.match(/^\$\{?[\w]+\}?/))) {
			emit(m[0], 'tok-type');
			i += m[0].length;
		} else if ((m = rest.match(/^--?[\w-]+(=)?/))) {
			emit(m[0], 'tok-attr');
			i += m[0].length;
		} else {
			const word = (rest.match(/^[^\s"'|;&]+/) ?? [c])[0];
			emit(word, commandStart ? 'tok-fn' : null);
			commandStart = false;
			i += word.length;
		}
	}
}

// ── JSON ────────────────────────────────────────────────────────────────────

function lexJson(src: string, emit: Emit): void {
	let i = 0;
	while (i < src.length) {
		const c = src[i];
		const rest = src.slice(i);
		let m: RegExpMatchArray | null;
		if (c === '"') {
			const end = endOfQuote(src, i) + 1;
			const isKey = /^\s*:/.test(src.slice(end));
			emit(src.slice(i, end), isKey ? 'tok-attr' : 'tok-str');
			i = end;
		} else if ((m = rest.match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/))) {
			emit(m[0], 'tok-num');
			i += m[0].length;
		} else if ((m = rest.match(/^(true|false|null)\b/))) {
			emit(m[0], 'tok-kw');
			i += m[0].length;
		} else if ((m = rest.match(/^[{}[\]:,]/))) {
			emit(m[0], 'tok-punc');
			i += 1;
		} else if ((m = rest.match(/^\s+/))) {
			emit(m[0], null);
			i += m[0].length;
		} else {
			const text = (rest.match(/^[^"{}[\]:,\d\s-]+/) ?? [c])[0];
			emit(text, null);
			i += text.length;
		}
	}
}

// ── entry points ────────────────────────────────────────────────────────────

/** Flat tokens, adjacent same-class tokens merged. Exposed for the self-test. */
export function tokenize(code: string, lang: HighlightLang): HighlightToken[] {
	const flat: HighlightToken[] = [];
	const emit: Emit = (text, cls) => {
		if (!text) return;
		const last = flat[flat.length - 1];
		if (last && last.cls === cls) last.text += text;
		else flat.push({ text, cls });
	};
	if (lang === 'ts') lexTs(code, emit);
	else if (lang === 'css') lexCss(code, emit);
	else if (lang === 'bash') lexBash(code, emit);
	else if (lang === 'json') lexJson(code, emit);
	else lexMarkup(code, emit, lang === 'svelte');
	return flat;
}

/** Lines of tokens. Joining every line's token text with `\n` reproduces `code` exactly. */
export function highlight(code: string, lang: HighlightLang): HighlightToken[][] {
	let flat = tokenize(code, lang);
	// the guarantee: if a lexer ever lost a character, fall back to plain text
	if (flat.map((t) => t.text).join('') !== code) flat = [{ text: code, cls: null }];
	const lines: HighlightToken[][] = [[]];
	for (const t of flat) {
		const parts = t.text.split('\n');
		parts.forEach((part, idx) => {
			if (idx > 0) lines.push([]);
			if (part) lines[lines.length - 1].push({ text: part, cls: t.cls });
		});
	}
	return lines;
}
