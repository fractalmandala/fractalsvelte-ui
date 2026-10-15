<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape } from '../../types';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		external?: boolean;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	let {
		href,
		variant = 'secondary',
		size = 'md',
		shape = 'rounded',
		external = false,
		class: className = '',
		children,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const target = $derived(external ? '_blank' : restProps.target);
	const rel = $derived(external ? 'noopener noreferrer' : restProps.rel);
</script>

<a
	{href}
	class="f-btn f-link-btn {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	{target}
	{rel}
	{...restProps}
>
	{#if leading}
		{@render leading()}
	{/if}

	{#if children}
		{@render children()}
	{/if}

	{#if external}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="f-external-icon"
		>
			<path d="M15 3h6v6" />
			<path d="M10 14 21 3" />
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
		</svg>
	{:else if trailing}
		{@render trailing()}
	{/if}
</a>

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
				color var(--f-duration-fast) var(--f-ease);
		}

		.f-btn:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
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
		.f-btn[data-variant='secondary'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
		}
		.f-btn[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}
		.f-btn[data-variant='ghost'] {
			background: transparent;
			color: var(--f-text-muted);
			border-color: transparent;
		}

		.f-external-icon {
			opacity: 0.7;
			margin-left: 2px;
		}
	}
</style>
