<!-- @component A content card with optional media, title, description, header and footer. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Pad, Shadow } from '../types';

	export type CardVariant = Surface;
	export type CardElevation = Shadow;

	interface Props extends HTMLAttributes<HTMLDivElement> {
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
		media?: Snippet;
		header?: Snippet;
		headerExtra?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shadow = 'shad-none',
		padding = 'pad-lg',
		shape = 'curved',
		title,
		description,
		class: className = '',
		media,
		header,
		headerExtra,
		footer,
		children,
		...restProps
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || description || headerExtra));
</script>

<!-- .card pushes a <footer> child to the bottom on its own (margin-top: auto). -->
<div
	class="card card-sized box gap-md el-shape {size} {shape} {padding} {surface} {border} {shadow} {className}"
	{...restProps}
>
	{#if media}<div class="box radius-sm scroll-x">{@render media()}</div>{/if}
	{#if hasHeader}
		{#if header}
			{@render header()}
		{:else}
			<div class="row ytop xbetween gap-sm">
				<div class="box gap-xs min0">
					{#if title}<h3 class="card-title">{title}</h3>{/if}
					{#if description}<p class="card-desc text-secondary">{description}</p>{/if}
				</div>
				{#if headerExtra}<div class="row ycenter gap-xs shrink-0">{@render headerExtra()}</div>{/if}
			</div>
		{/if}
	{/if}
	{#if children}<div class="box gap-sm">{@render children()}</div>{/if}
	{#if footer}<footer class="row ycenter gap-sm pt-sm bt-sub">{@render footer()}</footer>{/if}
</div>
