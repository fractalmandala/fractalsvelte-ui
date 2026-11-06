<!-- @component Responsive CSS Grid container with explicit columns or auto-fit/auto-fill minmax tracks. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Pad, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Fixed number of equal-width columns. Omit for responsive auto-fit. */
		cols?: number;
		/** Minimum column track width for auto-fit, e.g. '14rem' or '250px'. */
		min?: string;
		/** Grid gap spacing unit (number * 0.25rem) or explicit CSS string. */
		gap?: number | string;
		padding?: Pad;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		cols,
		min = '14rem',
		gap = 4,
		padding,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const computedGap = $derived(typeof gap === 'number' ? `${gap * 0.25}rem` : gap);
	const templateCols = $derived(
		cols
			? `repeat(${cols}, minmax(0, 1fr))`
			: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`
	);
</script>

<div
	class="grid-container {padding ?? ''} {textsize} {className}"
	style:grid-template-columns={templateCols}
	style:gap={computedGap}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.grid-container {
		display: grid;
		width: 100%;
		box-sizing: border-box;
	}
</style>
