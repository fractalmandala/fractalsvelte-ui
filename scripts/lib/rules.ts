// Rules that enforce the decisions rather than a component's shape: no annotations
// in source, canon types on props, no export without a reader, no map that says
// nothing, no custom property nobody reads, no type declared twice.
//
// Each one is here because a decision in decisions.md says so; change the decision
// first, then the rule.

import fs from 'node:fs';
import path from 'node:path';
import type { ComponentAnalysis, Library } from './analysis.ts';
import type { Diag } from './checks.ts';
import {
	ALIGNCONTENTS,
	ALIGNS,
	DENSITIES,
	GAPS,
	GROUPINGS,
	MEASURES,
	MOTIONS,
	ORIENTATIONS,
	PADS,
	PLACEMENTS,
	SHAPES,
	SIZES,
	SPACES,
	SURFACES,
	TEXTALIGNS,
	TEXTCOLORS,
	TEXTSIZES,
	TONES,
	VARIANTS
} from '../../src/lib/internal/tokens.ts';
import { markupOf } from './svelte.ts';
import { PATHS, ROOT, lineAt, listDir, readText, rel, walkFiles } from './util.ts';

/** The vocabularies a prop may take instead of restating them. */
export const VOCABULARIES: Record<string, readonly string[]> = {
	Variant: VARIANTS,
	Size: SIZES,
	Shape: SHAPES,
	Gap: GAPS,
	Pad: PADS,
	Space: SPACES,
	Grouping: GROUPINGS,
	Surface: SURFACES,
	TextSize: TEXTSIZES,
	TextColor: TEXTCOLORS,
	TextAlign: TEXTALIGNS,
	AlignContent: ALIGNCONTENTS,
	Align: ALIGNS,
	Orientation: ORIENTATIONS,
	Placement: PLACEMENTS,
	Measure: MEASURES,
	Density: DENSITIES,
	MotionPreset: MOTIONS,
	Tone: TONES
};

const SOURCE = /\.(ts|svelte)$/;
const notGenerated = (full: string) => !full.startsWith(PATHS.generated) && !full.endsWith('.d.ts');

/** Every source file of the library, generated folders excluded. */
function librarySources(): string[] {
	return walkFiles(PATHS.lib, (n) => SOURCE.test(n)).filter(notGenerated);
}

/** Every source file in the repo that may consume a library export. */
function allSources(): string[] {
	return walkFiles(path.join(ROOT, 'src'), (n) => SOURCE.test(n)).filter(notGenerated);
}

// ── annotations ─────────────────────────────────────────────────────────────

/**
 * Law 4: no JSDoc and no annotations in source. A folder's prose lives in its
 * `comments.md`; a decision lives in `decisions.md`.
 */
export function checkAnnotations(files: string[]): Diag[] {
	const out: Diag[] = [];
	for (const full of files) {
		const src = readText(full);
		if (src === null) continue;
		for (const m of src.matchAll(/\/\*\*/g)) {
			const line = lineAt(src, m.index ?? 0);
			const text = src.slice((m.index ?? 0) + 3, (m.index ?? 0) + 90).replace(/\s+/g, ' ').trim();
			// a licence or attribution notice has to stay in the file it covers
			if (/MIT|©|\(c\)|copyright|adapted from|third_party|licen[cs]e/i.test(src.slice(m.index ?? 0, (src.indexOf('*/', m.index ?? 0) || 0) + 2))) continue;
			out.push({
				rule: 'annotations/in-source',
				severity: 'error',
				file: rel(full),
				line,
				message: `JSDoc in source: "${text.slice(0, 60)}…"`,
				fix: "move it to the folder's comments.md with `pnpm comments:strip <kit>/<name>`; a decision belongs in decisions.md"
			});
		}
	}
	return out;
}

// ── canon prop types ────────────────────────────────────────────────────────

/**
 * No component invents a second vocabulary for an prop that already has one: a
 * prop whose values all come from a canon set takes that type instead.
 */
export function checkPropTypes(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	for (const part of a.parts) {
		for (const prop of part.props) {
			const values = prop.resolvedValues;
			if (!values || values.length < 2) continue;
			if (/^(Variant|Size|Shape|Gap|Pad|Space|Grouping|Surface|TextSize|TextColor|TextAlign|AlignContent|Align|Orientation|Placement|Measure|Resize|Density|MotionPreset|Tone)$/.test(prop.type)) continue;
			for (const [name, vocab] of Object.entries(VOCABULARIES)) {
				const all = values.every((v) => vocab.includes(v));
				// the mirror case: every canon value plus private extras — the vocabulary
				// is still the canon one, with a member bolted on (ToastTone = Tone + loading)
				const superset = !all && vocab.every((v) => values.includes(v)) && values.length > vocab.length;
				if (superset) {
					const extra = values.filter((v) => !vocab.includes(v));
					out.push({
						rule: 'props/canon-type',
						severity: 'error',
						file: `${a.ref.relDir}/${part.file}`,
						line: prop.line,
						message: `prop "${prop.name}" is typed as ${prop.type}, which is ${name} plus ${extra.join(', ')}`,
						fix: `either take \`${prop.name}?: ${name}\` and model ${extra.join('/')} as its own prop with a decision, or keep the union and say why ${name} cannot express it`
					});
					break;
				}
				if (!all) continue;
				const sameSize = values.length === vocab.length;
				out.push({
					rule: 'props/canon-type',
					severity: 'error',
					file: `${a.ref.relDir}/${part.file}`,
					line: prop.line,
					message: `prop "${prop.name}" is typed as ${prop.type}, which restates ${name}${sameSize ? '' : ` (${values.length} of its ${vocab.length} values)`}`,
					fix: `type it \`${prop.name}?: ${name}\` from tokens.ts — a narrower prop needs its own canon vocabulary, not a literal union`
				});
				break;
			}
		}
	}
	return out;
}

// ── exports with no reader ──────────────────────────────────────────────────

const isPublicBarrel = (full: string): boolean =>
	full === PATHS.barrel || path.basename(full) === 'index.ts';

/**
 * A computed value needs a consumer. An export nobody reads is a decision that
 * was never written: delete it, or write the decision down.
 */
export function checkDeadExports(files: string[], corpus: string): Diag[] {
	const out: Diag[] = [];
	// a name a folder barrel re-exports is public API, whatever its internal use
	const publicNames = new Set<string>();
	const starFolders: string[] = [];
	for (const full of walkFiles(PATHS.lib, (n) => n === 'index.ts')) {
		// the root barrel re-exports barrels; it must not exempt the whole library
		if (full === PATHS.barrel) continue;
		const src = readText(full) ?? '';
		if (/export \*/.test(src)) starFolders.push(path.dirname(full) + path.sep);
		for (const m of src.matchAll(/\bexport (?:type )?\{([^}]*)\}/g))
			for (const part of m[1].split(',')) publicNames.add(part.trim().split(/\s+as\s+/).pop()!.trim());
	}
	for (const full of files) {
		if (full === PATHS.tokensTs) continue; // a vocabulary justifies nothing
		if (isPublicBarrel(full)) continue; // a barrel's job is to be the API
		if (full.split(path.sep).includes('examples')) continue; // example code is prose in a string
		if (starFolders.some((dir) => full.startsWith(dir))) continue;
		const src = readText(full);
		if (src === null) continue;
		for (const m of src.matchAll(/export (?:async )?(?:function|const|class|type|interface) ([\w$]+)/g)) {
			const name = m[1];
			if (name === 'default' || publicNames.has(name)) continue;
			const readers = (corpus.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length;
			// the declaration itself is one mention; a name read once more is alive
			if (readers <= 1)
				out.push({
					rule: 'export/dead',
					severity: 'error',
					file: rel(full),
					line: lineAt(src, m.index ?? 0),
					message: `export "${name}" is read by nothing`,
					fix: 'delete it, or write the decision in decisions.md that says who consumes it'
				});
		}
	}
	return out;
}

// ── maps that say nothing ───────────────────────────────────────────────────

const MAP = /(?:export )?const (\w+)(?::[^=]+)? = \{([\s\S]*?)\n\};/g;
const ENTRY = /^\s*'?([\w-]+)'?\s*:\s*'([^']*)'\s*,?$/gm;
// a value that is a call on the key — `neutral: toneText('neutral')` — is the same statement
const CALL_ENTRY = /^\s*'?([\w-]+)'?\s*:\s*[\w$.]+\s*\(\s*'([\w-]+)'\s*\)\s*,?$/gm;

/** A map whose values equal its keys is not a table, it is the key written twice. */
export function checkIdentityMaps(files: string[]): Diag[] {
	const out: Diag[] = [];
	for (const full of files) {
		if (full === PATHS.tokensTs) continue;
		const src = readText(full);
		if (src === null) continue;
		for (const m of src.matchAll(MAP)) {
			const entries = [...m[2].matchAll(ENTRY)].map((e) => [e[1], e[2]]);
			const calls = [...m[2].matchAll(CALL_ENTRY)].filter((c) => c[1] === c[2]);
			if (entries.length < 3 && calls.length < 3) continue;
			if (calls.length >= 3 && calls.length === [...m[2].matchAll(/^\s*'?[\w-]+'?\s*:/gm)].length)
				out.push({
					rule: 'map/derivable',
					severity: 'error',
					file: rel(full),
					line: lineAt(src, m.index ?? 0),
					message: `"${m[1]}" maps each key through one function — it is that function, written out`,
					fix: `delete "${m[1]}" and call the function with the value at the use site`
				});
			if (entries.length < 3) continue;
			const line = lineAt(src, m.index ?? 0);
			if (entries.every(([k, v]) => k === v))
				out.push({
					rule: 'map/identity',
					severity: 'error',
					file: rel(full),
					line,
					message: `"${m[1]}" maps every key to itself`,
					fix: 'delete the map and use the value directly'
				});
			else if (entries.every(([k, v]) => v.endsWith(k) && /^[\w$-]+$/.test(v.slice(0, v.length - k.length))))
				out.push({
					rule: 'map/derivable',
					severity: 'error',
					file: rel(full),
					line,
					message: `"${m[1]}" is a prefix rule written as a table`,
					fix: `write the expression once instead of the table`
				});
		}
	}
	return out;
}

// ── custom properties nobody reads ──────────────────────────────────────────

/** The top-level keys of an object literal starting at `open` (the index of `{`). */
function objectKeys(src: string, open: number): string[] {
	const keys: string[] = [];
	let depth = 0;
	let segmentStart = open + 1;
	let quote: string | null = null;

	const flush = (end: number) => {
		const segment = src.slice(segmentStart, end);
		const m = /^\s*'?([\w-]+)'?\s*:/.exec(segment);
		if (m) keys.push(m[1]);
		segmentStart = end + 1;
	};

	for (let i = open; i < src.length; i++) {
		const ch = src[i];
		if (quote) {
			if (ch === '\\') i++;
			else if (ch === quote) quote = null;
			continue;
		}
		if (ch === "'" || ch === '"' || ch === '`') {
			quote = ch;
			continue;
		}
		if (ch === '{' || ch === '[' || ch === '(') depth++;
		else if (ch === '}' || ch === ']' || ch === ')') {
			depth--;
			if (depth === 0) {
				flush(i);
				return keys;
			}
		} else if (ch === ',' && depth === 1) flush(i);
	}
	return keys;
}

/** A custom property a component writes must be read by a stylesheet or by script. */
export function checkDeadProperties(files: string[], styles: string[]): Diag[] {
	const out: Diag[] = [];
	const read = new Set<string>();
	for (const full of [...styles, ...allSources()]) {
		if (files.includes(full)) continue;
		const src = readText(full) ?? '';
		for (const m of src.matchAll(/var\(\s*(--[\w-]+)/g)) read.add(m[1]);
		for (const m of src.matchAll(/getPropertyValue\(\s*'(--[\w-]+)'/g)) read.add(m[1]);
	}

	for (const full of files) {
		const src = readText(full);
		if (src === null) continue;
		const written: { name: string; at: number }[] = [];
		for (const m of src.matchAll(/setProperty\(\s*'(--[\w-]+)'/g)) written.push({ name: m[1], at: m.index ?? 0 });
		for (const m of src.matchAll(/vars\(\{/g)) {
			const at = m.index ?? 0;
			const open = src.indexOf('{', at);
			for (const key of objectKeys(src, open)) written.push({ name: key.startsWith('--') ? key : `--${key}`, at });
		}
		for (const { name, at } of written) {
			if (read.has(name)) continue;
			out.push({
				rule: 'var/dead-property',
				severity: 'error',
				file: rel(full),
				line: lineAt(src, at),
				message: `${name} is written here and read by no stylesheet or script`,
				fix: 'delete the write, or add the rule that consumes it to the kit fragment'
			});
		}
	}
	return out;
}

// ── types declared twice ────────────────────────────────────────────────────

const IFACE = /export interface (\w+)(?:[^{]*)\{([\s\S]*?)\n\}/g;
const MEMBER = /^\s*(?:readonly )?([\w$]+)\??\s*:\s*([^;\n]+)/gm;

/** The same shape declared in two places will drift; one of them owns it. */
export function checkDuplicateTypes(files: string[]): Diag[] {
	const out: Diag[] = [];
	const shapes = new Map<string, { name: string; file: string; line: number }>();
	for (const full of files) {
		const src = readText(full);
		if (src === null) continue;
		for (const m of src.matchAll(IFACE)) {
			const members = [...m[2].matchAll(MEMBER)].map((x) => `${x[1]}:${x[2].trim()}`);
			if (members.length < 2) continue;
			const key = members.sort().join('|');
			const seen = shapes.get(key);
			if (!seen) {
				shapes.set(key, { name: m[1], file: rel(full), line: lineAt(src, m.index ?? 0) });
				continue;
			}
			// the same member set under a different name, or in a different file
			if (seen.name === m[1] && seen.file === rel(full)) continue;
			out.push({
				rule: 'module/duplicate-type',
				severity: 'error',
				file: rel(full),
				line: lineAt(src, m.index ?? 0),
				message: `${m[1]} has the same members as ${seen.name} (${seen.file}:${seen.line})`,
				fix: 'one of them owns the shape — import it, or merge them'
			});
		}
	}
	return out;
}

// ── a component may not make a prop decision itself ────────────────────────

/**
 * class literal → the prop that should carry it. Every prop is in the rule.
 * A prop a component's own mechanics fix — a button is a centred row with a fixed
 * icon gap — is an exception for THAT component, named below with its reason. The
 * rule is never narrowed for everybody: an exception with no component named is
 * either a missing prop or a missing canon value.
 */
const PROP_EXEMPT: Record<string, string[]> = {
	'actions/button': ['gap', 'alignContent']
};
const PROP_CLASSES: Record<string, string> = {};
const addProp = (cls: string, prop: string) => {
	if (cls && !PROP_CLASSES[cls]) PROP_CLASSES[cls] = prop;
};
for (const c of SIZES) addProp(c, 'size');
for (const c of GAPS) addProp(c, 'gap');
for (const c of PADS) addProp(c, 'pad');
for (const c of SHAPES) addProp(c, 'shape');
for (const c of TEXTSIZES) addProp(c, 'textSize');
for (const c of TEXTCOLORS) addProp(c, 'textColor');
// the classes are ta-l/ta-c/ta-r; `left|center|right` are the values and are not classes
for (const c of ALIGNCONTENTS) addProp(c, 'alignContent');
for (const c of MEASURES) addProp(c, 'measure');

/** Every class token a `class=` attribute in this markup can produce. */
function classTokens(markup: string): { token: string; offset: number }[] {
	return classGroups(markup).flatMap((g) => g.tokens);
}

/** The same, grouped per class attribute — one group is one element. */
function classGroups(markup: string): { tokens: { token: string; offset: number }[]; offset: number }[] {
	const out: { tokens: { token: string; offset: number }[]; offset: number }[] = [];
	for (const m of markup.matchAll(/\sclass\s*=\s*/g)) {
		let i = (m.index ?? 0) + m[0].length;
		const q = markup[i];
		let body = '';
		let base = i;
		if (q === '"' || q === "'") {
			let j = i + 1;
			while (j < markup.length && markup[j] !== q) j++;
			body = markup.slice(i + 1, j);
			base = i + 1;
		} else if (q === '{') {
			let depth = 0;
			let j = i;
			for (; j < markup.length; j++) {
				if (markup[j] === '{') depth++;
				else if (markup[j] === '}' && --depth === 0) break;
			}
			body = markup.slice(i + 1, j);
			base = i + 1;
		} else continue;
		const group: { token: string; offset: number }[] = [];
		for (const t of body.matchAll(/'([^']*)'|"([^"]*)"|([\w-]+)/g)) {
			const text = t[1] ?? t[2] ?? t[3];
			for (const part of text.split(/\s+/)) if (part) group.push({ token: part, offset: base + (t.index ?? 0) });
		}
		out.push({ tokens: group, offset: base });
	}
	return out;
}

/**
 * `gap-md pad-md glass modern measure-sm` in a component's own markup is the
 * component making a decision the consumer can no longer reach. Every class that
 * is a canon prop value must arrive through that prop's prop.
 */
export function checkPropLiterals(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	for (const part of a.parts) {
		const src = readText(path.join(ROOT, a.ref.relDir, part.file));
		if (src === null) continue;
		const markup = markupOf(src);
		const declared = new Set(part.props.map((p) => p.name));
		const seen = new Set<string>();
		const exempt = new Set(PROP_EXEMPT[`${a.ref.kit}/${a.ref.slug}`] ?? []);
		for (const { token, offset } of classTokens(markup)) {
			const prop = PROP_CLASSES[token];
			if (!prop || seen.has(token) || exempt.has(prop)) continue;
			const isTextProp = prop === 'textSize' || prop === 'textColor' || prop === 'textAlign';
			// a glyph is sized with the text ladder because fractalstyler has no icon prop
			if (isTextProp) {
				const tag = elementAround(markup, offset);
				if (tag && /<Icon\b/.test(tag) && !/>[^<]*\w/.test(tag)) continue;
			}
			// structural axes belong to the caller only on the root element; inside,
			// an inset or a gap is the component's own chrome
			if (!isTextProp && !onRootElement(markup, offset)) continue;
			seen.add(token);
			const has = declared.has(prop);
			out.push({
				rule: 'class/hardcoded-prop',
				severity: 'error',
				file: `${a.ref.relDir}/${part.file}`,
				line: lineAt(src, offset),
				message: `"${token}" is a ${prop} value written into the markup${has ? ` — \`${prop}\` is declared, so this literal overrides it` : ` — the component declares no \`${prop}\` prop, so no consumer can change it`}`,
				fix: has ? `thread \`${prop}\` into the class here instead of the literal` : `take \`${prop}\` (canon type from tokens.ts) and compose the class from it`
			});
		}
	}
	return out;
}

// ── a surface is one decision, not four classes ─────────────────────────────

/**
 * A `Surface` value is a recipe: fractalstyler's own `.elevated`, `.glass`,
 * `.paneled` and `.overlayed` each set fill + border + rim + shadow together.
 * Writing those parts out by hand — `glass rim shad-md border bg-overlay` — is
 * the same surface spelled twice, and it takes the decision away from the caller
 * who should get it as `surface`.
 */
/**
 * A component whose subject IS an edge — the divider — is named here with the
 * ingredient it legitimately owns. Everything else must reach its edge through
 * `surface`; the rule is never softened for the whole library.
 */
const SURFACE_EXEMPT: Record<string, string[]> = {
	// a hairline: the subject of a divider is an edge
	'primitives/divider': ['border', 'border-subtle', 'border-strong', 'border-dashed'],
	// the drop zone IS a dashed edge; the thumbnail keeps a media hairline, not a surface
	'inputs/file-drop': ['border-dashed', 'border-subtle'],
	// an invalid track takes one hairline; every Surface paints a fill unconditionally
	'selection/switch': ['border'],
	// the swatch paints its own inset ring; `outlined` would add a fill it does not want
	'pickers/color-picker': ['border'],
	// the selection hairline of a thumbnail strip: two states of one edge, no fill
	'overlays/lightbox': ['border-strong', 'border-subtle'],
	// a chip with a fill and no edge is not a Surface — `paneled` adds a border and a shadow
	'primitives/typography': ['bg-panel'],
	// the lift cue of a row being dragged, over whatever surface the consumer composed
	'motion/reorder': ['shad-lg'],
	// a step marker's four states each set their own edge; a recipe cannot express a
	// per-status border (border vs border-strong vs none) on one element
	'navigation/stepper': ['bg-surface', 'border', 'border-strong', 'border-none']
};

const SURFACE_FILLS = new Set(['bg-surface', 'bg-panel', 'bg-overlay', 'bg-input']);
const SURFACE_BORDERS = new Set(['border', 'border-subtle', 'border-strong', 'border-dashed']);
const isShadow = (cls: string) => /^shad-(xs|sm|md|bs|lg|xl|2xl|3xl)$/.test(cls);

export function checkSurfaceComposition(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	for (const part of a.parts) {
		const src = readText(path.join(ROOT, a.ref.relDir, part.file));
		if (src === null) continue;
		const markup = markupOf(src);
		const declared = new Set(part.props.map((p) => p.name));
		const file = `${a.ref.relDir}/${part.file}`;
		for (const group of classGroups(markup)) {
			const seen = new Set<string>();
			const ingredients = new Map<string, number>();
			const surfaceClasses: { cls: string; line: number }[] = [];
			for (const { token, offset } of group.tokens) {
				if (seen.has(token)) continue;
				seen.add(token);
				const line = lineAt(src, offset);
				if ((SURFACES as readonly string[]).includes(token)) surfaceClasses.push({ cls: token, line });
				else if (SURFACE_FILLS.has(token) || SURFACE_BORDERS.has(token) || token === 'rim' || isShadow(token))
					ingredients.set(token, line);
			}
			const parts = [...ingredients.keys()];

			// 1. a surface class plus any of its own ingredients: the same decision twice
			if (surfaceClasses.length && parts.length) {
				out.push({
					rule: 'class/surface-composed',
					severity: 'error',
					file,
					line: surfaceClasses[0].line,
					message: `"${surfaceClasses[0].cls}" already sets fill, border and shadow — ${parts.join(', ')} here ${parts.length > 1 ? 'are' : 'is'} the same surface written twice`,
					fix: 'keep the surface class, or take `surface: Surface` and let its table pick the recipe; never spell the ingredients'
				});
				continue;
			}

			// 2. a surface class the consumer cannot reach
			if (surfaceClasses.length && !declared.has('surface')) {
				out.push({
					rule: 'class/surface-composed',
					severity: 'error',
					file,
					line: surfaceClasses[0].line,
					message: `"${surfaceClasses[0].cls}" chooses a surface the component declares no \`surface\` prop for`,
					fix: 'take `surface: Surface` from tokens.ts and compose the class from it'
				});
				continue;
			}

			// 3. a surface ingredient with no surface class at all — one is enough,
			// unless this component is named as owning that edge
			const exemptParts = new Set(SURFACE_EXEMPT[`${a.ref.kit}/${a.ref.slug}`] ?? []);
			const rest = parts.filter((p) => !exemptParts.has(p));
			if (!surfaceClasses.length && rest.length >= 1) {
				out.push({
					rule: 'class/surface-composed',
					severity: 'error',
					file,
					line: ingredients.get(rest[0]) ?? 1,
					message: `a surface ingredient written in the markup (${rest.join(', ')}) — a fill, a border and a shadow are one decision`,
					fix: declared.has('surface')
						? 'take one `Surface` value instead of the ingredients'
						: 'take `surface: Surface` and let its table pick the recipe'
				});
			}
		}
	}
	return out;
}


/** Is this offset inside the component's root element — the tag that carries `class` + rest? */
function onRootElement(markup: string, offset: number): boolean {
	// a {#snippet} written above the markup is not the root: skip past every snippet body
	let body = markup;
	let guard = 0;
	while (guard++ < 20) {
		const snip = body.search(/\{#snippet\b/);
		if (snip < 0) break;
		let depth = 0;
		let end = -1;
		for (let i = snip; i < body.length; i++) {
			if (body.startsWith('{#snippet', i)) depth++;
			else if (body.startsWith('{/snippet}', i)) {
				depth--;
				if (depth === 0) {
					end = i + '{/snippet}'.length;
					break;
				}
			}
		}
		if (end < 0) break;
		body = body.slice(0, snip) + ' '.repeat(end - snip) + body.slice(end);
	}
	const start = body.search(/<[a-zA-Z]/);
	if (start < 0 || offset < start) return false;
	let depth = 0;
	for (let i = start; i < markup.length; i++) {
		if (markup[i] === '{') depth++;
		else if (markup[i] === '}') depth--;
		else if (markup[i] === '>' && depth === 0) return offset <= i;
	}
	return false;
}

/** The element a class token belongs to, as source text, for structural exemptions. */
function elementAround(markup: string, offset: number): string | null {
	let start = -1;
	for (let i = offset; i >= 0; i--) {
		if (markup[i] === '<' && /[a-zA-Z]/.test(markup[i + 1] ?? '')) {
			start = i;
			break;
		}
		if (markup[i] === '>') return null;
	}
	if (start < 0) return null;
	let depth = 0;
	let end = start;
	for (let i = start; i < markup.length; i++) {
		if (markup[i] === '{') depth++;
		else if (markup[i] === '}') depth--;
		else if (markup[i] === '>' && depth === 0) {
			end = i;
			break;
		}
	}
	// include a small inline body so `<span …><Icon/></span>` reads as one element
	return markup.slice(start, Math.min(markup.length, end + 1));
}

// ── a local vocabulary must be a domain, and decisions.md must name it ───────

const UNION_DECL = /export type (\w+) = ((?:'[^']*'\s*\|\s*)*'[^']*');/g;

/**
 * A component's own type is legal only if `decisions.md` names it. The decision is
 * the allowlist: a vocabulary added without a line there is an invention, which is
 * how `ToastTone`, `AvatarSize` and `TabsVariant` appeared.
 */
export function checkOwnVocabularies(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	const decisions = readText(path.join(ROOT, 'decisions.md')) ?? '';
	for (const part of a.parts) {
		const src = readText(path.join(ROOT, a.ref.relDir, part.file));
		if (src === null) continue;
		for (const m of src.matchAll(UNION_DECL)) {
			const name = m[1];
			if (decisions.includes(`\`${name}\``)) continue;
			const values = [...m[2].matchAll(/'([^']*)'/g)].map((x) => x[1]);
			if (values.length < 2) continue;
			out.push({
				rule: 'props/own-vocabulary',
				severity: 'error',
				file: `${a.ref.relDir}/${part.file}`,
				line: lineAt(src, m.index ?? 0),
				message: `"${name}" is a local vocabulary the decisions file does not name`,
				fix: values.every((v) => /^(h-|text-|gap-|pad-|measure-|xleft|xcenter|xright|xbetween|ta-)/.test(v))
					? `it restates a canon prop — take the type from tokens.ts`
					: `add a line to decisions.md saying what domain ${name} names, or delete it`
			});
		}
	}
	return out;
}

// ── two things the class rules could never see ──────────────────────────────

/**
 * `look` is not a prop name. A prop that names a *speed* of the eye is not a decision;
 * the decision is the prop it stands for — `variant`, `surface`, `tone`, `ink`.
 */
export function checkBannedPropNames(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	const BANNED = ['look', 'soft'];
	for (const part of a.parts) {
		const src = readText(path.join(ROOT, a.ref.relDir, part.file));
		if (src === null) continue;
		for (const m of src.matchAll(/^\s+(look|soft)\?\s*:/gm)) {
			out.push({
				rule: 'props/banned-name',
				severity: 'error',
				file: `${a.ref.relDir}/${part.file}`,
				line: lineAt(src, m.index ?? 0),
				message: `"${m[1]}" is not a prop name`,
				fix: `name the decision it carries — \`variant\`, \`surface\`, \`tone\` or \`ink\``
			});
		}
	}
	return out;
}

const SCRIPT_CLASS_STRING = /['"`]([^'"`]*\b(?:bg-surface|bg-panel|bg-overlay|bg-input)\b[^'"`]*)['"`]/g;

/**
 * The surface rule read only markup, so a surface written in the script — a
 * `const surface = { elevated: 'bg-surface border-subtle rim shad-md' }` — was
 * invisible to it, even though that string is `.elevated` spelled out.
 */
export function checkComposedSurfaces(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	for (const part of a.parts) {
		const src = readText(path.join(ROOT, a.ref.relDir, part.file));
		if (src === null) continue;
		const script = src.slice(0, src.indexOf('</script>'));
		const exemptParts = new Set(SURFACE_EXEMPT[`${a.ref.kit}/${a.ref.slug}`] ?? []);
		for (const m of script.matchAll(SCRIPT_CLASS_STRING)) {
			const classes = m[1].split(/\s+/).filter(Boolean);
			const ingredients = classes.filter(
				(c) => (SURFACE_FILLS.has(c) || SURFACE_BORDERS.has(c) || c === 'rim' || isShadow(c)) && !exemptParts.has(c)
			);
			const surface = classes.find((c) => (SURFACES as readonly string[]).includes(c));
			if (surface || ingredients.length >= 2)
				out.push({
					rule: 'class/surface-composed',
					severity: 'error',
					file: `${a.ref.relDir}/${part.file}`,
					line: lineAt(src, m.index ?? 0),
					message: surface
						? `"${surface}" is spelled with ${ingredients.join(', ')} in a script string — the same surface twice`
						: `a surface composed in a script string (${ingredients.join(', ')}) — a fill, a border and a shadow are one decision`,
					fix: 'take `surface: Surface` and let the value be the class; never build the recipe'
				});
		}
	}
	return out;
}

// ── a rendered child's props belong to the caller ────────────────────────────

const CHILD_TAG = /<([A-Z][\w]*)\b([^>{]*(?:\{[^}]*\}[^>{]*)*)>/g;
const PROP_AXES = /(\bvariant|\bsize|\bshape|\bsurface|\bpad|\bgap|\btextSize|\btextColor|\btone|\bplacement|\bmeasure|\bgrouping|\btextAlign|\balignContent|\bicon|\bhref|\bdisabled)="[^"]*"/g;

/**
 * A component that renders another component and passes its props as literals
 * freezes them: the caller of the outer component cannot reach a `variant`, a
 * `size` or an `icon`. The outer component must take a `…Props` bag typed
 * `ComponentProps<typeof Child>` and spread it after its defaults.
 */
export function checkChildProps(a: ComponentAnalysis): Diag[] {
	const out: Diag[] = [];
	for (const part of a.parts) {
		const src = readText(path.join(ROOT, a.ref.relDir, part.file));
		if (src === null) continue;
		const script = src.slice(0, src.indexOf('</script>'));
		const imported = new Set<string>();
		for (const m of script.matchAll(/import\s+(?:\{([^}]*)\}|(\w+))\s+from\s+['"][^'"]*['"]/g)) {
			if (m[1]) for (const piece of m[1].split(',')) imported.add(piece.trim().split(/\s+as\s+/).pop() ?? '');
			if (m[2]) imported.add(m[2]);
		}
		const markup = src.slice(src.indexOf('</script>') + 9);
		const accepted = new Set(
			[...(script.matchAll(/ComponentProps<typeof (\w+)>/g) ?? [])].map((m) => m[1])
		);
		for (const m of markup.matchAll(CHILD_TAG)) {
			const child = m[1];
			if (!imported.has(child) || accepted.has(child)) continue;
			// a spread on the child is a deliberate pass-through: the caller reaches those props
			if (/\{\.\.\./.test(m[2])) continue;
			const literals = [...(m[2].match(PROP_AXES) ?? [])].map((x) => x.trim());
			if (!literals.length) continue;
			out.push({
				rule: 'props/frozen-child',
				severity: 'error',
				file: `${a.ref.relDir}/${part.file}`,
				line: lineAt(src, (src.indexOf('</script>') + 9) + (m.index ?? 0)),
				message: `<${child}> takes ${literals.slice(0, 3).join(', ')}${literals.length > 3 ? ` +${literals.length - 3}` : ''} as literals — the caller of ${a.name} cannot change them`,
				fix: `add \`${child.toLowerCase()}Props?: ComponentProps<typeof ${child}>\` and spread it after the defaults`
			});
		}
	}
	return out;
}
