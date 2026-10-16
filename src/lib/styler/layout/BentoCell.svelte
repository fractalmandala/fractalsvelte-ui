<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsCardVariant, FsCardShape, FsPad } from '../types';
	import { COL_SPAN, type FsSpan } from '../classes';

	export type BentoCellVariant = FsCardVariant;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** .cspan-N. fractalstyler has no row spans. */
		colSpan?: FsSpan;
		variant?: FsCardVariant;
		padding?: FsPad;
		shape?: FsCardShape;
		title?: string;
		description?: string;
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		colSpan = 1,
		variant = 'primary',
		padding = 'lg',
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
	class="card box gap-md {COL_SPAN[colSpan]} {className}"
	data-variant={variant}
	data-pad={padding}
	data-shape={shape}
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
	{#if footer}<footer class="row ycenter gap-sm">{@render footer()}</footer>{/if}
</div>
