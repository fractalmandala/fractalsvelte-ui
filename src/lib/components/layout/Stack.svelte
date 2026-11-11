<!-- @component Flexible linear stack layout container with direction, gap, alignment, and wrap options. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Space, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** `row` lays children side by side; `column` stacks them. */
		direction?: 'row' | 'column';
		/** Space between children, from the spacing scale. */
		gap?: Space;
		/** Alignment across the stacking direction. */
		align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
		/** Distribution along the stacking direction. */
		justify?: 'start' | 'center' | 'end' | 'between' | 'around';
		/** Lets children wrap onto more lines when they run out of room. */
		wrap?: boolean;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		direction = 'column',
		gap = 'md',
		align,
		justify,
		wrap = false,
		padding,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Alignment is the class language's x/y pair: in a column x is the cross
	// axis, in a row it is the main axis.
	const column = $derived(direction === 'column');
	const CROSS_X = { start: 'xleft', center: 'xcenter', end: 'xright', stretch: '', baseline: '' };
	const CROSS_Y = { start: 'ytop', center: 'ycenter', end: 'ybot', stretch: '', baseline: '' };
	const MAIN_X = { start: 'xleft', center: 'xcenter', end: 'xright', between: 'xbetween', around: 'xaround' };
	const MAIN_Y = { start: 'ytop', center: 'ycenter', end: 'ybot', between: 'ybetween', around: 'yaround' };
	const alignClass = $derived(align ? (column ? CROSS_X : CROSS_Y)[align] : '');
	const justifyClass = $derived(justify ? (column ? MAIN_Y : MAIN_X)[justify] : '');
</script>

<div
	class="{column ? 'box' : 'row'} min0 gap-{gap} {alignClass} {justifyClass} {wrap ? 'wrap' : ''} {padding ?? ''} {textsize} {className}"
	{...restProps}
>
	{@render children?.()}
</div>
