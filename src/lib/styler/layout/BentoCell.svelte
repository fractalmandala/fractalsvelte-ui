<!-- @component A cell for BentoGrid that can span several columns, with title, header and footer. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Pad, Shadow } from '../types';

	type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

	export type BentoCellVariant = Surface;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** .cspan-N. fractalstyler has no row spans. */
		colSpan?: Span;
		size?: Size;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		padding?: Pad;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		title?: string;
		description?: string;
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		colSpan = 1,
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-none',
		padding = 'pad-lg',
		shape = 'curved',
		title,
		description,
		class: className = '',
		header,
		footer,
		children,
		...restProps
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || description));
</script>

<div
	class="card card-sized box gap-md cspan-{colSpan} el-shape {size} {shape} {padding} {surface} {border} {shadow} {className}"
	{...restProps}
>
	{#if hasHeader}
		{#if header}
			{@render header()}
		{:else}
			<div class="box gap-xs">
				{#if title}<h4 class="card-title">{title}</h4>{/if}
				{#if description}<p class="card-desc text-secondary">{description}</p>{/if}
			</div>
		{/if}
	{/if}
	{#if children}<div class="box gap-sm grow">{@render children()}</div>{/if}
	{#if footer}<footer class="row ycenter gap-sm pt-sm bt-sub">{@render footer()}</footer>{/if}
</div>
