<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSpace } from '../types';
	import { GAP, CGAP, RGAP, GRID_COLS, GRID_ALIGN, GRID_JUSTIFY, cx, type FsAlign, type FsColumns } from '../classes';

	/**
	 * 1–6 use fractalstyler's responsive grids (grid-3 is 1 → 3, grid-4 is
	 * 1 → 2 → 4, grid-6 is 1 → 3 → 6). 'auto-fit' is .card-grid: as many
	 * columns of at least --card-min as fit.
	 */
	export type GridColumns = FsColumns | 'auto-fit';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: GridColumns;
		gap?: FsSpace;
		gapX?: FsSpace;
		gapY?: FsSpace;
		align?: FsAlign;
		justify?: FsAlign;
		class?: string;
		children?: Snippet;
	}

	let {
		columns = 1,
		gap = 'md',
		gapX,
		gapY,
		align = 'stretch',
		justify = 'stretch',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// card-grid is not one of the .grid-N bases, so it takes no x/y modifiers.
	const isAuto = $derived(columns === 'auto-fit');
</script>

<div
	class={cx(
		isAuto ? 'card-grid' : GRID_COLS[columns as FsColumns],
		!isAuto && GRID_ALIGN[align],
		!isAuto && GRID_JUSTIFY[justify],
		!gapX && !gapY && GAP[gap],
		CGAP[gapX ?? gap],
		RGAP[gapY ?? gap],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
