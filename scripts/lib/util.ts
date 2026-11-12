// Shared filesystem + string helpers for the fractalsvelte-ui scripts.
// Plain Node TypeScript (type-stripping): no enums, no namespaces, no parameter properties.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const PATHS = {
	root: ROOT,
	lib: path.join(ROOT, 'src/lib'),
	components: path.join(ROOT, 'src/lib/components'),
	kitsTs: path.join(ROOT, 'src/lib/components/kits.ts'),
	tokensTs: path.join(ROOT, 'src/lib/internal/tokens.ts'),
	layers: path.join(ROOT, 'src/lib/styles/layers'),
	kitLayers: path.join(ROOT, 'src/lib/styles/layers/components'),
	customCss: path.join(ROOT, 'src/lib/styles/custom.css'),
	barrel: path.join(ROOT, 'src/lib/index.ts'),
	generated: path.join(ROOT, 'src/lib/docs/generated'),
	apiJson: path.join(ROOT, 'src/lib/docs/generated/api.json'),
	classesJson: path.join(ROOT, 'src/lib/docs/generated/classes.json'),
	cssMapJson: path.join(ROOT, 'src/lib/docs/generated/custom-css-map.json'),
	motion: path.join(ROOT, 'src/lib/motion'),
	theme: path.join(ROOT, 'src/lib/theme'),
	genSprings: path.join(ROOT, 'scripts/gen-springs.ts'),
	fractalstyler: path.join(ROOT, 'node_modules/@fractaldesign/fractalstyler'),
	fsRegistry: path.join(ROOT, 'node_modules/@fractaldesign/fractalstyler/registry.json'),
	fsDistStyles: path.join(ROOT, 'node_modules/@fractaldesign/fractalstyler/dist/styles'),
	fsLintCli: path.join(ROOT, 'node_modules/@fractaldesign/fractalstyler/lint/cli.ts')
};

/** Path relative to the project root, always with forward slashes. */
export function rel(file: string): string {
	return path.relative(ROOT, file).split(path.sep).join('/');
}

export function exists(file: string): boolean {
	try {
		fs.accessSync(file);
		return true;
	} catch {
		return false;
	}
}

export function isDir(file: string): boolean {
	try {
		return fs.statSync(file).isDirectory();
	} catch {
		return false;
	}
}

export function readText(file: string): string | null {
	try {
		return fs.readFileSync(file, 'utf8');
	} catch {
		return null;
	}
}

/** Code-point order — independent of locale, so every machine sorts the same way. */
export function byCodepoint(a: string, b: string): number {
	return a < b ? -1 : a > b ? 1 : 0;
}

/** Sorted entry names of a directory; [] when it does not exist. Hidden entries are skipped. */
export function listDir(dir: string, kind: 'file' | 'dir' | 'any' = 'any'): string[] {
	let entries: fs.Dirent[];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	return entries
		.filter((e) => !e.name.startsWith('.'))
		.filter((e) => (kind === 'any' ? true : kind === 'dir' ? e.isDirectory() : e.isFile()))
		.map((e) => e.name)
		.sort(byCodepoint);
}

/** Every file under `dir` (recursive, sorted) whose name passes `pred`. */
export function walkFiles(dir: string, pred: (name: string) => boolean): string[] {
	const out: string[] = [];
	for (const name of listDir(dir)) {
		if (name === 'node_modules') continue;
		const full = path.join(dir, name);
		if (isDir(full)) out.push(...walkFiles(full, pred));
		else if (pred(name)) out.push(full);
	}
	return out;
}

/**
 * Atomic, idempotent write: identical content is not rewritten (so watchers stay
 * quiet), and new content lands via temp file + rename so a concurrent reader
 * never sees half a file. Returns true when the file changed.
 */
export function writeAtomic(file: string, content: string): boolean {
	if (readText(file) === content) return false;
	fs.mkdirSync(path.dirname(file), { recursive: true });
	const tmp = `${file}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
	fs.writeFileSync(tmp, content);
	try {
		fs.renameSync(tmp, file);
	} catch (err) {
		try {
			fs.unlinkSync(tmp);
		} catch {}
		throw err;
	}
	return true;
}

/** Stable JSON: tab-indented, trailing newline. Callers sort arrays themselves. */
export function stableJson(value: unknown): string {
	return JSON.stringify(value, null, '\t') + '\n';
}

/** `icon-button` → `IconButton`. */
export function pascal(slug: string): string {
	return slug
		.split(/[-_]/)
		.filter(Boolean)
		.map((p) => p[0].toUpperCase() + p.slice(1))
		.join('');
}

/** 1-based line number of an offset. */
export function lineAt(text: string, offset: number): number {
	let line = 1;
	for (let i = 0; i < offset && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
	return line;
}

export function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	const m = a.length;
	const n = b.length;
	let prev = new Array<number>(n + 1);
	let cur = new Array<number>(n + 1);
	for (let j = 0; j <= n; j++) prev[j] = j;
	for (let i = 1; i <= m; i++) {
		cur[0] = i;
		for (let j = 1; j <= n; j++) {
			const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
			cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
		}
		[prev, cur] = [cur, prev];
	}
	return prev[n];
}

/** Up to `n` closest names by edit distance (ties broken alphabetically). */
export function closest(name: string, pool: Iterable<string>, n = 3): string[] {
	const scored: { s: string; d: number }[] = [];
	for (const s of pool) {
		if (Math.abs(s.length - name.length) > 6) continue;
		scored.push({ s, d: levenshtein(name, s) });
	}
	scored.sort((x, y) => x.d - y.d || byCodepoint(x.s, y.s));
	const limit = Math.max(2, Math.ceil(name.length / 2));
	return scored.filter((x) => x.d <= limit).slice(0, n).map((x) => x.s);
}

/** Count of non-blank, non-comment lines of a stylesheet. */
export function cssCodeLines(css: string): number {
	const stripped = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''));
	return stripped.split('\n').filter((l) => l.trim() !== '').length;
}

/** Replace a range with spaces, keeping newlines (so offsets and lines survive). */
export function blank(text: string): string {
	return text.replace(/[^\n]/g, ' ');
}
