<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size } from '../../types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		size?: Size;
		label?: string;
		unit?: string;
		showTicks?: boolean;
		showReadout?: boolean;
		disabled?: boolean;
		class?: string;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		size = 'md',
		label,
		unit = '',
		showTicks = true,
		showReadout = true,
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();

	let dialEl: HTMLDivElement | undefined = $state();
	let isDragging = $state(false);

	// Angle range: -135deg (min) to +135deg (max) -> 270 deg total arc
	const MIN_ANGLE = -135;
	const MAX_ANGLE = 135;
	const TOTAL_ARC = MAX_ANGLE - MIN_ANGLE;

	const angle = $derived.by(() => {
		const clamped = Math.min(max, Math.max(min, value));
		const pct = (clamped - min) / (max - min || 1);
		return MIN_ANGLE + pct * TOTAL_ARC;
	});

	function updateFromPointer(e: PointerEvent) {
		if (!dialEl || disabled) return;
		const rect = dialEl.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		const dx = e.clientX - cx;
		const dy = e.clientY - cy;

		// Calculate angle in degrees from top (0 deg at 12 o'clock)
		let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
		if (deg > 180) deg -= 360;

		// Clamp into MIN_ANGLE to MAX_ANGLE
		let clampedAngle = Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, deg));
		const pct = (clampedAngle - MIN_ANGLE) / TOTAL_ARC;
		let rawValue = min + pct * (max - min);

		if (step > 0) {
			rawValue = Math.round((rawValue - min) / step) * step + min;
		}

		value = Math.min(max, Math.max(min, Number(rawValue.toFixed(2))));
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled) return;
		isDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		updateFromPointer(e);
	}

	function handlePointerMove(e: PointerEvent) {
		if (isDragging) {
			updateFromPointer(e);
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		const delta = step || 1;
		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
			e.preventDefault();
			value = Math.min(max, value + delta);
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
			e.preventDefault();
			value = Math.max(min, value - delta);
		} else if (e.key === 'Home') {
			e.preventDefault();
			value = min;
		} else if (e.key === 'End') {
			e.preventDefault();
			value = max;
		}
	}
</script>

<div
	class="f-rotary-dial-container {className}"
	data-size={size}
	data-disabled={disabled ? '' : undefined}
	data-dragging={isDragging ? '' : undefined}
	{...restProps}
>
	{#if label}
		<span class="f-rotary-label">{label}</span>
	{/if}

	<div
		bind:this={dialEl}
		class="f-rotary-dial"
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label ?? 'Rotary dial'}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		onkeydown={handleKeyDown}
	>
		{#if showTicks}
			<div class="f-rotary-ticks" aria-hidden="true">
				{#each Array(11) as _, i (i)}
					{@const tickAngle = MIN_ANGLE + (i / 10) * TOTAL_ARC}
					<span
						class="f-rotary-tick"
						class:active={tickAngle <= angle}
						style="transform: rotate({tickAngle}deg);"
					></span>
				{/each}
			</div>
		{/if}

		<div
			class="f-rotary-body"
			style="transform: rotate({angle}deg);"
		>
			<div class="f-rotary-notch"></div>
			<div class="f-rotary-cap"></div>
		</div>
	</div>

	{#if showReadout}
		<span class="f-rotary-readout">
			{value}{unit}
		</span>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-rotary-dial-container {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			gap: var(--f-space-xs);
			user-select: none;
			touch-action: none;
			box-sizing: border-box;
			font-family: inherit;
		}

		.f-rotary-dial-container[data-disabled] {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		.f-rotary-label {
			font-size: var(--f-text-xs);
			font-weight: 500;
			color: var(--f-text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		.f-rotary-dial {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: grab;
			outline: none;
		}

		.f-rotary-dial-container[data-dragging] .f-rotary-dial {
			cursor: grabbing;
		}

		.f-rotary-dial:focus-visible .f-rotary-body {
			box-shadow: 0 0 0 2px var(--f-ring);
		}

		/* Sizes */
		.f-rotary-dial-container[data-size='sm'] .f-rotary-dial { width: 56px; height: 56px; }
		.f-rotary-dial-container[data-size='sm'] .f-rotary-body { width: 44px; height: 44px; }
		.f-rotary-dial-container[data-size='sm'] .f-rotary-tick { height: 6px; top: 2px; }

		.f-rotary-dial-container[data-size='md'] .f-rotary-dial { width: 80px; height: 80px; }
		.f-rotary-dial-container[data-size='md'] .f-rotary-body { width: 62px; height: 62px; }
		.f-rotary-dial-container[data-size='md'] .f-rotary-tick { height: 8px; top: 2px; }

		.f-rotary-dial-container[data-size='lg'] .f-rotary-dial { width: 108px; height: 108px; }
		.f-rotary-dial-container[data-size='lg'] .f-rotary-body { width: 84px; height: 84px; }
		.f-rotary-dial-container[data-size='lg'] .f-rotary-tick { height: 10px; top: 2px; }

		/* Ticks */
		.f-rotary-ticks {
			position: absolute;
			inset: 0;
			pointer-events: none;
		}

		.f-rotary-tick {
			position: absolute;
			left: 50%;
			width: 2px;
			margin-left: -1px;
			background: var(--f-border);
			border-radius: 1px;
			transform-origin: bottom center;
			height: 8px;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-rotary-tick.active {
			background: var(--f-primary);
		}

		/* Body */
		.f-rotary-body {
			position: relative;
			border-radius: 50%;
			background: radial-gradient(circle at 35% 35%, var(--f-surface-raised, #24242e) 0%, var(--f-surface, #18181f) 100%);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-md), inset 0 1px 1px rgba(255, 255, 255, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			transition: transform 0.05s linear;
		}

		.f-rotary-dial-container:not([data-dragging]) .f-rotary-body {
			transition: transform var(--f-duration-normal) var(--f-ease);
		}

		.f-rotary-notch {
			position: absolute;
			top: 6px;
			left: 50%;
			width: 3px;
			height: 12px;
			margin-left: -1.5px;
			background: var(--f-primary);
			border-radius: 2px;
			box-shadow: 0 0 6px var(--f-primary);
		}

		.f-rotary-cap {
			width: 30%;
			height: 30%;
			border-radius: 50%;
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
		}

		.f-rotary-readout {
			font-family: var(--f-font-mono, monospace);
			font-size: var(--f-text-xs);
			font-weight: 600;
			color: var(--f-text);
			padding: 2px 6px;
			border-radius: var(--f-radius-sm);
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
		}
	}
</style>
