<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		description?: string;
		showTooltip?: boolean;
		showValue?: boolean;
		formatValue?: (val: number) => string;
		disabled?: boolean;
		size?: Size;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		label,
		description,
		showTooltip = false,
		showValue = false,
		formatValue = (v: number) => String(v),
		disabled = false,
		size = 'md',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let trackEl: HTMLDivElement | null = $state(null);
	let isDragging = $state(false);
	let isHovering = $state(false);

	const autoId = 'f-sld-' + Math.random().toString(36).slice(2, 9);
	const sliderId = $derived(id || autoId);

	const percentage = $derived.by(() => {
		if (max <= min) return 0;
		const clamped = Math.max(min, Math.min(max, value));
		return ((clamped - min) / (max - min)) * 100;
	});

	function roundToStep(val: number): number {
		const steps = Math.round((val - min) / step);
		const raw = min + steps * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
	}

	function updateValueFromPointer(clientX: number) {
		if (!trackEl || disabled) return;
		const rect = trackEl.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		const rawVal = min + ratio * (max - min);
		value = roundToStep(rawVal);
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		isDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		updateValueFromPointer(e.clientX);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || disabled) return;
		updateValueFromPointer(e.clientX);
	}

	function handlePointerUp(e: PointerEvent) {
		if (isDragging) {
			isDragging = false;
			try {
				(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			} catch {}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		let nextVal = value;
		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			nextVal = Math.min(max, value + step);
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			nextVal = Math.max(min, value - step);
		} else if (e.key === 'PageUp') {
			e.preventDefault();
			nextVal = Math.min(max, value + step * 10);
		} else if (e.key === 'PageDown') {
			e.preventDefault();
			nextVal = Math.max(min, value - step * 10);
		} else if (e.key === 'Home') {
			e.preventDefault();
			nextVal = min;
		} else if (e.key === 'End') {
			e.preventDefault();
			nextVal = max;
		} else {
			return;
		}
		value = roundToStep(nextVal);
	}
</script>

<div
	class="f-slider-container {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	{...restProps}
>
	{#if label || showValue}
		<div class="f-slider-header">
			{#if label}
				<label class="f-slider-label" for={sliderId}>{label}</label>
			{/if}
			{#if showValue}
				<span class="f-slider-value-badge">{formatValue(value)}</span>
			{/if}
		</div>
	{/if}

	{#if description}
		<span class="f-slider-desc">{description}</span>
	{/if}

	<div
		bind:this={trackEl}
		role="presentation"
		class="f-slider-track-wrap"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		onmouseenter={() => (isHovering = true)}
		onmouseleave={() => (isHovering = false)}
	>
		<div class="f-slider-track">
			<div class="f-slider-fill" style="width: {percentage}%;"></div>
		</div>

		<div
			id={sliderId}
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			aria-disabled={disabled || undefined}
			onkeydown={handleKeyDown}
			class="f-slider-thumb"
			style="left: {percentage}%;"
		>
			{#if (showTooltip && (isDragging || isHovering))}
				<div class="f-slider-tooltip" aria-hidden="true">
					{formatValue(value)}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-slider-container {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
			user-select: none;
		}

		.f-slider-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.f-slider-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
		}

		.f-slider-value-badge {
			font-size: var(--f-text-xs);
			font-weight: 600;
			color: var(--f-primary);
			font-variant-numeric: tabular-nums;
		}

		.f-slider-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			margin-top: -2px;
		}

		.f-slider-track-wrap {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			height: 24px;
			cursor: pointer;
			touch-action: none;
		}

		.f-slider-track {
			position: relative;
			width: 100%;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-full);
			overflow: hidden;
		}

		.f-slider-fill {
			height: 100%;
			background: var(--f-primary);
			border-radius: var(--f-radius-full);
			transition: width 0.05s ease-out;
		}

		.f-slider-thumb {
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			background: #ffffff;
			border: 2px solid var(--f-primary);
			border-radius: var(--f-radius-full);
			box-shadow: var(--f-shadow-sm);
			cursor: grab;
			outline: none;
			box-sizing: border-box;
			transition: transform var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
		}

		.f-slider-thumb:hover {
			transform: translate(-50%, -50%) scale(1.15);
		}

		.f-slider-thumb:focus-visible {
			box-shadow: 0 0 0 3px var(--f-ring);
			transform: translate(-50%, -50%) scale(1.15);
		}

		.f-slider-track-wrap:active .f-slider-thumb {
			cursor: grabbing;
			transform: translate(-50%, -50%) scale(1.1);
		}

		/* Floating Tooltip */
		.f-slider-tooltip {
			position: absolute;
			bottom: calc(100% + 8px);
			left: 50%;
			transform: translateX(-50%);
			padding: 2px 6px;
			background: var(--f-panel);
			color: var(--f-text);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-sm);
			font-size: var(--f-text-xs);
			font-weight: 600;
			white-space: nowrap;
			box-shadow: var(--f-shadow-md);
			pointer-events: none;
			animation: f-sld-fade 0.15s ease-out;
		}

		@keyframes f-sld-fade {
			from {
				opacity: 0;
				transform: translate(-50%, 4px);
			}
			to {
				opacity: 1;
				transform: translate(-50%, 0);
			}
		}

		/* Sizes */
		.f-slider-container[data-size='sm'] .f-slider-track {
			height: 4px;
		}
		.f-slider-container[data-size='sm'] .f-slider-thumb {
			width: 14px;
			height: 14px;
		}

		.f-slider-container[data-size='md'] .f-slider-track {
			height: 6px;
		}
		.f-slider-container[data-size='md'] .f-slider-thumb {
			width: 18px;
			height: 18px;
		}

		.f-slider-container[data-size='lg'] .f-slider-track {
			height: 8px;
		}
		.f-slider-container[data-size='lg'] .f-slider-thumb {
			width: 22px;
			height: 22px;
		}

		/* Disabled State */
		.f-slider-container[data-disabled='true'] {
			opacity: 0.55;
			cursor: not-allowed;
		}
		.f-slider-container[data-disabled='true'] .f-slider-track-wrap,
		.f-slider-container[data-disabled='true'] .f-slider-thumb {
			cursor: not-allowed;
		}
	}
</style>
