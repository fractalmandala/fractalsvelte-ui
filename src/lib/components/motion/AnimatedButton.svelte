<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape, BtnType } from '../../types';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		type?: BtnType;
		disabled?: boolean;
		loading?: boolean;
		shine?: boolean;
		spring?: boolean;
		ripple?: boolean;
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
		disabled = false,
		loading = false,
		shine = true,
		spring = true,
		ripple = true,
		class: className = '',
		children,
		leading,
		trailing,
		onclick,
		...restProps
	}: Props = $props();

	interface RippleItem {
		id: number;
		x: number;
		y: number;
		size: number;
	}

	let ripples = $state<RippleItem[]>([]);
	let rippleCounter = 0;

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (disabled || loading) return;

		if (ripple) {
			const rect = event.currentTarget.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			const radius = Math.max(
				Math.hypot(x, y),
				Math.hypot(rect.width - x, y),
				Math.hypot(x, rect.height - y),
				Math.hypot(rect.width - x, rect.height - y)
			);
			const rippleSize = radius * 2;
			const id = ++rippleCounter;

			ripples = [...ripples, { id, x, y, size: rippleSize }];

			setTimeout(() => {
				ripples = ripples.filter((r) => r.id !== id);
			}, 600);
		}

		onclick?.(event);
	}
</script>

<button
	{type}
	class="f-animated-btn {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	data-state={loading ? 'loading' : undefined}
	data-spring={spring ? 'true' : undefined}
	data-shine={shine ? 'true' : undefined}
	disabled={disabled || loading}
	aria-busy={loading || undefined}
	onclick={handleClick}
	{...restProps}
>
	{#if shine}
		<span class="f-shine-sweep" aria-hidden="true"></span>
	{/if}

	{#if ripple && ripples.length > 0}
		<span class="f-ripple-container" aria-hidden="true">
			{#each ripples as r (r.id)}
				<span
					class="f-btn-ripple"
					style="left: {r.x}px; top: {r.y}px; width: {r.size}px; height: {r.size}px;"
				></span>
			{/each}
		</span>
	{/if}

	{#if loading}
		<span class="f-btn-spinner" aria-hidden="true"></span>
	{:else if leading}
		<span class="f-btn-leading">{@render leading()}</span>
	{/if}

	{#if children}
		<span class="f-btn-content">{@render children()}</span>
	{/if}

	{#if trailing && !loading}
		<span class="f-btn-trailing">{@render trailing()}</span>
	{/if}
</button>

<style>
	@layer fractalsvelte-ui.components {
		.f-animated-btn {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--f-space-xs);
			font-family: var(--f-font-sans);
			font-weight: 500;
			line-height: 1;
			white-space: nowrap;
			cursor: pointer;
			user-select: none;
			overflow: hidden;
			border: 1px solid transparent;
			box-sizing: border-box;
			text-decoration: none;
			outline: none;
			transition:
				background-color var(--f-duration-fast) var(--f-ease),
				border-color var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease),
				transform var(--f-duration-fast) var(--f-ease-spring);
		}

		.f-animated-btn[data-spring='true']:hover {
			transform: translateY(-1px);
		}

		.f-animated-btn[data-spring='true']:active:not(:disabled) {
			transform: scale(0.96) translateY(1px);
			transition-duration: 80ms;
		}

		/* Sizes */
		.f-animated-btn[data-size='xs'] {
			height: 1.625rem;
			padding: 0 var(--f-space-xs);
			font-size: var(--f-text-xs);
		}

		.f-animated-btn[data-size='sm'] {
			height: 2rem;
			padding: 0 var(--f-space-sm);
			font-size: var(--f-text-sm);
		}

		.f-animated-btn[data-size='md'] {
			height: 2.375rem;
			padding: 0 var(--f-space-md);
			font-size: var(--f-text-base);
		}

		.f-animated-btn[data-size='lg'] {
			height: 2.75rem;
			padding: 0 var(--f-space-lg);
			font-size: var(--f-text-lg);
		}

		.f-animated-btn[data-size='xl'] {
			height: 3.25rem;
			padding: 0 var(--f-space-xl);
			font-size: var(--f-text-xl);
		}

		/* Shapes */
		.f-animated-btn[data-shape='square'] {
			border-radius: 0;
		}

		.f-animated-btn[data-shape='rounded'] {
			border-radius: var(--f-radius-md);
		}

		.f-animated-btn[data-shape='pill'] {
			border-radius: var(--f-radius-full);
		}

		/* Variants */
		.f-animated-btn[data-variant='primary'] {
			background: var(--f-primary);
			color: var(--f-primary-text);
			box-shadow: var(--f-shadow-sm), 0 0 0 1px var(--f-primary-hover);
		}

		.f-animated-btn[data-variant='primary']:hover:not(:disabled) {
			background: var(--f-primary-hover);
			box-shadow: var(--f-shadow-md), var(--f-shadow-glow);
		}

		.f-animated-btn[data-variant='secondary'] {
			background: var(--f-panel);
			color: var(--f-text);
			border-color: var(--f-border);
			box-shadow: var(--f-shadow-xs);
		}

		.f-animated-btn[data-variant='secondary']:hover:not(:disabled) {
			background: var(--f-hover);
			border-color: var(--f-border-strong);
		}

		.f-animated-btn[data-variant='soft'] {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
		}

		.f-animated-btn[data-variant='soft']:hover:not(:disabled) {
			background: var(--f-primary);
			color: var(--f-primary-text);
		}

		.f-animated-btn[data-variant='outline'] {
			background: transparent;
			color: var(--f-text);
			border-color: var(--f-border-strong);
		}

		.f-animated-btn[data-variant='outline']:hover:not(:disabled) {
			background: var(--f-hover);
			border-color: var(--f-primary);
			color: var(--f-primary);
		}

		.f-animated-btn[data-variant='ghost'] {
			background: transparent;
			color: var(--f-text-muted);
		}

		.f-animated-btn[data-variant='ghost']:hover:not(:disabled) {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-animated-btn[data-variant='destructive'] {
			background: var(--f-danger);
			color: #ffffff;
			box-shadow: var(--f-shadow-sm);
		}

		.f-animated-btn[data-variant='destructive']:hover:not(:disabled) {
			filter: brightness(0.92);
			box-shadow: 0 0 16px var(--f-danger-bg);
		}

		.f-animated-btn[data-variant='surface'] {
			background: var(--f-surface);
			color: var(--f-text);
			border-color: var(--f-border);
		}

		.f-animated-btn[data-variant='surface']:hover:not(:disabled) {
			background: var(--f-raised);
			border-color: var(--f-border-strong);
		}

		/* Disabled & Loading */
		.f-animated-btn:disabled {
			opacity: 0.55;
			cursor: not-allowed;
			transform: none !important;
			box-shadow: none !important;
		}

		.f-btn-spinner {
			width: 1em;
			height: 1em;
			border: 2px solid currentColor;
			border-right-color: transparent;
			border-radius: var(--f-radius-full);
			animation: f-spin 0.65s linear infinite;
		}

		@keyframes f-spin {
			to {
				transform: rotate(360deg);
			}
		}

		/* Shine sweep effect */
		.f-shine-sweep {
			position: absolute;
			top: 0;
			left: -120%;
			width: 60%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent 0%,
				rgba(255, 255, 255, 0.22) 50%,
				transparent 100%
			);
			transform: skewX(-25deg);
			pointer-events: none;
			transition: none;
		}

		.f-animated-btn:hover .f-shine-sweep {
			animation: f-shine-sweep 1s var(--f-ease) infinite;
		}

		@keyframes f-shine-sweep {
			0% {
				left: -120%;
			}
			100% {
				left: 220%;
			}
		}

		/* Ripple effect */
		.f-ripple-container {
			position: absolute;
			inset: 0;
			pointer-events: none;
			overflow: hidden;
			border-radius: inherit;
		}

		.f-btn-ripple {
			position: absolute;
			border-radius: var(--f-radius-full);
			background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 70%);
			transform: translate(-50%, -50%) scale(0);
			animation: f-ripple-expand 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
			pointer-events: none;
		}

		@keyframes f-ripple-expand {
			0% {
				transform: translate(-50%, -50%) scale(0);
				opacity: 1;
			}
			100% {
				transform: translate(-50%, -50%) scale(1);
				opacity: 0;
			}
		}

		.f-btn-leading,
		.f-btn-trailing {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 1.1em;
		}

		.f-btn-content {
			display: inline-flex;
			align-items: center;
		}
	}
</style>
