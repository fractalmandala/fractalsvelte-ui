/**
 * Docs-site component search. The list is the docs registry plus `manual`,
 * an array you can hand-edit while developing. The library, the gate and
 * the generators do not read this file.
 */
import { components } from './registry.js';

export interface SearchItem {
	name: string;
	href: string;
	summary?: string;
}

/**
 * Hand-edited extras for local testing. Add a `{ name, href, summary? }`
 * object here; it is merged into the search list and does not need a
 * component folder. An entry with the same `href` as a registry component
 * wins (handy for trying a different name or summary).
 *
 * @example
 * export const manual: SearchItem[] = [
 *   { name: 'MyDraft', href: '/components/primitives/my-draft', summary: 'Work in progress.' },
 * ];
 */
export const manual: SearchItem[] = [
	// { name: 'MyDraft', href: '/components/primitives/my-draft', summary: 'Work in progress.' },
];

/** Registry entries plus `manual`. Hand-edited entries come first so they can override a registry `href`. */
export function searchList(): SearchItem[] {
	const items: SearchItem[] = [
		...manual.map((item) => ({ name: item.name, href: item.href, summary: item.summary })),
		...components().map((c) => ({ name: c.name, href: c.href, summary: c.summary }))
	];
	const seen = new Set<string>();
	const out: SearchItem[] = [];
	for (const item of items) {
		if (seen.has(item.href)) continue;
		seen.add(item.href);
		out.push(item);
	}
	return out;
}

/**
 * Case-insensitive name substring match. Returns `[]` until the trimmed
 * query is at least 3 characters. Names that start with the query are
 * ranked first; results are unique by `href`.
 */
export function searchComponents(query: string): SearchItem[] {
	const q = query.trim().toLowerCase();
	if (q.length < 3) return [];
	const starts: SearchItem[] = [];
	const contains: SearchItem[] = [];
	const seen = new Set<string>();
	for (const item of searchList()) {
		if (seen.has(item.href)) continue;
		const name = item.name.toLowerCase();
		if (name.startsWith(q)) {
			seen.add(item.href);
			starts.push(item);
		} else if (name.includes(q)) {
			seen.add(item.href);
			contains.push(item);
		}
	}
	return [...starts, ...contains];
}
