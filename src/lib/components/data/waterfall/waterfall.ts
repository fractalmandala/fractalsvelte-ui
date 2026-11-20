import type { Tone } from '../../../internal/tokens.js';

/** One row of a waterfall, with its nested spans underneath it. */
export interface WaterfallItem {
	id: string;
	label: string;
	/** Start of the span, in the same unit as `duration` (ms, usually). */
	start: number;
	duration: number;
	status?: string;
	tone?: Tone;
	children?: WaterfallItem[];
}

/** A vertical marker on the timeline (a deploy, an event). */
export interface WaterfallMarker {
	value: number;
	label?: string;
}

/** A row as the template walks it: the item, how deep it sits, and whether it has children. */
export interface WaterfallRow {
	item: WaterfallItem;
	depth: number;
	hasChildren: boolean;
}

/** The rows to render: parents, then the children of anything in `expanded`. */
export function flattenWaterfall(
	items: readonly WaterfallItem[],
	expanded: ReadonlySet<string>,
	depth = 0
): WaterfallRow[] {
	const out: WaterfallRow[] = [];

	for (const item of items) {
		const hasChildren = Boolean(item.children && item.children.length > 0);
		out.push({ item, depth, hasChildren });

		if (hasChildren && expanded.has(item.id)) {
			out.push(...flattenWaterfall(item.children!, expanded, depth + 1));
		}
	}

	return out;
}

/** Every id that has children, so "expand all" knows what to open. */
export function collectExpandableIds(
	items: readonly WaterfallItem[],
	acc: string[] = []
): string[] {
	for (const item of items) {
		if (item.children?.length) {
			acc.push(item.id);
			collectExpandableIds(item.children, acc);
		}
	}

	return acc;
}

/** The span the timeline covers, including any markers; never empty or inverted. */
export function computeBounds(
	items: readonly WaterfallItem[],
	markers: readonly WaterfallMarker[] = []
): { min: number; max: number } {
	let min = Infinity;
	let max = -Infinity;

	function walk(list: readonly WaterfallItem[]): void {
		for (const item of list) {
			min = Math.min(min, item.start);
			max = Math.max(max, item.start + item.duration);
			if (item.children?.length) walk(item.children);
		}
	}

	walk(items);

	for (const m of markers) {
		min = Math.min(min, m.value);
		max = Math.max(max, m.value);
	}

	if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 100 };
	if (max <= min) return { min, max: min + 1 };

	return { min: Math.min(0, min), max };
}
