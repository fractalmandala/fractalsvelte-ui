<!-- @component A dense, staggered bento grid whose items can span columns and rows, and collapse to one column on small screens. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { stagger, vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** How many columns the grid has. Collapses to one column when the container is narrower than the md measure. */
		columns?: number;
		/** The gap between items, as a CSS length. */
		gap?: string;
		/** The height of one grid row, as a CSS length. Items with `rowSpan` occupy this many rows. */
		rowHeight?: string;
		/** The bento items. */
		children?: Snippet;
	}

	let {
		columns = 4,
		gap = 'var(--space-md)',
		rowHeight = '8rem',
		class: klass,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={['bento', klass]}
	{@attach vars({ cols: columns, gap, 'row-h': rowHeight })}
	{@attach stagger()}
	{...rest}
>
	{@render children?.()}
</div>
