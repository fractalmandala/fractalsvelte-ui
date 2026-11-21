import type { Tone } from '../../../internal/tokens.js';

export interface WaterfallItem {
	id: string;
	label: string;
	start: number;
	duration: number;
	status?: string;
	tone?: Tone;
	children?: WaterfallItem[];
}

export interface WaterfallMarker {
	value: number;
	label?: string;
}

export interface WaterfallRow {
	item: WaterfallItem;
	depth: number;
	hasChildren: boolean;
}

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
