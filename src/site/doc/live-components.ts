import {
	Variants,
	Sizes,
	Shapes,
	Shadows,
	Surfaces,
	Borders,
	IconVariants,
	ORIENTATIONS,
	TextSizes,
	Messages,
	Weights,
	Frames,
	Spaces,
	ChildTextSizes
} from '$lib/types.js';

export interface LivePropMeta {
	name: string;
	type: string;
	optional: boolean;
	default: string | null;
	comment: string | null;
}

export interface Example {
	label: string;
	value: unknown;
	extra?: Record<string, unknown>;
}

export interface ComponentEntry {
	name: string;
	title: string;
	path: string; // e.g. "actions/Button"
	category: string;
	description: string | null;
	extendsList: string[];
	props: LivePropMeta[];
	raw: string;
}

// Live raw component files using Vite's eager glob.
// Re-evaluates instantly on HMR whenever any component in src/lib/components changes.
import indexRaw from '$lib/components/index.ts?raw';

const rawComponents = import.meta.glob<string>('$lib/components/**/*.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
});

function titleOf(name: string): string {
	return name.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

function describe(raw: string): string | null {
	const m = raw.match(/<!--\s*@component\s*([\s\S]*?)-->/);
	const line = m?.[1]?.split('\n').map((l) => l.trim()).find(Boolean);
	return line ?? null;
}

function splitTopLevelCommas(str: string): string[] {
	const out: string[] = [];
	let depth = 0;
	let cur = '';
	for (const ch of str) {
		if ('<([{'.includes(ch)) depth++;
		else if ('>)]}'.includes(ch)) depth--;
		if (ch === ',' && depth === 0) {
			if (cur.trim()) out.push(cur.trim());
			cur = '';
		} else {
			cur += ch;
		}
	}
	if (cur.trim()) out.push(cur.trim());
	return out;
}

function parseProps(raw: string): { extendsList: string[]; props: LivePropMeta[] } {
	const defaults: Record<string, string> = {};
	const defaultsMatch = raw.match(/let\s*\{([\s\S]*?)\}\s*(?::\s*Props)?\s*=\s*\$props\(\)/);
	if (defaultsMatch) {
		const body = defaultsMatch[1];
		const re = /(?:class:\s*className|([a-zA-Z0-9_$]+))\s*=\s*([^,;]+)/g;
		let m;
		while ((m = re.exec(body)) !== null) {
			const prop = m[1] || 'class';
			defaults[prop] = m[2].trim();
		}
	}

	// The Props interface body, found by matching braces so multi-line member types stay whole.
	const head = raw.match(/interface\s+Props(?:\s+extends\s+([^{]+))?\s*\{/);
	if (!head || head.index === undefined) return { extendsList: [], props: [] };
	let open = 1;
	let end = head.index + head[0].length;
	while (end < raw.length && open > 0) {
		if (raw[end] === '{') open++;
		else if (raw[end] === '}') open--;
		end++;
	}
	const propsMatch = [head[0], head[1], raw.slice(head.index + head[0].length, end - 1)] as const;

	const extendsList = propsMatch[1] ? splitTopLevelCommas(propsMatch[1].trim()) : [];
	const props: LivePropMeta[] = [];

	// Split the interface body into its top-level members. Snippet parameter
	// types like `Snippet<[{ item: X; isOpen: boolean }]>` hold semicolons of
	// their own, so only a semicolon at depth 0 ends a member. `=>` is not a
	// closing angle bracket.
	const members: string[] = [];
	let depth = 0;
	let cur = '';
	const body = propsMatch[2];
	for (let i = 0; i < body.length; i++) {
		const ch = body[i];
		// comments are opaque: a semicolon or bracket inside one means nothing
		if (ch === '/' && (body[i + 1] === '*' || body[i + 1] === '/')) {
			const close = body[i + 1] === '*' ? body.indexOf('*/', i + 2) + 2 : body.indexOf('\n', i);
			const stop = close > i ? close : body.length;
			cur += body.slice(i, stop);
			i = stop - 1;
			continue;
		}
		if ('([{<'.includes(ch)) depth++;
		else if (')]}'.includes(ch) || (ch === '>' && body[i - 1] !== '=')) depth--;
		if (ch === ';' && depth === 0) {
			members.push(cur);
			cur = '';
		} else cur += ch;
	}

	for (const member of members) {
		const clean = member.replace(/^\s*\/\/[^\n]*\n/gm, '');
		const pm = clean.match(/^\s*(\/\*\*[\s\S]*?\*\/)?\s*([a-zA-Z0-9_$]+)(\??)\s*:\s*([\s\S]+)$/);
		if (!pm) continue;
		const rawComment = pm[1];
		let comment: string | null = null;
		if (rawComment) {
			comment = rawComment
				.replace(/^\/\*\*|\*\/$/g, '')
				.split('\n')
				.map((l) => l.replace(/^\s*\*\s?/, '').trim())
				.filter(Boolean)
				.join(' ');
		}
		const name = pm[2];
		const optional = Boolean(pm[3]);
		const type = pm[4].replace(/\s+/g, ' ').trim();
		const def = defaults[name] ?? null;

		if (props.some((p) => p.name === name)) continue;
		props.push({ name, type, optional, default: def, comment });
	}

	return { extendsList, props };
}

function parseComponents(): ComponentEntry[] {
	const list: ComponentEntry[] = [];
	for (const line of indexRaw.split('\n')) {
		const exportMatch = line.match(/export\s*\{\s*default\s*as\s*(\w+)\s*\}\s*from\s*'\.\/([^']+)\.svelte';/);
		if (!exportMatch) continue;

		const [, name, relPath] = exportMatch;
		const rawKey = `/src/lib/components/${relPath}.svelte`;
		const raw = rawComponents[rawKey] ?? '';

		const title = titleOf(name);
		const description = describe(raw);
		const { extendsList, props } = parseProps(raw);

		list.push({
			name,
			title,
			path: relPath,
			// the group is the folder the component lives in
			category: relPath.split('/')[0],
			description,
			extendsList,
			props,
			raw
		});
	}

	return list.sort((a, b) => a.name.localeCompare(b.name));
}

export const liveComponents: ComponentEntry[] = parseComponents();

export function getLiveComponentBySlug(slug: string): ComponentEntry | undefined {
	const s = slug.toLowerCase();
	return liveComponents.find((c) => c.name.toLowerCase() === s);
}

export function getLiveComponentByPath(path: string): ComponentEntry | undefined {
	return liveComponents.find((c) => c.path === path);
}

// Canonical Prop Axes from src/lib/types.ts
const CANONICAL_AXES: Record<string, readonly (string | number)[]> = {
	variant: Variants,
	gap: Spaces,
	space: Spaces,
	padding: ['pad-sm', 'pad-md', 'pad-lg', 'pad-xl'],
	childtextsize: ChildTextSizes,
	size: Sizes,
	shape: Shapes,
	shadow: Shadows,
	surface: Surfaces,
	border: Borders,
	icon: IconVariants,
	iconvariant: IconVariants,
	orientation: ORIENTATIONS,
	direction: ORIENTATIONS,
	textsize: TextSizes,
	textsizes: TextSizes,
	weight: Weights,
	message: Messages,
	frame: Frames
};

/** Canonical unions from src/lib/types.ts by type name, for spelling a prop's values out. */
export const TYPE_VALUES: Record<string, readonly string[]> = {
	Variant: Variants,
	Space: Spaces,
	Size: Sizes,
	Shape: Shapes,
	Shadow: Shadows,
	Surface: Surfaces,
	Border: Borders,
	IconVariant: IconVariants,
	Orientation: ORIENTATIONS,
	TextSize: TextSizes,
	Weight: Weights,
	Message: Messages,
	Frame: Frames
};

const SAMPLE_TEXT: Record<string, string> = {
	avatar: 'https://sddlbohniijgegvypkfk.supabase.co/storage/v1/object/public/panvate/fractalsvelte/assets/avatar.png',
	timeframe: 'vs last month',
	title: 'Title',
	label: 'Label',
	description: 'A short description.',
	badge: 'New',
	placeholder: 'Type here…',
	popularLabel: 'Label!',
	helperText: 'Helper text',
	unit: '%',
	prefix: '₹',
	suffix: 'k',
	shortcut: '⌘K',
	counter: '7/7',
	error: 'Something went wrong',
	leading: '@',
	trailing: '.com',
	header: 'Custom header',
	footer: 'Footer',
	headerExtra: 'New',
	legend: 'Account settings',
	hint: 'PNG or JPG up to 10 MB',
	content: 'Save changes',
	emptyMessage: 'Nothing matches',
	emptyText: 'Nothing matches',
	filename: 'install.sh',
	language: 'bash'
};

const LAYER_SURFACES = ['bg-main', 'bg-surface', 'bg-panel', 'bg-overlay'];
const capitalise = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const CARDLIKE = new Set(['core/Card', 'layout/Card', 'layout/ClickableCard', 'layout/SelectableCard']);

function resolveTypeValues(typeStr: string | undefined, raw: string): readonly string[] | null {
	if (!typeStr) return null;
	const trimmed = typeStr.trim();
	if (trimmed.includes('|')) {
		const literals = [...trimmed.matchAll(/'([^']+)'/g)].map((x) => x[1]);
		if (literals.length > 0) return literals;
	}
	if (!/^[a-zA-Z0-9_$]+$/.test(trimmed)) return null;

	const aliasMatch = raw.match(new RegExp(`type\\s+${trimmed}\\s*=\\s*([^;]+)`));
	if (aliasMatch && aliasMatch[1]) {
		const literals = [...aliasMatch[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
		if (literals.length > 0) return literals;
	}
	return null;
}

export function getLiveExamplesForProp(
	compPath: string,
	propName: string,
	propMeta?: LivePropMeta
): Example[] {
	const entry = getLiveComponentByPath(compPath);
	const raw = entry?.raw ?? '';

	// 1. Icon prop (rendering an SVG icon glyph)
	if (propMeta?.type?.includes('IconNode')) {
		return [
			{ label: 'default icon', value: undefined },
			{ label: 'custom icon', value: { $icon: 'klStar' } }
		];
	}

	// 2. Custom local literal union (e.g. TabsVariant, Placement, etc.)
	const customLiterals = resolveTypeValues(propMeta?.type, raw);
	if (customLiterals && customLiterals.length > 0) {
		return customLiterals.map((v) => ({ label: v, value: v }));
	}

	// 2b. A union of numbers, e.g. `2 | 3 | 4`
	const numeric = propMeta?.type?.split('|').map((part) => part.trim()) ?? [];
	if (numeric.length > 1 && numeric.every((part) => /^\d+$/.test(part))) {
		return numeric.map((part) => ({ label: part, value: Number(part) }));
	}

	// 3. Canonical type axes from src/lib/types.ts
	const lower = propName.toLowerCase();
	let values: readonly (string | number | boolean)[] | null =
		CANONICAL_AXES[lower] ??
		(propMeta ? CANONICAL_AXES[propMeta.type.toLowerCase()] : null) ??
		null;

	if (values && values.length > 0) {
		let list = values;
		if (CARDLIKE.has(compPath) && propName === 'shape') {
			list = list.filter((v) => v !== 'round');
		}
		// A surface preview shows the page layers; control fills and state tints
		// only appear when the component itself defaults to one.
		if (lower === 'surface') {
			const own = propMeta?.default?.replace(/['"]/g, '');
			list = list.filter((v) => LAYER_SURFACES.includes(String(v)) || v === own);
		}
		return list.map((v) => ({ label: String(v), value: v }));
	}

	// 4. Boolean props
	if (propMeta?.type === 'boolean' || propMeta?.type === 'boolean | null') {
		return [
			{ label: 'false', value: false },
			{ label: 'true', value: true }
		];
	}

	// 5. Snippets: shown without, then with
	if (propMeta?.type?.includes('Snippet')) {
		return [
			{ label: `no ${propName}`, value: undefined },
			{ label: `with ${propName}`, value: { $snippet: SAMPLE_TEXT[propName] ?? capitalise(propName) } }
		];
	}

	// 6. Strings and Numbers
	if (propMeta?.type === 'string') {
		const sampleVal = SAMPLE_TEXT[propName] ?? 'Sample';
		return [
			{ label: `no ${propName}`, value: undefined },
			{ label: `with ${propName}`, value: sampleVal }
		];
	}
	if (propMeta?.type === 'number') {
		const num = Number(propMeta.default) || 1;
		return [
			{ label: String(num), value: num },
			{ label: String(num * 2), value: num * 2 }
		];
	}

	// Nothing to vary: the row is left out rather than showing one unexplained sample.
	return [];
}
