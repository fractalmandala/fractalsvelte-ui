<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsCardVariant, FsCardShape, FsPad, FsShadow } from '../types';
	import { SHADOW } from '../classes';

	export type CardVariant = FsCardVariant;
	export type CardElevation = 'none' | FsShadow;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: FsCardVariant;
		elevation?: CardElevation;
		/** .card[data-pad] */
		padding?: FsPad;
		/** .card[data-shape] */
		shape?: FsCardShape;
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
		variant = 'primary',
		elevation = 'none',
		padding = 'lg',
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
	class="card box gap-md {elevation === 'none' ? '' : SHADOW[elevation]} {className}"
	data-variant={variant}
	data-pad={padding}
	data-shape={shape}
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
	{#if children}<div class="box gap-sm text-body-sm">{@render children()}</div>{/if}
	{#if footer}<footer class="row ycenter gap-sm pt-sm bt-sub">{@render footer()}</footer>{/if}
</div>
