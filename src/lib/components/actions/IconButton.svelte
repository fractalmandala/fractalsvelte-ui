<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, BtnType } from '../../types';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		label: string;
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		type?: BtnType | any;
		loading?: boolean;
		disabled?: boolean | null;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		variant = 'secondary',
		size = 'md',
		shape = 'rounded',
		type = 'button',
		loading = false,
		disabled = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const inert = $derived(disabled || loading);
</script>

<button
	{type}
	class="f-icon-btn {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	data-state={loading ? 'loading' : undefined}
	aria-label={label}
	title={label}
	disabled={inert}
	aria-busy={loading || undefined}
	{...restProps}
>
	{#if loading}
		<span class="f-btn-spinner" aria-hidden="true"></span>
	{:else if children}
		{@render children()}
	{/if}
</button>

<style>
	@layer fractalsvelte-ui.components {
		.f-icon-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			cursor: pointer;
			user-select: none;
			border: 1px solid transparent;
			box-sizing: border-box;
			flex-shrink: 0;
			transition: background var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-icon-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-icon-btn:active:not(:disabled) {
			transform: scale(0.95);
		}

		.f-icon-btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		/* Shapes */
		.f-icon-btn[data-shape='rounded'] {
			border-radius: var(--f-radius-md);
		}
		.f-icon-btn[data-shape='pill'] {
			border-radius: var(--f-radius-full);
		}
		.f-icon-btn[data-shape='square'] {
			border-radius: 0;
		}

		/* Sizes */
		.f-icon-btn[data-size='xs'] {
			width: 24px;
			height: 24px;
			font-size: var(--f-text-xs);
		}
		.f-icon-btn[data-size='sm'] {
			width: 32px;
			height: 32px;
			font-size: var(--f-text-sm);
		}
		.f-icon-btn[data-size='md'] {
			width: 40px;
			height: 40px;
			font-size: var(--f-text-base);
		}
		.f-icon-btn[data-size='lg'] {
			width: 48px;
			height: 48px;
			font-size: var(--f-text-lg);
		}
		.f-icon-btn[data-size='xl'] {
			width: 56px;
			height: 56px;
			font-size: var(--f-text-xl);
		}

		/* Variants */
		.f-icon-btn[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			border-color: var(--f-primary);
		}
		.f-icon-btn[data-variant='primary']:hover:not(:disabled) {
			background: var(--f-primary-hover);
		}

		.f-icon-btn[data-variant='secondary'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
			box-shadow: var(--f-shadow-xs);
		}
		.f-icon-btn[data-variant='secondary']:hover:not(:disabled) {
			background: var(--f-hover);
			border-color: var(--f-border-strong);
		}

		.f-icon-btn[data-variant='soft'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
		}
		.f-icon-btn[data-variant='soft']:hover:not(:disabled) {
			filter: brightness(0.95);
		}

		.f-icon-btn[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}
		.f-icon-btn[data-variant='outline']:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-primary);
			border-color: var(--f-primary);
		}

		.f-icon-btn[data-variant='ghost'] {
			background: transparent;
			color: var(--f-text-muted);
		}
		.f-icon-btn[data-variant='ghost']:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-icon-btn[data-variant='destructive'] {
			background: var(--f-danger);
			color: #ffffff;
			border-color: var(--f-danger);
		}

		.f-icon-btn[data-variant='surface'] {
			background: var(--f-raised);
			color: var(--f-text);
			border-color: var(--f-border-subtle);
		}

		.f-btn-spinner {
			width: 14px;
			height: 14px;
			border: 2px solid currentColor;
			border-top-color: transparent;
			border-radius: 50%;
			animation: f-icon-spin 0.6s linear infinite;
		}

		@keyframes f-icon-spin {
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
