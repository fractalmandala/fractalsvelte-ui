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
	INTENTS
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

	const propsMatch = raw.match(/interface\s+Props(?:\s+extends\s+([^{]+))?\s*\{([\s\S]*?)\n\t*\}/);
	if (!propsMatch) return { extendsList: [], props: [] };

	const extendsList = propsMatch[1] ? splitTopLevelCommas(propsMatch[1].trim()) : [];
	const body = propsMatch[2];
	const props: LivePropMeta[] = [];

	const propRegex = /(?:(\/\*\*[\s\S]*?\*\/)\s*)?([a-zA-Z0-9_$]+)(\??)\s*:\s*([^;]+);/g;
	let pm;
	while ((pm = propRegex.exec(body)) !== null) {
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
		const type = pm[4].trim();
		const def = defaults[name] ?? null;

		props.push({ name, type, optional, default: def, comment });
	}

	return { extendsList, props };
}

function parseComponents(): ComponentEntry[] {
	const list: ComponentEntry[] = [];

	for (const [filepath, raw] of Object.entries(rawComponents)) {
		const match = filepath.match(/components\/([^/]+)\/([^/]+)\.svelte$/);
		if (!match) continue;

		const [, categoryDir, filename] = match;
		const category = categoryDir.charAt(0).toUpperCase() + categoryDir.slice(1);
		const name = filename;
		const path = `${categoryDir}/${name}`;
		const title = titleOf(name);
		const description = describe(raw);
		const { extendsList, props } = parseProps(raw);

		list.push({
			name,
			title,
			path,
			category,
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
	intent: INTENTS,
	frame: Frames
};

const SAMPLE_TEXT: Record<string, string> = {
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

const CARDLIKE = new Set(['layout/Card', 'layout/ClickableCard', 'layout/SelectableCard']);

function resolveTypeValues(typeStr: string | undefined, raw: string): readonly string[] | null {
	if (!typeStr) return null;
	const trimmed = typeStr.trim();
	if (trimmed.includes('|')) {
		const literals = [...trimmed.matchAll(/'([^']+)'/g)].map((x) => x[1]);
		if (literals.length > 0) return literals;
	}
	if (!/^[a-zA-Z0-9_$]+$/.test(trimmed)) return null;

	const aliasMatch = raw.match(new RegExp(`type\\s+${trimmed}\\s*=\\s*([^;\\n]+)`));
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

	// 1. IconData prop (rendering an SVG icon glyph)
	if (propMeta?.type?.includes('IconData')) {
		return [{ label: 'icon', value: { $icon: 'luStar' } }];
	}

	// 2. Custom local literal union (e.g. TabsVariant, Placement, etc.)
	const customLiterals = resolveTypeValues(propMeta?.type, raw);
	if (customLiterals && customLiterals.length > 0) {
		return customLiterals.map((v) => ({ label: v, value: v }));
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
		return list.map((v) => ({ label: String(v), value: v }));
	}

	// 4. Boolean props
	if (propMeta?.type === 'boolean' || propMeta?.type === 'boolean | null') {
		return [
			{ label: 'false', value: false },
			{ label: 'true', value: true }
		];
	}

	// 5. Snippets
	if (propMeta?.type?.includes('Snippet')) {
		return [{ label: 'snippet', value: { $snippet: SAMPLE_TEXT[propName] ?? 'Sample' } }];
	}

	// 6. Strings and Numbers
	if (propMeta?.type === 'string') {
		const sampleVal = SAMPLE_TEXT[propName] ?? 'Sample';
		return [{ label: sampleVal, value: sampleVal }];
	}
	if (propMeta?.type === 'number') {
		const num = Number(propMeta.default) || 1;
		return [
			{ label: String(num), value: num },
			{ label: String(num * 2), value: num * 2 }
		];
	}

	return [{ label: 'sample', value: { $base: propName } }];
}
