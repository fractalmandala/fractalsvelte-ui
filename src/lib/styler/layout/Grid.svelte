<!-- @component A grid container with responsive column counts, gap and alignment. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../types';
	import type { Align } from './Stack.svelte';

	const GRID_ALIGN: Record<Align, string> = { start: 'ytop', center: 'ycenter', end: 'ybot', stretch: 'ystretch' };
	const GRID_JUSTIFY: Record<Align, string> = { start: 'xleft', center: 'xcenter', end: 'xright', stretch: 'xstretch' };

	/**
	 * 1–6 use fractalstyler's responsive grids (grid-3 is 1 → 3, grid-4 is
	 * 1 → 2 → 4, grid-6 is 1 → 3 → 6). 'auto-fit' is .card-grid: as many
	 * columns of at least --card-min as fit.
	 */
	export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 'auto-fit';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: GridColumns;
		gap?: Space;
		gapX?: Space;
		gapY?: Space;
		align?: Align;
		justify?: Align;
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
	class={[
		isAuto ? 'card-grid' : `grid-${columns}`,
		!isAuto && GRID_ALIGN[align],
		!isAuto && GRID_JUSTIFY[justify],
		!gapX && !gapY && `gap-${gap}`,
		`cgap-${gapX ?? gap}`,
		`rgap-${gapY ?? gap}`,
		className
	]}
	{...restProps}
>
	{@render children?.()}
</div>
