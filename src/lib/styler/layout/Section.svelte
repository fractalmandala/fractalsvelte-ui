<!-- @component A page section with eyebrow, title, subtitle and optional container. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space, Surface } from '../types';
	import { MEASURE, type ContainerSize } from './Container.svelte';

	export type SectionAlign = 'left' | 'center';

	interface Props extends HTMLAttributes<HTMLElement> {
		title?: string;
		subtitle?: string;
		/** Small uppercase kicker above the title */
		eyebrow?: string;
		/** Constrain the inner content to a page measure */
		contained?: boolean;
		containerSize?: ContainerSize;
		/** Vertical padding step */
		spacing?: Space;
		align?: SectionAlign;
		surface?: Surface;
		class?: string;
		action?: Snippet;
		header?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		subtitle,
		eyebrow,
		contained = false,
		containerSize = 'wide',
		spacing = 'xl',
		align = 'left',
		surface,
		class: className = '',
		action,
		header,
		children,
		...restProps
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || subtitle || eyebrow || action));
	const centered = $derived(align === 'center');
</script>

<section class="py-{spacing} {surface ?? ''} {className}" {...restProps}>
	<div class="box gap-lg {contained ? MEASURE[containerSize] : ''}">
		{#if hasHeader}
			{#if header}
				{@render header()}
			{:else}
				<div class={centered ? 'box xcenter gap-md' : 'row ybot xbetween wrap gap-md'}>
					<div class={centered ? 'box xcenter gap-sm' : 'box gap-sm'}>
						{#if eyebrow}<span class="text-sm weight-600 tt-u ls-wide-xl text-theme">{eyebrow}</span>{/if}
						{#if title}<h2 class="page-heading-xl">{title}</h2>{/if}
						{#if subtitle}<p class="page-desc text-secondary">{subtitle}</p>{/if}
					</div>
					{#if action}<div class="row ycenter gap-xs shrink-0">{@render action()}</div>{/if}
				</div>
			{/if}
		{/if}
		{#if children}<div class="box gap-md">{@render children()}</div>{/if}
	</div>
</section>
