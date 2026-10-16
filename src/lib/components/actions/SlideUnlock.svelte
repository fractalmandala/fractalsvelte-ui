<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Intent } from '../../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		unlocked?: boolean;
		label?: string;
		successLabel?: string;
		intent?: 'primary' | Intent;
		disabled?: boolean;
		class?: string;
		onunlock?: () => void;
		onreset?: () => void;
		children?: Snippet;
	}

	let {
		unlocked = $bindable(false),
		label = 'Slide to confirm',
		successLabel = 'Confirmed',
		intent = 'primary',
		disabled = false,
		class: className = '',
		onunlock,
		onreset,
		children,
		...restProps
	}: Props = $props();

	let trackEl: HTMLDivElement | undefined = $state();
	let thumbEl: HTMLDivElement | undefined = $state();
	let offsetX = $state(0);
	let isDragging = $state(false);
	let maxDrag = $state(160);

	function updateBounds() {
		if (trackEl && thumbEl) {
			maxDrag = Math.max(10, trackEl.clientWidth - thumbEl.clientWidth - 8);
		}
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled) return;
		if (unlocked) {
			// Click to reset
			unlocked = false;
			offsetX = 0;
			onreset?.();
			return;
		}
		updateBounds();
		isDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || disabled || !trackEl) return;
		const rect = trackEl.getBoundingClientRect();
		const pos = e.clientX - rect.left - 24; // center thumb
		offsetX = Math.min(maxDrag, Math.max(0, pos));
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {}

		if (offsetX >= maxDrag * 0.75) {
			offsetX = maxDrag;
			unlocked = true;
			onunlock?.();
		} else {
			offsetX = 0;
		}
	}

	$effect(() => {
		if (unlocked) {
			updateBounds();
			offsetX = maxDrag;
		} else if (!isDragging) {
			offsetX = 0;
		}
	});
</script>

<svelte:window onresize={updateBounds} />

<div
	bind:this={trackEl}
	class="f-slide-unlock {className}"
	data-intent={intent}
	data-unlocked={unlocked ? '' : undefined}
	data-dragging={isDragging ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	role="slider"
	tabindex={disabled ? -1 : 0}
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={maxDrag}
	aria-valuenow={offsetX}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	{...restProps}
>
	<div
		class="f-slide-fill"
		style="width: {offsetX + 48}px;"
	></div>

	<div
		bind:this={thumbEl}
		class="f-slide-thumb"
		style="transform: translateX({offsetX}px);"
	>
		{#if unlocked}
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="20 6 9 17 4 12" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="9 6 15 12 9 18" />
			</svg>
		{/if}
	</div>

	<div class="f-slide-label" data-unlocked={unlocked ? '' : undefined}>
		{unlocked ? successLabel : label}
	</div>

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-slide-unlock {
			position: relative;
			width: 100%;
			max-width: 280px;
			height: 48px;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: 9999px;
			overflow: hidden;
			user-select: none;
			touch-action: none;
			cursor: grab;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			padding: 4px;
			transition: border-color var(--f-duration-normal) var(--f-ease);
		}

		.f-slide-unlock[data-dragging] {
			cursor: grabbing;
		}

		.f-slide-unlock[data-unlocked] {
			cursor: pointer;
			border-color: var(--f-success, #10b981);
		}

		.f-slide-unlock[data-disabled] {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		.f-slide-fill {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			border-radius: 9999px;
			background: var(--f-primary-muted, rgba(99, 102, 241, 0.2));
			pointer-events: none;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-slide-unlock[data-unlocked] .f-slide-fill {
			width: 100% !important;
			background: var(--f-success-muted, rgba(16, 185, 129, 0.2));
		}

		.f-slide-thumb {
			position: absolute;
			left: 4px;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-sm);
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--f-text);
			z-index: 2;
			pointer-events: none;
			transition: transform 0.05s linear, background var(--f-duration-normal) var(--f-ease), color var(--f-duration-normal) var(--f-ease);
		}

		.f-slide-unlock:not([data-dragging]) .f-slide-thumb {
			transition: transform var(--f-duration-normal) var(--f-ease), background var(--f-duration-normal) var(--f-ease), color var(--f-duration-normal) var(--f-ease);
		}

		.f-slide-unlock[data-unlocked] .f-slide-thumb {
			background: var(--f-success, #10b981);
			color: #ffffff;
			border-color: transparent;
		}

		.f-slide-label {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-left: 20px;
			font-size: var(--f-text-xs);
			font-weight: 600;
			letter-spacing: 0.05em;
			text-transform: uppercase;
			color: var(--f-text-muted);
			pointer-events: none;
			z-index: 1;
			transition: opacity var(--f-duration-normal) var(--f-ease), color var(--f-duration-normal) var(--f-ease);
		}

		.f-slide-label[data-unlocked] {
			padding-left: 0;
			color: var(--f-success, #10b981);
		}

		/* Intents */
		.f-slide-unlock[data-intent='success'] .f-slide-fill {
			background: var(--f-success-muted, rgba(16, 185, 129, 0.2));
		}
		.f-slide-unlock[data-intent='danger'] .f-slide-fill {
			background: var(--f-danger-muted, rgba(239, 68, 68, 0.2));
		}
		.f-slide-unlock[data-intent='danger'][data-unlocked] {
			border-color: var(--f-danger, #ef4444);
		}
		.f-slide-unlock[data-intent='danger'][data-unlocked] .f-slide-thumb {
			background: var(--f-danger, #ef4444);
		}
	}
</style>
