<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		minVal?: number;
		maxVal?: number;
		min?: number;
		max?: number;
		step?: number;
		minDistance?: number;
		label?: string;
		description?: string;
		showTooltips?: boolean;
		showValues?: boolean;
		formatValue?: (val: number) => string;
		disabled?: boolean;
		size?: Size;
		id?: string;
		class?: string;
	}

	let {
		minVal = $bindable(20),
		maxVal = $bindable(80),
		min = 0,
		max = 100,
		step = 1,
		minDistance = 0,
		label,
		description,
		showTooltips = false,
		showValues = false,
		formatValue = (v: number) => String(v),
		disabled = false,
		size = 'md',
		id,
		class: className = '',
		...restProps
	}: Props = $props();

	let trackEl: HTMLDivElement | null = $state(null);
	let activeThumb: 'min' | 'max' | null = $state(null);
	let isHovering = $state(false);

	const autoId = 'f-rsld-' + Math.random().toString(36).slice(2, 9);
	const rangeSliderId = $derived(id || autoId);

	const minPercent = $derived.by(() => {
		if (max <= min) return 0;
		const clamped = Math.max(min, Math.min(max, minVal));
		return ((clamped - min) / (max - min)) * 100;
	});

	const maxPercent = $derived.by(() => {
		if (max <= min) return 100;
		const clamped = Math.max(min, Math.min(max, maxVal));
		return ((clamped - min) / (max - min)) * 100;
	});

	function roundToStep(val: number): number {
		const steps = Math.round((val - min) / step);
		const raw = min + steps * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
	}

	function handlePointerDown(thumb: 'min' | 'max', e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		e.stopPropagation();
		activeThumb = thumb;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handleTrackPointerDown(e: PointerEvent) {
		if (disabled || !trackEl) return;
		e.preventDefault();
		const rect = trackEl.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const rawVal = min + ratio * (max - min);

		// Determine closest thumb
		const distToMin = Math.abs(rawVal - minVal);
		const distToMax = Math.abs(rawVal - maxVal);
		const targetThumb = distToMin <= distToMax ? 'min' : 'max';
		activeThumb = targetThumb;

		updateThumbValue(targetThumb, rawVal);
	}

	function updateThumbValue(thumb: 'min' | 'max', rawVal: number) {
		const rounded = roundToStep(rawVal);
		if (thumb === 'min') {
			minVal = Math.min(rounded, maxVal - minDistance);
		} else {
			maxVal = Math.max(rounded, minVal + minDistance);
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (!activeThumb || disabled || !trackEl) return;
		const rect = trackEl.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const rawVal = min + ratio * (max - min);
		updateThumbValue(activeThumb, rawVal);
	}

	function handlePointerUp(e: PointerEvent) {
		if (activeThumb) {
			activeThumb = null;
			try {
				(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			} catch {}
		}
	}

	function handleMinKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		let next = minVal;
		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			next = minVal + step;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			next = minVal - step;
		} else if (e.key === 'Home') {
			e.preventDefault();
			next = min;
		} else if (e.key === 'End') {
			e.preventDefault();
			next = maxVal - minDistance;
		}
		updateThumbValue('min', next);
	}

	function handleMaxKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		let next = maxVal;
		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			next = maxVal + step;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			next = maxVal - step;
		} else if (e.key === 'Home') {
			e.preventDefault();
			next = minVal + minDistance;
		} else if (e.key === 'End') {
			e.preventDefault();
			next = max;
		}
		updateThumbValue('max', next);
	}
</script>

<div
	class="f-range-slider-container {className}"
	data-size={size}
	data-disabled={disabled || undefined}
	{...restProps}
>
	{#if label || showValues}
		<div class="f-range-slider-header">
			{#if label}
				<span class="f-range-slider-label">{label}</span>
			{/if}
			{#if showValues}
				<span class="f-range-slider-values">
					{formatValue(minVal)} &ndash; {formatValue(maxVal)}
				</span>
			{/if}
		</div>
	{/if}

	{#if description}
		<span class="f-range-slider-desc">{description}</span>
	{/if}

	<div
		bind:this={trackEl}
		role="presentation"
		class="f-range-slider-track-wrap"
		onpointerdown={handleTrackPointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		onmouseenter={() => (isHovering = true)}
		onmouseleave={() => (isHovering = false)}
	>
		<div class="f-range-slider-track">
			<div
				class="f-range-slider-fill"
				style="left: {minPercent}%; width: {Math.max(0, maxPercent - minPercent)}%;"
			></div>
		</div>

		<!-- Min thumb -->
		<div
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-label="Minimum range value"
			aria-valuemin={min}
			aria-valuemax={maxVal - minDistance}
			aria-valuenow={minVal}
			aria-disabled={disabled || undefined}
			onpointerdown={(e) => handlePointerDown('min', e)}
			onkeydown={handleMinKeyDown}
			class="f-range-slider-thumb min-thumb"
			class:active={activeThumb === 'min'}
			style="left: {minPercent}%;"
		>
			{#if showTooltips && (activeThumb === 'min' || isHovering)}
				<div class="f-range-slider-tooltip" aria-hidden="true">
					{formatValue(minVal)}
				</div>
			{/if}
		</div>

		<!-- Max thumb -->
		<div
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-label="Maximum range value"
			aria-valuemin={minVal + minDistance}
			aria-valuemax={max}
			aria-valuenow={maxVal}
			aria-disabled={disabled || undefined}
			onpointerdown={(e) => handlePointerDown('max', e)}
			onkeydown={handleMaxKeyDown}
			class="f-range-slider-thumb max-thumb"
			class:active={activeThumb === 'max'}
			style="left: {maxPercent}%;"
		>
			{#if showTooltips && (activeThumb === 'max' || isHovering)}
				<div class="f-range-slider-tooltip" aria-hidden="true">
					{formatValue(maxVal)}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-range-slider-container {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-2xs);
			width: 100%;
			font-family: inherit;
			box-sizing: border-box;
			user-select: none;
		}

		.f-range-slider-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.f-range-slider-label {
			font-size: var(--f-text-sm);
			font-weight: 500;
			color: var(--f-text);
		}

		.f-range-slider-values {
			font-size: var(--f-text-xs);
			font-weight: 600;
			color: var(--f-primary);
			font-variant-numeric: tabular-nums;
		}

		.f-range-slider-desc {
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			margin-top: -2px;
		}

		.f-range-slider-track-wrap {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			height: 24px;
			cursor: pointer;
			touch-action: none;
		}

		.f-range-slider-track {
			position: relative;
			width: 100%;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-full);
			overflow: hidden;
		}

		.f-range-slider-fill {
			position: absolute;
			top: 0;
			bottom: 0;
			background: var(--f-primary);
			border-radius: var(--f-radius-full);
		}

		.f-range-slider-thumb {
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
			z-index: 10;
			transition: transform var(--f-duration-fast) var(--f-ease),
				box-shadow var(--f-duration-fast) var(--f-ease);
		}

		.f-range-slider-thumb:hover,
		.f-range-slider-thumb.active {
			transform: translate(-50%, -50%) scale(1.15);
		}

		.f-range-slider-thumb:focus-visible {
			box-shadow: 0 0 0 3px var(--f-ring);
			transform: translate(-50%, -50%) scale(1.15);
		}

		.f-range-slider-thumb:active {
			cursor: grabbing;
		}

		/* Tooltip */
		.f-range-slider-tooltip {
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
		}

		/* Sizes */
		.f-range-slider-container[data-size='sm'] .f-range-slider-track {
			height: 4px;
		}
		.f-range-slider-container[data-size='sm'] .f-range-slider-thumb {
			width: 14px;
			height: 14px;
		}

		.f-range-slider-container[data-size='md'] .f-range-slider-track {
			height: 6px;
		}
		.f-range-slider-container[data-size='md'] .f-range-slider-thumb {
			width: 18px;
			height: 18px;
		}

		.f-range-slider-container[data-size='lg'] .f-range-slider-track {
			height: 8px;
		}
		.f-range-slider-container[data-size='lg'] .f-range-slider-thumb {
			width: 22px;
			height: 22px;
		}

		/* Disabled State */
		.f-range-slider-container[data-disabled='true'] {
			opacity: 0.55;
			cursor: not-allowed;
		}
		.f-range-slider-container[data-disabled='true'] .f-range-slider-track-wrap,
		.f-range-slider-container[data-disabled='true'] .f-range-slider-thumb {
			cursor: not-allowed;
		}
	}
</style>
