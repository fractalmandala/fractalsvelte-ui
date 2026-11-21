<!-- @component Responsive CSS Grid with fixed columns or minimum column width auto-fit. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { type Gap } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: number;
		minChildWidth?: string;
		gap?: Gap;
		children?: Snippet;
	}

	let {
		columns = 3,
		minChildWidth,
		gap = 'gap-md',
		class: className,
		children,
		...rest
	}: Props = $props();

	const autoFit = $derived(Boolean(minChildWidth));
</script>

<div
	class={['simple-grid', autoFit && 'auto-fit', className]}
	{@attach vars({
		cols: autoFit ? undefined : columns,
		'min-col': minChildWidth,
	})}
	{...rest}
>
	{@render children?.()}
</div>
