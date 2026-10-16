<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, BtnType } from '../../types';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		type?: BtnType | any;
		loading?: boolean;
		disabled?: boolean | null;
		href?: string;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		shape = 'rounded',
		type = 'button',
		loading = false,
		disabled = false,
		href,
		class: className = '',
		children,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const isAnchor = $derived(Boolean(href));
	const inert = $derived(disabled || loading);
</script>

{#if isAnchor}
	<a
		{href}
		class="f-btn {className}"
		data-variant={variant}
		data-size={size}
		data-shape={shape}
		data-state={loading ? 'loading' : undefined}
		aria-busy={loading || undefined}
		aria-disabled={inert || undefined}
		tabindex={inert ? -1 : undefined}
		{...restProps as HTMLAnchorAttributes}
	>
		{#if loading}
			<span class="f-btn-spinner" aria-hidden="true"></span>
		{:else if leading}
			{@render leading()}
		{/if}
		{#if children}
			{@render children()}
		{/if}
		{#if trailing && !loading}
			{@render trailing()}
		{/if}
	</a>
{:else}
	<button
		{type}
		class="f-btn {className}"
		data-variant={variant}
		data-size={size}
		data-shape={shape}
		data-state={loading ? 'loading' : undefined}
		disabled={inert}
		aria-busy={loading || undefined}
		{...restProps}
	>
		{#if loading}
			<span class="f-btn-spinner" aria-hidden="true"></span>
		{:else if leading}
			{@render leading()}
		{/if}
		{#if children}
			{@render children()}
		{/if}
		{#if trailing && !loading}
			{@render trailing()}
		{/if}
	</button>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--f-space-xs);
			font-family: inherit;
			font-weight: 500;
			line-height: 1;
			white-space: nowrap;
			cursor: pointer;
			user-select: none;
			text-decoration: none;
			border: 1px solid transparent;
			box-sizing: border-box;
			transition: background var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease);
		}

		.f-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
		}

		.f-btn:active:not(:disabled):not([aria-disabled='true']) {
			transform: scale(0.98);
		}

		.f-btn:disabled,
		.f-btn[aria-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		/* Shapes */
		.f-btn[data-shape='rounded'] {
			border-radius: var(--f-radius-md);
		}
		.f-btn[data-shape='pill'] {
			border-radius: var(--f-radius-full);
		}
		.f-btn[data-shape='square'] {
			border-radius: 0;
		}

		/* Sizes */
		.f-btn[data-size='xs'] {
			padding: var(--f-space-3xs) var(--f-space-xs);
			font-size: var(--f-text-xs);
			height: 24px;
		}
		.f-btn[data-size='sm'] {
			padding: var(--f-space-2xs) var(--f-space-sm);
			font-size: var(--f-text-sm);
			height: 32px;
		}
		.f-btn[data-size='md'] {
			padding: var(--f-space-xs) var(--f-space-md);
			font-size: var(--f-text-base);
			height: 40px;
		}
		.f-btn[data-size='lg'] {
			padding: var(--f-space-sm) var(--f-space-lg);
			font-size: var(--f-text-lg);
			height: 48px;
		}
		.f-btn[data-size='xl'] {
			padding: var(--f-space-md) var(--f-space-xl);
			font-size: var(--f-text-xl);
			height: 56px;
		}

		/* Variants */
		.f-btn[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			border-color: var(--f-primary);
		}
		.f-btn[data-variant='primary']:hover:not(:disabled) {
			background: var(--f-primary-hover);
			border-color: var(--f-primary-hover);
		}

		.f-btn[data-variant='secondary'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
			box-shadow: var(--f-shadow-xs);
		}
		.f-btn[data-variant='secondary']:hover:not(:disabled) {
			background: var(--f-hover);
			border-color: var(--f-border-strong);
		}

		.f-btn[data-variant='soft'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			border-color: transparent;
		}
		.f-btn[data-variant='soft']:hover:not(:disabled) {
			background: var(--f-primary-subtle);
			filter: brightness(0.95);
		}

		.f-btn[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}
		.f-btn[data-variant='outline']:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-primary);
			border-color: var(--f-primary);
		}

		.f-btn[data-variant='ghost'] {
			background: transparent;
			color: var(--f-text-muted);
			border-color: transparent;
		}
		.f-btn[data-variant='ghost']:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-btn[data-variant='destructive'] {
			background: var(--f-danger);
			color: #ffffff;
			border-color: var(--f-danger);
		}
		.f-btn[data-variant='destructive']:hover:not(:disabled) {
			filter: brightness(0.9);
		}

		.f-btn[data-variant='surface'] {
			background: var(--f-raised);
			color: var(--f-text);
			border-color: var(--f-border-subtle);
		}
		.f-btn[data-variant='surface']:hover:not(:disabled) {
			background: var(--f-hover);
		}

		/* Spinner */
		.f-btn-spinner {
			width: 14px;
			height: 14px;
			border: 2px solid currentColor;
			border-top-color: transparent;
			border-radius: 50%;
			animation: f-btn-spin 0.6s linear infinite;
		}

		@keyframes f-btn-spin {
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
