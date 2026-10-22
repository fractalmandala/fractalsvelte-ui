<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, Action } from '../../types';

	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		type?: Action | any;
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
		shape = 'modern',
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
			gap: var(--f-space-xs, var(--space-xs));
			font-family: inherit;
			font-weight: 500;
			line-height: 1;
			white-space: nowrap;
			cursor: pointer;
			user-select: none;
			text-decoration: none;
			border: 1px solid transparent;
			box-sizing: border-box;
			transition: background var(--f-duration-fast, 150ms) var(--f-ease, ease),
				border-color var(--f-duration-fast, 150ms) var(--f-ease, ease),
				color var(--f-duration-fast, 150ms) var(--f-ease, ease),
				box-shadow var(--f-duration-fast, 150ms) var(--f-ease, ease),
				transform var(--f-duration-fast, 150ms) var(--f-ease, ease);
		}

		.f-btn:focus-visible {
			outline: 2px solid var(--f-ring, var(--ring));
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
		.f-btn[data-shape='round'],
		.f-btn[data-shape='pill'] {
			border-radius: var(--f-radius-full, var(--radius-full));
		}
		.f-btn[data-shape='curved'] {
			border-radius: var(--f-radius-md, var(--radius-md));
		}
		.f-btn[data-shape='modern'] {
			border-radius: var(--f-radius-sm, var(--radius-sm));
		}
		.f-btn[data-shape='square'] {
			border-radius: 0;
		}

		/* Sizes */
		.f-btn[data-size='xs'] {
			padding-inline: var(--f-space-xs, 0.375rem);
			font-size: var(--f-text-xs, 0.75rem);
			height: 24px;
		}
		.f-btn[data-size='sm'] {
			padding-inline: var(--f-space-sm, 0.5rem);
			font-size: var(--f-text-sm, 0.84375rem);
			height: 28px;
		}
		.f-btn[data-size='md'] {
			padding-inline: var(--f-space-md, 0.75rem);
			font-size: var(--f-text-base, 0.9375rem);
			height: 34px;
		}
		.f-btn[data-size='bs'] {
			padding-inline: var(--f-space-lg, 1rem);
			font-size: var(--f-text-base, 0.9375rem);
			height: 36px;
		}
		.f-btn[data-size='lg'] {
			padding-inline: var(--f-space-lg, 1rem);
			font-size: var(--f-text-base, 0.9375rem);
			height: 40px;
		}
		.f-btn[data-size='xl'] {
			padding-inline: var(--f-space-xl, 1.5rem);
			font-size: var(--f-text-lg, 1.0625rem);
			height: 48px;
		}

		/* Variants */
		.f-btn[data-variant='primary'] {
			background: var(--f-primary, var(--theme-color));
			color: var(--f-primary-text, #ffffff);
			border-color: var(--f-primary, var(--theme-color));
		}
		.f-btn[data-variant='primary']:hover:not(:disabled) {
			background: var(--f-primary-hover, var(--theme-color-alt));
			border-color: var(--f-primary-hover, var(--theme-color-alt));
		}

		.f-btn[data-variant='secondary'] {
			background: var(--f-surface, var(--bg-surface));
			color: var(--f-text, var(--text-primary));
			border-color: var(--f-border, var(--border));
			box-shadow: var(--f-shadow-xs);
		}
		.f-btn[data-variant='secondary']:hover:not(:disabled) {
			background: var(--f-hover, var(--bg-button));
			border-color: var(--f-border-strong, var(--border-strong));
		}

		.f-btn[data-variant='soft'] {
			background: var(--f-primary-subtle, var(--theme-color-sub));
			color: var(--f-primary, var(--theme-color));
			border-color: transparent;
		}
		.f-btn[data-variant='soft']:hover:not(:disabled) {
			background: var(--f-primary, var(--theme-color));
			color: var(--f-primary-text, #ffffff);
		}

		.f-btn[data-variant='outline'] {
			background: transparent;
			color: var(--f-text, var(--text-primary));
			border-color: var(--f-border, var(--border));
		}
		.f-btn[data-variant='outline']:hover:not(:disabled) {
			background: var(--f-hover, var(--bg-button));
			border-color: var(--f-border-strong, var(--border-strong));
		}

		.f-btn[data-variant='ghost'] {
			background: transparent;
			color: var(--f-text, var(--text-primary));
			border-color: transparent;
		}
		.f-btn[data-variant='ghost']:hover:not(:disabled) {
			background: var(--f-hover, var(--bg-button));
			color: var(--f-primary, var(--theme-color));
		}

		.f-btn[data-variant='destructive'] {
			background: var(--f-danger, var(--danger));
			color: #ffffff;
			border-color: var(--f-danger, var(--danger));
		}
		.f-btn[data-variant='destructive']:hover:not(:disabled) {
			background: var(--f-danger-text, var(--danger-hover));
		}

		.f-btn[data-variant="link"] {
			background: none;
			color: var(--f-primary, var(--theme-color));
			border: none;
			padding: 0;
			height: auto;
		}

		.f-btn[data-variant="link"]:hover:not(:disabled) {
			text-decoration: underline;
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
