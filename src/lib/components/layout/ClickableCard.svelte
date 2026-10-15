<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Space } from '../../types';
	import type { CardElevation } from './Card.svelte';

	interface Props extends HTMLButtonAttributes {
		/** Target URL turning the card into an anchor link */
		href?: string;
		/** Anchor target (e.g. '_blank') */
		target?: string;
		/** Anchor rel attribute */
		rel?: string;
		/** Whether interactive state is disabled */
		disabled?: boolean;
		/** Resting elevation shadow tier */
		elevation?: CardElevation;
		/** Hover elevation depth */
		hoverElevation?: CardElevation;
		/** Whether to animate an upward lift on hover */
		lift?: boolean;
		/** Inner content padding token */
		padding?: Space;
		/** Corner radius scale token */
		radius?: 'sm' | 'md' | 'lg' | 'xl';
		/** Primary card title */
		title?: string;
		/** Secondary explanatory description */
		description?: string;
		/** Additional CSS classes */
		class?: string;
		/** Optional click event handler */
		onclick?: (event: MouseEvent) => void;
		/** Top media or image slot */
		media?: Snippet;
		/** Custom full header slot */
		header?: Snippet;
		/** Auxiliary header element on the right */
		headerExtra?: Snippet;
		/** Bottom footer slot */
		footer?: Snippet;
		/** Content body slot */
		children?: Snippet;
	}

	let {
		href,
		target,
		rel,
		disabled = false,
		elevation = 'sm',
		hoverElevation = 'md',
		lift = true,
		padding = 'lg',
		radius = 'lg',
		title,
		description,
		class: className = '',
		onclick,
		media,
		header,
		headerExtra,
		footer,
		children,
		...restProps
	}: Props = $props();

	const isAnchor = $derived(Boolean(href));
	const hasHeader = $derived(Boolean(header || title || description || headerExtra));
</script>

{#if isAnchor}
	<a
		{href}
		{target}
		rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
		class="f-clickable-card {className}"
		data-elevation={elevation}
		data-hover-elevation={hoverElevation}
		data-lift={lift ? 'true' : 'false'}
		data-padding={padding}
		data-radius={radius}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps as HTMLAnchorAttributes}
	>
		{#if media}
			<div class="f-clickable-media">
				{@render media()}
			</div>
		{/if}

		{#if hasHeader}
			<div class="f-clickable-header">
				{#if header}
					{@render header()}
				{:else}
					<div class="f-clickable-header-content">
						{#if title}
							<div class="f-clickable-title">{title}</div>
						{/if}
						{#if description}
							<div class="f-clickable-desc">{description}</div>
						{/if}
					</div>
					{#if headerExtra}
						<div class="f-clickable-header-extra">
							{@render headerExtra()}
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		{#if children}
			<div class="f-clickable-body">
				{@render children()}
			</div>
		{/if}

		{#if footer}
			<div class="f-clickable-footer">
				{@render footer()}
			</div>
		{/if}
	</a>
{:else}
	<button
		type="button"
		class="f-clickable-card {className}"
		data-elevation={elevation}
		data-hover-elevation={hoverElevation}
		data-lift={lift ? 'true' : 'false'}
		data-padding={padding}
		data-radius={radius}
		{disabled}
		{onclick}
		{...restProps}
	>
		{#if media}
			<div class="f-clickable-media">
				{@render media()}
			</div>
		{/if}

		{#if hasHeader}
			<div class="f-clickable-header">
				{#if header}
					{@render header()}
				{:else}
					<div class="f-clickable-header-content">
						{#if title}
							<div class="f-clickable-title">{title}</div>
						{/if}
						{#if description}
							<div class="f-clickable-desc">{description}</div>
						{/if}
					</div>
					{#if headerExtra}
						<div class="f-clickable-header-extra">
							{@render headerExtra()}
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		{#if children}
			<div class="f-clickable-body">
				{@render children()}
			</div>
		{/if}

		{#if footer}
			<div class="f-clickable-footer">
				{@render footer()}
			</div>
		{/if}
	</button>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-clickable-card {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 100%;
			border: 1px solid var(--f-border);
			background: var(--f-surface);
			color: var(--f-text);
			text-align: left;
			text-decoration: none;
			font-family: inherit;
			cursor: pointer;
			user-select: none;
			overflow: hidden;
			box-sizing: border-box;
			transition: transform var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				background var(--f-duration-fast) var(--f-ease);
		}

		.f-clickable-card:hover:not(:disabled):not([aria-disabled='true']) {
			border-color: var(--f-border-strong);
			background: var(--f-hover);
		}

		.f-clickable-card[data-lift='true']:hover:not(:disabled):not([aria-disabled='true']) {
			transform: translateY(-2px);
		}

		.f-clickable-card:active:not(:disabled):not([aria-disabled='true']) {
			transform: scale(0.99);
		}

		.f-clickable-card:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-clickable-card:disabled,
		.f-clickable-card[aria-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		/* Resting Elevations */
		.f-clickable-card[data-elevation='none'] {
			box-shadow: none;
		}
		.f-clickable-card[data-elevation='xs'] {
			box-shadow: var(--f-shadow-xs);
		}
		.f-clickable-card[data-elevation='sm'] {
			box-shadow: var(--f-shadow-sm);
		}
		.f-clickable-card[data-elevation='md'] {
			box-shadow: var(--f-shadow-md);
		}
		.f-clickable-card[data-elevation='lg'] {
			box-shadow: var(--f-shadow-lg);
		}
		.f-clickable-card[data-elevation='xl'] {
			box-shadow: var(--f-shadow-xl);
		}

		/* Hover Elevations */
		.f-clickable-card[data-hover-elevation='none']:hover:not(:disabled) {
			box-shadow: none;
		}
		.f-clickable-card[data-hover-elevation='xs']:hover:not(:disabled) {
			box-shadow: var(--f-shadow-xs);
		}
		.f-clickable-card[data-hover-elevation='sm']:hover:not(:disabled) {
			box-shadow: var(--f-shadow-sm);
		}
		.f-clickable-card[data-hover-elevation='md']:hover:not(:disabled) {
			box-shadow: var(--f-shadow-md);
		}
		.f-clickable-card[data-hover-elevation='lg']:hover:not(:disabled) {
			box-shadow: var(--f-shadow-lg);
		}
		.f-clickable-card[data-hover-elevation='xl']:hover:not(:disabled) {
			box-shadow: var(--f-shadow-xl);
		}

		/* Radii */
		.f-clickable-card[data-radius='sm'] {
			border-radius: var(--f-radius-sm);
		}
		.f-clickable-card[data-radius='md'] {
			border-radius: var(--f-radius-md);
		}
		.f-clickable-card[data-radius='lg'] {
			border-radius: var(--f-radius-lg);
		}
		.f-clickable-card[data-radius='xl'] {
			border-radius: var(--f-radius-xl);
		}

		/* Padding */
		.f-clickable-card[data-padding='none'] .f-clickable-header,
		.f-clickable-card[data-padding='none'] .f-clickable-body,
		.f-clickable-card[data-padding='none'] .f-clickable-footer {
			padding: 0;
		}
		.f-clickable-card[data-padding='3xs'] .f-clickable-header,
		.f-clickable-card[data-padding='3xs'] .f-clickable-body,
		.f-clickable-card[data-padding='3xs'] .f-clickable-footer {
			padding: var(--f-space-3xs);
		}
		.f-clickable-card[data-padding='2xs'] .f-clickable-header,
		.f-clickable-card[data-padding='2xs'] .f-clickable-body,
		.f-clickable-card[data-padding='2xs'] .f-clickable-footer {
			padding: var(--f-space-2xs);
		}
		.f-clickable-card[data-padding='xs'] .f-clickable-header,
		.f-clickable-card[data-padding='xs'] .f-clickable-body,
		.f-clickable-card[data-padding='xs'] .f-clickable-footer {
			padding: var(--f-space-xs);
		}
		.f-clickable-card[data-padding='sm'] .f-clickable-header,
		.f-clickable-card[data-padding='sm'] .f-clickable-body,
		.f-clickable-card[data-padding='sm'] .f-clickable-footer {
			padding: var(--f-space-sm);
		}
		.f-clickable-card[data-padding='md'] .f-clickable-header,
		.f-clickable-card[data-padding='md'] .f-clickable-body,
		.f-clickable-card[data-padding='md'] .f-clickable-footer {
			padding: var(--f-space-md);
		}
		.f-clickable-card[data-padding='lg'] .f-clickable-header,
		.f-clickable-card[data-padding='lg'] .f-clickable-body,
		.f-clickable-card[data-padding='lg'] .f-clickable-footer {
			padding: var(--f-space-lg);
		}
		.f-clickable-card[data-padding='xl'] .f-clickable-header,
		.f-clickable-card[data-padding='xl'] .f-clickable-body,
		.f-clickable-card[data-padding='xl'] .f-clickable-footer {
			padding: var(--f-space-xl);
		}
		.f-clickable-card[data-padding='2xl'] .f-clickable-header,
		.f-clickable-card[data-padding='2xl'] .f-clickable-body,
		.f-clickable-card[data-padding='2xl'] .f-clickable-footer {
			padding: var(--f-space-2xl);
		}

		.f-clickable-media {
			width: 100%;
			overflow: hidden;
			line-height: 0;
		}

		.f-clickable-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: var(--f-space-md);
		}

		.f-clickable-header-content {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
			flex: 1;
			min-width: 0;
		}

		.f-clickable-title {
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.3;
		}

		.f-clickable-desc {
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.45;
		}

		.f-clickable-header-extra {
			display: inline-flex;
			align-items: center;
			flex-shrink: 0;
		}

		.f-clickable-body {
			flex: 1;
			font-size: var(--f-text-base);
			color: var(--f-text);
			line-height: 1.5;
		}

		.f-clickable-footer {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: var(--f-space-sm);
			border-top: 1px solid var(--f-border-subtle);
			background: var(--f-sunken);
		}
	}
</style>
