/** The imperative handle of a VirtualList, from `bind:this`. */
export interface VirtualListHandle {
	/** Scroll so the item at `index` is aligned in the viewport. */
	scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' }) => void;
}

/** Find the first index whose span contains `offset` in a prefix-sum array. */
export function indexAtOffset(prefixes: number[], offset: number): number {
	let lo = 0;
	let hi = prefixes.length - 2;
	if (hi < 0) return 0;
	const y = Math.max(0, Math.min(offset, prefixes[prefixes.length - 1] ?? 0));
	while (lo < hi) {
		const mid = (lo + hi) >> 1;
		const end = prefixes[mid + 1] ?? 0;
		if (end <= y) lo = mid + 1;
		else hi = mid;
	}
	return lo;
}
