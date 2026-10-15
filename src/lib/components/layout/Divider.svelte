<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation, Space } from '../../types';

	export type DividerVariant = 'solid' | 'dashed' | 'dotted';
	export type DividerLabelPosition = 'start' | 'center' | 'end';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Orientation direction */
		orientation?: Orientation;
		/** Border stroke style */
		variant?: DividerVariant;
		/** Margin spacing token */
		spacing?: Space;
		/** Optional text label */
		label?: string;
		/** Alignment position of the label */
		labelPosition?: DividerLabelPosition;
		/** Additional CSS classes */
		class?: string;
		/** Custom label or badge content */
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		variant = 'solid',
		spacing = 'md',
		label,
		labelPosition = 'center',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const hasContent = $derived(Boolean(label || children));
</script>

<div
	role="separator"
	aria-orientation={orientation}
	class="f-divider {className}"
	data-orientation={orientation}
	data-variant={variant}
	data-spacing={spacing}
	data-has-content={hasContent ? 'true' : 'false'}
	data-label-position={labelPosition}
	{...restProps}
>
	{#if orientation === 'horizontal' && hasContent}
		<span class="f-divider-line" aria-hidden="true"></span>
		<span class="f-divider-label">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
		<span class="f-divider-line" aria-hidden="true"></span>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-divider {
			box-sizing: border-box;
			position: relative;
		}

		/* Horizontal orientation */
		.f-divider[data-orientation='horizontal'] {
			width: 100%;
			display: flex;
			align-items: center;
		}

		.f-divider[data-orientation='horizontal']:not([data-has-content='true']) {
			border-top: 1px solid var(--f-border);
		}

		.f-divider[data-orientation='horizontal'][data-variant='dashed']:not([data-has-content='true']) {
			border-top-style: dashed;
		}
		.f-divider[data-orientation='horizontal'][data-variant='dotted']:not([data-has-content='true']) {
			border-top-style: dotted;
		}

		/* Spacing for Horizontal */
		.f-divider[data-orientation='horizontal'][data-spacing='none'] {
			margin-block: 0;
		}
		.f-divider[data-orientation='horizontal'][data-spacing='3xs'] {
			margin-block: var(--f-space-3xs);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='2xs'] {
			margin-block: var(--f-space-2xs);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='xs'] {
			margin-block: var(--f-space-xs);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='sm'] {
			margin-block: var(--f-space-sm);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='md'] {
			margin-block: var(--f-space-md);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='lg'] {
			margin-block: var(--f-space-lg);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='xl'] {
			margin-block: var(--f-space-xl);
		}
		.f-divider[data-orientation='horizontal'][data-spacing='2xl'] {
			margin-block: var(--f-space-2xl);
		}

		/* Vertical orientation */
		.f-divider[data-orientation='vertical'] {
			display: inline-block;
			align-self: stretch;
			min-height: 1.25em;
			width: 1px;
			border-left: 1px solid var(--f-border);
		}

		.f-divider[data-orientation='vertical'][data-variant='dashed'] {
			border-left-style: dashed;
		}
		.f-divider[data-orientation='vertical'][data-variant='dotted'] {
			border-left-style: dotted;
		}

		/* Spacing for Vertical */
		.f-divider[data-orientation='vertical'][data-spacing='none'] {
			margin-inline: 0;
		}
		.f-divider[data-orientation='vertical'][data-spacing='3xs'] {
			margin-inline: var(--f-space-3xs);
		}
		.f-divider[data-orientation='vertical'][data-spacing='2xs'] {
			margin-inline: var(--f-space-2xs);
		}
		.f-divider[data-orientation='vertical'][data-spacing='xs'] {
			margin-inline: var(--f-space-xs);
		}
		.f-divider[data-orientation='vertical'][data-spacing='sm'] {
			margin-inline: var(--f-space-sm);
		}
		.f-divider[data-orientation='vertical'][data-spacing='md'] {
			margin-inline: var(--f-space-md);
		}
		.f-divider[data-orientation='vertical'][data-spacing='lg'] {
			margin-inline: var(--f-space-lg);
		}
		.f-divider[data-orientation='vertical'][data-spacing='xl'] {
			margin-inline: var(--f-space-xl);
		}
		.f-divider[data-orientation='vertical'][data-spacing='2xl'] {
			margin-inline: var(--f-space-2xl);
		}

		/* Label Lines */
		.f-divider-line {
			flex: 1;
			border-top: 1px solid var(--f-border);
		}

		.f-divider[data-variant='dashed'] .f-divider-line {
			border-top-style: dashed;
		}
		.f-divider[data-variant='dotted'] .f-divider-line {
			border-top-style: dotted;
		}

		.f-divider-label {
			display: inline-flex;
			align-items: center;
			padding-inline: var(--f-space-md);
			font-size: var(--f-text-xs);
			font-weight: 500;
			color: var(--f-text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
			white-space: nowrap;
		}

		.f-divider[data-label-position='start'] .f-divider-line:first-child {
			flex: 0 0 var(--f-space-xl);
		}
		.f-divider[data-label-position='end'] .f-divider-line:last-child {
			flex: 0 0 var(--f-space-xl);
		}
	}
</style>
