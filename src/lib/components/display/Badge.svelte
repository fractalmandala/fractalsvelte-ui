<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type BadgeVariant =
		| 'primary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'info'
		| 'surface'
		| 'outline';

	export type BadgeSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: BadgeVariant;
		size?: BadgeSize;
		dot?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		dot = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<span
	class="f-badge {className}"
	data-variant={variant}
	data-size={size}
	{...restProps}
>
	{#if dot}
		<span class="f-badge-dot" aria-hidden="true"></span>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</span>

<style>
	@layer fractalsvelte-ui.components {
		.f-badge {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-family: inherit;
			font-weight: 500;
			line-height: 1;
			white-space: nowrap;
			user-select: none;
			border-radius: var(--f-radius-full);
			border: 1px solid transparent;
			box-sizing: border-box;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease);
		}

		/* Sizes */
		.f-badge[data-size='sm'] {
			font-size: 0.6875rem;
			padding: 2px 6px;
			gap: 4px;
		}

		.f-badge[data-size='md'] {
			font-size: var(--f-text-xs);
			padding: 3px 8px;
			gap: 5px;
		}

		.f-badge[data-size='lg'] {
			font-size: var(--f-text-sm);
			padding: 4px 10px;
			gap: 6px;
		}

		/* Dot */
		.f-badge-dot {
			display: inline-block;
			border-radius: var(--f-radius-full);
			background-color: currentColor;
			flex-shrink: 0;
		}

		.f-badge[data-size='sm'] .f-badge-dot {
			width: 5px;
			height: 5px;
		}

		.f-badge[data-size='md'] .f-badge-dot {
			width: 6px;
			height: 6px;
		}

		.f-badge[data-size='lg'] .f-badge-dot {
			width: 7px;
			height: 7px;
		}

		/* Variants */
		.f-badge[data-variant='primary'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border-color: rgba(16, 185, 129, 0.2);
		}

		.f-badge[data-variant='success'] {
			background: var(--f-success-bg);
			color: var(--f-success-text);
			border-color: rgba(16, 185, 129, 0.25);
		}

		.f-badge[data-variant='warning'] {
			background: var(--f-warning-bg);
			color: var(--f-warning-text);
			border-color: rgba(245, 158, 11, 0.25);
		}

		.f-badge[data-variant='danger'] {
			background: var(--f-danger-bg);
			color: var(--f-danger-text);
			border-color: rgba(239, 68, 68, 0.25);
		}

		.f-badge[data-variant='info'] {
			background: var(--f-info-bg);
			color: var(--f-info-text);
			border-color: rgba(59, 130, 246, 0.25);
		}

		.f-badge[data-variant='surface'] {
			background: var(--f-sunken);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-badge[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}
	}
</style>
