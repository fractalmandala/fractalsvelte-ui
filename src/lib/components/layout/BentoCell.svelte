<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Space } from '../../types';

	export type BentoCellVariant = 'surface' | 'sunken' | 'raised' | 'outline';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Number of grid columns to span */
		colSpan?: number | string;
		/** Number of grid rows to span */
		rowSpan?: number | string;
		/** Enables an animated gradient border glow effect */
		glow?: boolean;
		/** Internal padding token */
		padding?: Space;
		/** Corner radius scale tier */
		radius?: 'sm' | 'md' | 'lg' | 'xl';
		/** Surface styling variant */
		variant?: BentoCellVariant;
		/** Optional cell title */
		title?: string;
		/** Optional cell subtitle description */
		description?: string;
		/** Additional CSS classes */
		class?: string;
		/** Custom cell header snippet */
		header?: Snippet;
		/** Cell footer slot */
		footer?: Snippet;
		/** Primary content body */
		children?: Snippet;
	}

	let {
		colSpan = 1,
		rowSpan = 1,
		glow = false,
		padding = 'lg',
		radius = 'lg',
		variant = 'surface',
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
	class="f-bento-cell {className}"
	data-glow={glow ? 'true' : 'false'}
	data-variant={variant}
	data-padding={padding}
	data-radius={radius}
	style:grid-column="span {colSpan}"
	style:grid-row="span {rowSpan}"
	{...restProps}
>
	<div class="f-bento-cell-inner">
		{#if hasHeader}
			<div class="f-bento-header">
				{#if header}
					{@render header()}
				{:else}
					{#if title}
						<h4 class="f-bento-title">{title}</h4>
					{/if}
					{#if description}
						<p class="f-bento-desc">{description}</p>
					{/if}
				{/if}
			</div>
		{/if}

		{#if children}
			<div class="f-bento-body">
				{@render children()}
			</div>
		{/if}

		{#if footer}
			<div class="f-bento-footer">
				{@render footer()}
			</div>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-bento-cell {
			position: relative;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			border: 1px solid var(--f-border);
			background: var(--f-surface);
			color: var(--f-text);
			overflow: hidden;
			transition: transform var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease);
		}

		/* Variants */
		.f-bento-cell[data-variant='surface'] {
			background: var(--f-surface);
			border-color: var(--f-border);
		}
		.f-bento-cell[data-variant='sunken'] {
			background: var(--f-sunken);
			border-color: var(--f-border-subtle);
		}
		.f-bento-cell[data-variant='raised'] {
			background: var(--f-raised);
			border-color: var(--f-border);
		}
		.f-bento-cell[data-variant='outline'] {
			background: transparent;
			border-color: var(--f-border-strong);
		}

		/* Radii */
		.f-bento-cell[data-radius='sm'] {
			border-radius: var(--f-radius-sm);
		}
		.f-bento-cell[data-radius='md'] {
			border-radius: var(--f-radius-md);
		}
		.f-bento-cell[data-radius='lg'] {
			border-radius: var(--f-radius-lg);
		}
		.f-bento-cell[data-radius='xl'] {
			border-radius: var(--f-radius-xl);
		}

		/* Inner container */
		.f-bento-cell-inner {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}

		/* Padding tokens */
		.f-bento-cell[data-padding='none'] .f-bento-cell-inner {
			padding: 0;
		}
		.f-bento-cell[data-padding='3xs'] .f-bento-cell-inner {
			padding: var(--f-space-3xs);
		}
		.f-bento-cell[data-padding='2xs'] .f-bento-cell-inner {
			padding: var(--f-space-2xs);
		}
		.f-bento-cell[data-padding='xs'] .f-bento-cell-inner {
			padding: var(--f-space-xs);
		}
		.f-bento-cell[data-padding='sm'] .f-bento-cell-inner {
			padding: var(--f-space-sm);
		}
		.f-bento-cell[data-padding='md'] .f-bento-cell-inner {
			padding: var(--f-space-md);
		}
		.f-bento-cell[data-padding='lg'] .f-bento-cell-inner {
			padding: var(--f-space-lg);
		}
		.f-bento-cell[data-padding='xl'] .f-bento-cell-inner {
			padding: var(--f-space-xl);
		}
		.f-bento-cell[data-padding='2xl'] .f-bento-cell-inner {
			padding: var(--f-space-2xl);
		}

		/* Glow border styling */
		.f-bento-cell[data-glow='true'] {
			border-color: rgba(16, 185, 129, 0.4);
			box-shadow: var(--f-shadow-glow);
		}

		.f-bento-cell[data-glow='true']::before {
			content: '';
			position: absolute;
			inset: -1px;
			background: linear-gradient(
				135deg,
				rgba(16, 185, 129, 0.5) 0%,
				rgba(245, 158, 11, 0.3) 50%,
				rgba(16, 185, 129, 0.1) 100%
			);
			border-radius: inherit;
			z-index: 0;
			opacity: 0.7;
			pointer-events: none;
			mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			mask-composite: exclude;
			-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			padding: 1.5px;
		}

		/* Content sections */
		.f-bento-header {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-3xs);
			margin-bottom: var(--f-space-sm);
		}

		.f-bento-title {
			margin: 0;
			font-size: var(--f-text-base);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.35;
		}

		.f-bento-desc {
			margin: 0;
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			line-height: 1.45;
		}

		.f-bento-body {
			flex: 1;
			min-height: 0;
			font-size: var(--f-text-sm);
			line-height: 1.5;
		}

		.f-bento-footer {
			margin-top: var(--f-space-sm);
			padding-top: var(--f-space-xs);
			border-top: 1px solid var(--f-border-subtle);
		}

		@media (max-width: 768px) {
			.f-bento-cell {
				grid-column: span 1 !important;
			}
		}
	}
</style>
