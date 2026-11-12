<!-- @component One cell of the bento, with column and row span, an optional featured surface, and an optional hover lift. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** How many columns this item spans. */
		colSpan?: number;
		/** How many rows this item spans. */
		rowSpan?: number;
		/** Marks the item as a featured tile, with a raised surface. */
		featured?: boolean;
		/** Lifts the item on hover with a spring. */
		lift?: boolean;
		/** The item's content. */
		children?: Snippet;
	}

	let {
		colSpan = 1,
		rowSpan = 1,
		featured = false,
		lift = false,
		class: klass,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={[
		'span min0 anim-in',
		featured && 'box pad-md border-subtle radius-md bg-panel rim shad-sm',
		lift && 'lift',
		klass
	]}
	{@attach vars({ cspan: colSpan, rspan: rowSpan })}
	{...rest}
>
	{@render children?.()}
</div>
