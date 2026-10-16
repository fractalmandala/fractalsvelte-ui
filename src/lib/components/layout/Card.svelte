<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../../types';

	export type CardVariant = 'surface' | 'outline' | 'sunken' | 'raised' | 'ghost';
	export type CardElevation = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Visual surface style variant */
		variant?: CardVariant;
		/** Shadow elevation depth */
		elevation?: CardElevation;
		/** Inner content padding token */
		padding?: Space;
		/** Corner radius scale token */
		radius?: CardRadius;
		/** Optional card title rendered in header */
		title?: string;
		/** Optional card description subtitle */
		description?: string;
		/** Additional CSS classes */
		class?: string;
		/** Top media or image banner slot */
		media?: Snippet;
		/** Custom full header slot */
		header?: Snippet;
		/** Auxiliary element placed on the right side of header */
		headerExtra?: Snippet;
		/** Card footer action or metadata slot */
		footer?: Snippet;
		/** Primary content body slot */
		children?: Snippet;
	}

	let {
		variant = 'surface',
		elevation = 'sm',
		padding = 'lg',
		radius = 'lg',
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

<div
	class="f-card {className}"
	data-variant={variant}
	data-elevation={elevation}
	data-padding={padding}
	data-radius={radius}
	{...restProps}
>
	{#if media}
		<div class="f-card-media">
			{@render media()}
		</div>
	{/if}

	{#if hasHeader}
		<div class="f-card-header">
			{#if header}
				{@render header()}
			{:else}
				<div class="f-card-header-content">
					{#if title}
						<h3 class="f-card-title">{title}</h3>
					{/if}
					{#if description}
						<p class="f-card-desc">{description}</p>
					{/if}
				</div>
				{#if headerExtra}
					<div class="f-card-header-extra">
						{@render headerExtra()}
					</div>
				{/if}
			{/if}
		</div>
	{/if}

	{#if children}
		<div class="f-card-body">
			{@render children()}
		</div>
	{/if}

	{#if footer}
		<div class="f-card-footer">
			{@render footer()}
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-card {
			position: relative;
			display: flex;
			flex-direction: column;
			background: var(--f-surface);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			box-sizing: border-box;
			overflow: hidden;
			transition: border-color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		/* Variants */
		.f-card[data-variant='surface'] {
			background: var(--f-surface);
			border-color: var(--f-border);
		}
		.f-card[data-variant='outline'] {
			background: transparent;
			border-color: var(--f-border-strong);
		}
		.f-card[data-variant='sunken'] {
			background: var(--f-sunken);
			border-color: var(--f-border-subtle);
		}
		.f-card[data-variant='raised'] {
			background: var(--f-raised);
			border-color: var(--f-border);
		}
		.f-card[data-variant='ghost'] {
			background: transparent;
			border-color: transparent;
		}

		/* Elevations */
		.f-card[data-elevation='none'] {
			box-shadow: none;
		}
		.f-card[data-elevation='xs'] {
			box-shadow: var(--f-shadow-xs);
		}
		.f-card[data-elevation='sm'] {
			box-shadow: var(--f-shadow-sm);
		}
		.f-card[data-elevation='md'] {
			box-shadow: var(--f-shadow-md);
		}
		.f-card[data-elevation='lg'] {
			box-shadow: var(--f-shadow-lg);
		}
		.f-card[data-elevation='xl'] {
			box-shadow: var(--f-shadow-xl);
		}

		/* Radii */
		.f-card[data-radius='none'] {
			border-radius: 0;
		}
		.f-card[data-radius='sm'] {
			border-radius: var(--f-radius-sm);
		}
		.f-card[data-radius='md'] {
			border-radius: var(--f-radius-md);
		}
		.f-card[data-radius='lg'] {
			border-radius: var(--f-radius-lg);
		}
		.f-card[data-radius='xl'] {
			border-radius: var(--f-radius-xl);
		}

		/* Padding scale applied to header, body, footer */
		.f-card[data-padding='none'] .f-card-header,
		.f-card[data-padding='none'] .f-card-body,
		.f-card[data-padding='none'] .f-card-footer {
			padding: 0;
		}
		.f-card[data-padding='3xs'] .f-card-header,
		.f-card[data-padding='3xs'] .f-card-body,
		.f-card[data-padding='3xs'] .f-card-footer {
			padding: var(--f-space-3xs);
		}
		.f-card[data-padding='2xs'] .f-card-header,
		.f-card[data-padding='2xs'] .f-card-body,
		.f-card[data-padding='2xs'] .f-card-footer {
			padding: var(--f-space-2xs);
		}
		.f-card[data-padding='xs'] .f-card-header,
		.f-card[data-padding='xs'] .f-card-body,
		.f-card[data-padding='xs'] .f-card-footer {
			padding: var(--f-space-xs);
		}
		.f-card[data-padding='sm'] .f-card-header,
		.f-card[data-padding='sm'] .f-card-body,
		.f-card[data-padding='sm'] .f-card-footer {
			padding: var(--f-space-sm);
		}
		.f-card[data-padding='md'] .f-card-header,
		.f-card[data-padding='md'] .f-card-body,
		.f-card[data-padding='md'] .f-card-footer {
			padding: var(--f-space-md);
		}
		.f-card[data-padding='lg'] .f-card-header,
		.f-card[data-padding='lg'] .f-card-body,
		.f-card[data-padding='lg'] .f-card-footer {
			padding: var(--f-space-lg);
		}
		.f-card[data-padding='xl'] .f-card-header,
		.f-card[data-padding='xl'] .f-card-body,
		.f-card[data-padding='xl'] .f-card-footer {
			padding: var(--f-space-xl);
		}
		.f-card[data-padding='2xl'] .f-card-header,
		.f-card[data-padding='2xl'] .f-card-body,
		.f-card[data-padding='2xl'] .f-card-footer {
			padding: var(--f-space-2xl);
		}

		/* Card sections */
		.f-card-media {
			width: 100%;
			overflow: hidden;
			line-height: 0;
		}

		.f-card-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: var(--f-space-md);
			border-bottom: 1px solid var(--f-border-subtle);
		}

		.f-card-header-content {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
			flex: 1;
			min-width: 0;
		}

		.f-card-title {
			margin: 0;
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.3;
		}

		.f-card-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.45;
		}

		.f-card-header-extra {
			display: inline-flex;
			align-items: center;
			flex-shrink: 0;
		}

		.f-card-body {
			flex: 1;
			font-size: var(--f-text-base);
			color: var(--f-text);
			line-height: 1.5;
		}

		.f-card-footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: var(--f-space-sm);
			border-top: 1px solid var(--f-border-subtle);
			background: var(--f-sunken);
		}
	}
</style>
