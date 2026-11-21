<!-- @component A dense, staggered bento grid whose items can span columns and rows, and collapse to one column on small screens. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import { type Gap } from '../../../internal/tokens.js';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { stagger, vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: number;
		gap?: Gap;
		rowHeight?: string;
		children?: Snippet;
	}

	let {
		columns = 4,
		gap = 'gap-md',
		rowHeight = '8rem',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={['bento', className]}
	{@attach vars({ cols: columns, 'row-h': rowHeight })}
	{@attach stagger()}
	{...rest}
>
	{@render children?.()}
</div>
