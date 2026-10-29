<!-- @component A flex container with direction, wrap, gap and alignment props. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../types';
	import { ROW_JUSTIFY, ROW_ALIGN, BOX_JUSTIFY, BOX_ALIGN, type StackDirection, type Justify, type Align } from './Stack.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: StackDirection;
		wrap?: boolean;
		/** Both axes; gapX / gapY override one axis each */
		gap?: Space;
		gapX?: Space;
		gapY?: Space;
		align?: Align;
		justify?: Justify;
		class?: string;
		children?: Snippet;
	}

	let {
		direction = 'row',
		wrap = false,
		gap,
		gapX,
		gapY,
		align = 'stretch',
		justify = 'start',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const isRow = $derived(direction === 'row');
</script>

<div
	class={[
		isRow ? 'row' : 'box',
		isRow ? ROW_JUSTIFY[justify] : BOX_JUSTIFY[justify],
		isRow ? ROW_ALIGN[align] : BOX_ALIGN[align],
		gap && !gapX && !gapY && `gap-${gap}`,
		(gapX ?? (gapY && gap)) && `cgap-${gapX ?? gap}`,
		(gapY ?? (gapX && gap)) && `rgap-${gapY ?? gap}`,
		wrap && 'wrap',
		className
	]}
	{...restProps}
>
	{@render children?.()}
</div>
