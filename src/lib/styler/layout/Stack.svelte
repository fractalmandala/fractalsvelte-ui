<!-- @component A vertical stack of children with even spacing. -->

<script lang="ts" module>
	export type StackDirection = 'column' | 'row';
	export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	export type Align = 'start' | 'center' | 'end' | 'stretch';
	// x/y are physical axes in fractalstyler: the same intent maps differently on .row and .box.
	export const ROW_JUSTIFY: Record<Justify, string> = { start: 'xleft', center: 'xcenter', end: 'xright', between: 'xbetween', around: 'xaround', evenly: 'xevenly' };
	export const ROW_ALIGN: Record<Align, string> = { start: 'ytop', center: 'ycenter', end: 'ybot', stretch: '' };
	export const BOX_JUSTIFY: Record<Justify, string> = { start: 'ytop', center: 'ycenter', end: 'ybot', between: 'ybetween', around: 'yaround', evenly: 'yevenly' };
	export const BOX_ALIGN: Record<Align, string> = { start: 'xleft', center: 'xcenter', end: 'xright', stretch: '' };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		gap?: Space;
		align?: Align;
		justify?: Justify;
		wrap?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		gap = 'md',
		align = 'stretch',
		justify = 'start',
		wrap = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class={[
		'box',
		BOX_JUSTIFY[justify],
		BOX_ALIGN[align],
		`gap-${gap}`,
		wrap && 'wrap',
		className
	]}
	{...restProps}
>
	{@render children?.()}
</div>
