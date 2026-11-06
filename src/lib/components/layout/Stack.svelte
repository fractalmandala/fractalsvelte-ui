<!-- @component Flexible linear stack layout container with direction, gap, alignment, and wrap options. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Pad, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: 'row' | 'column';
		gap?: number | string;
		align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
		justify?: 'start' | 'center' | 'end' | 'between' | 'around';
		wrap?: boolean;
		padding?: Pad;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		direction = 'column',
		gap = 3,
		align,
		justify,
		wrap = false,
		padding,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const computedGap = $derived(typeof gap === 'number' ? `${gap * 0.25}rem` : gap);
	const computedJustify = $derived(
		justify === 'between'
			? 'space-between'
			: justify === 'around'
				? 'space-around'
				: justify
	);
	const computedAlign = $derived(
		align === 'start'
			? 'flex-start'
			: align === 'end'
				? 'flex-end'
				: align
	);
</script>

<div
	class="stack-container {padding ?? ''} {textsize} {className}"
	style:flex-direction={direction}
	style:gap={computedGap}
	style:align-items={computedAlign}
	style:justify-content={computedJustify}
	style:flex-wrap={wrap ? 'wrap' : undefined}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.stack-container {
		display: flex;
		min-width: 0;
		box-sizing: border-box;
	}
</style>
