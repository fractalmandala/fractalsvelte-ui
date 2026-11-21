export type MasonryColumns = {
	base?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
};

export type PackedItem = {
	x: number;
	y: number;
};

export function resolveColumns(
	map: MasonryColumns,
	width: number,
	breakpoints: Record<'sm' | 'md' | 'lg' | 'xl', number>
): number {
	let cols = map.base ?? 1;
	if (map.sm !== undefined && width >= breakpoints.sm) cols = map.sm;
	if (map.md !== undefined && width >= breakpoints.md) cols = map.md;
	if (map.lg !== undefined && width >= breakpoints.lg) cols = map.lg;
	if (map.xl !== undefined && width >= breakpoints.xl) cols = map.xl;
	return Math.max(1, cols);
}

export function readBreakpoints(root: HTMLElement): Record<'sm' | 'md' | 'lg' | 'xl', number> {
	const styles = getComputedStyle(root);
	const px = (name: string, fallback: number): number => {
		const n = parseFloat(styles.getPropertyValue(name).trim());
		return Number.isFinite(n) ? n : fallback;
	};
	return {
		sm: px('--bp-sm', 769),
		md: px('--bp-md', 1025),
		lg: px('--bp-lg', 1281),
		xl: px('--bp-xl', 1441)
	};
}

export function supportsMasonry(): boolean {
	return typeof CSS !== 'undefined' && CSS.supports('grid-template-rows', 'masonry');
}

export function packColumns(heights: number[], cols: number, gap: number, colWidth: number): { items: PackedItem[]; extent: number } {
	const count = Math.max(1, cols);
	const colH = Array.from({ length: count }, () => 0);
	const items: PackedItem[] = [];
	for (const height of heights) {
		let col = 0;
		for (let i = 1; i < count; i += 1) {
			if ((colH[i] ?? 0) < (colH[col] ?? 0)) col = i;
		}
		const x = col * (colWidth + gap);
		const y = colH[col] ?? 0;
		items.push({ x, y });
		colH[col] = y + height + gap;
	}
	const tallest = colH.reduce((max, h) => Math.max(max, h), 0);
	return { items, extent: Math.max(0, heights.length ? tallest - gap : 0) };
}
