<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSpace } from '../types';
	import {
		GAP,
		CGAP,
		RGAP,
		ROW_JUSTIFY,
		ROW_ALIGN,
		BOX_JUSTIFY,
		BOX_ALIGN,
		cx,
		type FsJustify,
		type FsAlign
	} from '../classes';
	import type { StackDirection } from './Stack.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: StackDirection;
		wrap?: boolean;
		/** Both axes; gapX / gapY override one axis each */
		gap?: FsSpace;
		gapX?: FsSpace;
		gapY?: FsSpace;
		align?: FsAlign;
		justify?: FsJustify;
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
	class={cx(
		isRow ? 'row' : 'box',
		isRow ? ROW_JUSTIFY[justify] : BOX_JUSTIFY[justify],
		isRow ? ROW_ALIGN[align] : BOX_ALIGN[align],
		gap && !gapX && !gapY && GAP[gap],
		(gapX ?? (gapY && gap)) && CGAP[(gapX ?? gap)!],
		(gapY ?? (gapX && gap)) && RGAP[(gapY ?? gap)!],
		wrap && 'wrap',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
