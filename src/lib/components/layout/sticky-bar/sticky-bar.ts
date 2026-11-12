/** Walks up from `node` to the nearest scroll container, or `null` for the viewport. */
export function scrollParent(node: HTMLElement): HTMLElement | null {
	let current = node.parentElement;
	while (current) {
		const { overflow, overflowX, overflowY } = getComputedStyle(current);
		if (/(auto|scroll)/.test(`${overflow}${overflowX}${overflowY}`)) return current;
		current = current.parentElement;
	}
	return null;
}
