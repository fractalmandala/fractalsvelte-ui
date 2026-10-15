<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Variant, Size, Shape } from '../../types';

	interface Props extends HTMLButtonAttributes {
		holdTime?: number; // ms to hold
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		disabled?: boolean;
		class?: string;
		onconfirm?: () => void;
		children?: Snippet;
	}

	let {
		holdTime = 1200,
		variant = 'destructive',
		size = 'md',
		shape = 'rounded',
		disabled = false,
		class: className = '',
		onconfirm,
		children,
		...restProps
	}: Props = $props();

	let progress = $state(0);
	let isHolding = $state(false);
	let holdInterval: number | null = null;
	let confirmed = $state(false);

	function startHold() {
		if (disabled || confirmed) return;
		isHolding = true;
		progress = 0;
		const start = Date.now();

		holdInterval = window.setInterval(() => {
			const elapsed = Date.now() - start;
			const p = Math.min(100, (elapsed / holdTime) * 100);
			progress = p;

			if (p >= 100) {
				stopHold();
				confirmed = true;
				onconfirm?.();
				setTimeout(() => {
					confirmed = false;
					progress = 0;
				}, 1500);
			}
		}, 20);
	}

	function stopHold() {
		if (holdInterval !== null) {
			clearInterval(holdInterval);
			holdInterval = null;
		}
		if (!confirmed) {
			progress = 0;
			isHolding = false;
		}
	}
</script>

<button
	type="button"
	class="f-hold-confirm {className}"
	data-variant={variant}
	data-size={size}
	data-shape={shape}
	data-holding={isHolding ? 'true' : undefined}
	data-confirmed={confirmed ? 'true' : undefined}
	disabled={disabled}
	onpointerdown={startHold}
	onpointerup={stopHold}
	onpointerleave={stopHold}
	{...restProps}
>
	<div class="f-hold-fill" style="width: {progress}%;"></div>

	<span class="f-hold-content">
		{#if confirmed}
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
			<span>Confirmed!</span>
		{:else if isHolding}
			<span>Holding... {Math.round(progress)}%</span>
		{:else if children}
			{@render children()}
		{:else}
			<span>Hold to Confirm</span>
		{/if}
	</span>
</button>

<style>
	@layer fractalsvelte-ui.components {
		.f-hold-confirm {
			position: relative;
			overflow: hidden;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			border: 1px solid var(--f-border);
			background: var(--f-surface);
			color: var(--f-text);
			font-family: inherit;
			font-weight: 600;
			cursor: pointer;
			user-select: none;
			touch-action: none;
			transition: transform var(--f-duration-fast) var(--f-ease);
		}

		.f-hold-confirm:active:not(:disabled) {
			transform: scale(0.98);
		}

		.f-hold-fill {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			background: var(--f-primary);
			opacity: 0.35;
			transition: width 20ms linear;
			pointer-events: none;
		}

		.f-hold-confirm[data-variant='destructive'] .f-hold-fill {
			background: var(--f-danger);
			opacity: 0.45;
		}

		.f-hold-confirm[data-confirmed='true'] {
			background: var(--f-success);
			color: #ffffff;
			border-color: var(--f-success);
		}

		.f-hold-content {
			position: relative;
			z-index: 1;
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
		}

		/* Sizes */
		.f-hold-confirm[data-size='sm'] { height: 32px; padding: 0 0.85rem; font-size: var(--f-text-xs); }
		.f-hold-confirm[data-size='md'] { height: 40px; padding: 0 1.25rem; font-size: var(--f-text-sm); }
		.f-hold-confirm[data-size='lg'] { height: 48px; padding: 0 1.5rem; font-size: var(--f-text-base); }

		/* Shapes */
		.f-hold-confirm[data-shape='rounded'] { border-radius: var(--f-radius-md); }
		.f-hold-confirm[data-shape='pill'] { border-radius: var(--f-radius-full); }
		.f-hold-confirm[data-shape='square'] { border-radius: 0; }

		.f-hold-confirm:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
