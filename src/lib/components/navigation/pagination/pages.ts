/** A page number, or a gap in the range. */
export type PageSlot = number | 'ellipsis';

/**
 * The visible page numbers around `page`, with `siblings` on each side and
 * `boundaries` kept at each end, collapsing the rest into ellipses.
 */
export function pageSlots(page: number, count: number, siblings: number, boundaries: number): PageSlot[] {
	const total = Math.max(0, Math.floor(count));
	if (total === 0) return [];
	const current = Math.min(Math.max(1, Math.floor(page)), total);
	const side = Math.max(0, Math.floor(siblings));
	const edge = Math.max(0, Math.floor(boundaries));
	const set = new Set<number>();
	for (let i = 1; i <= edge; i++) set.add(i);
	for (let i = total - edge + 1; i <= total; i++) if (i >= 1) set.add(i);
	for (let i = current - side; i <= current + side; i++) {
		if (i >= 1 && i <= total) set.add(i);
	}
	const sorted = [...set].sort((a, b) => a - b);
	const out: PageSlot[] = [];
	let prev = 0;
	for (const n of sorted) {
		if (prev && n - prev > 1) out.push('ellipsis');
		out.push(n);
		prev = n;
	}
	return out;
}
