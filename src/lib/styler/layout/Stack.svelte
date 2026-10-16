<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsSpace } from '../types';
	import {
		GAP,
		ROW_JUSTIFY,
		ROW_ALIGN,
		BOX_JUSTIFY,
		BOX_ALIGN,
		cx,
		type FsJustify,
		type FsAlign
	} from '../classes';

	/** fractalstyler has no reverse flows; only the two foundations. */
	export type StackDirection = 'column' | 'row';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		direction?: StackDirection;
		gap?: FsSpace;
		align?: FsAlign;
		justify?: FsJustify;
		wrap?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		direction = 'column',
		gap = 'md',
		align = 'stretch',
		justify = 'start',
		wrap = false,
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
		GAP[gap],
		wrap && 'wrap',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
