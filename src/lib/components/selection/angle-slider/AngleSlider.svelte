<!-- @component Circular rotary dial slider selecting an angle in degrees. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Size } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Current angle value in degrees; bindable. */
		value?: number;
		/** Called when the angle updates. */
		onValueChange?: (value: number) => void;
		/** Minimum angle in degrees. */
		min?: number;
		/** Maximum angle in degrees. */
		max?: number;
		/** Discrete increment for pointer snapping and arrow keys. */
		step?: number;
		/** Outer diameter on the shared size ladder. */
		size?: Size;
		/** Disables pointer and keyboard interaction. */
		disabled?: boolean;
		/** Display numeric degree value in the center of the dial. */
		showValue?: boolean;
		/** Accessible label describing what the angle controls. */
		label?: string;
	}

	let {
		value = $bindable(0),
		onValueChange,
		min = 0,
		max = 360,
		step = 1,
		size = 'h-3xl',
		disabled = false,
		showValue = true,
		label = 'Angle',
		class: className,
		...rest
	}: Props = $props();

	let dial = $state<HTMLDivElement | null>(null);
	let dragging = $state(false);

	function snap(raw: number): number {
		const s = Math.max(0.01, step);
		const stepped = min + Math.round((raw - min) / s) * s;
		const clamped = Math.min(max, Math.max(min, stepped));
		return Math.round(clamped * 100) / 100;
	}

	function commit(next: number) {
		const normalized = snap(next);
		if (normalized === value) return;
		value = normalized;
		onValueChange?.(normalized);
	}

	function angleFromPointer(event: PointerEvent) {
		if (!dial) return;
		const rect = dial.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const rad = Math.atan2(event.clientX - cx, -(event.clientY - cy));
		let deg = (rad * 180) / Math.PI;
		if (deg < 0) deg += 360;
		const mapped = min + (deg / 360) * (max - min);
		commit(mapped);
	}

	function onPointerDown(event: PointerEvent) {
		if (disabled || !dial || event.button > 0) return;
		dial.setPointerCapture(event.pointerId);
		dragging = true;
		angleFromPointer(event);
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging || disabled) return;
		angleFromPointer(event);
	}

	function onPointerUp(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		if (dial?.hasPointerCapture(event.pointerId)) {
			dial.releasePointerCapture(event.pointerId);
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (disabled) return;
		const delta = event.shiftKey ? step * 10 : step;
		if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
			event.preventDefault();
			commit(value + delta);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
			event.preventDefault();
			commit(value - delta);
		} else if (event.key === 'Home') {
			event.preventDefault();
			commit(min);
		} else if (event.key === 'End') {
			event.preventDefault();
			commit(max);
		} else if (event.key === 'PageUp') {
			event.preventDefault();
			commit(value + step * 15);
		} else if (event.key === 'PageDown') {
			event.preventDefault();
			commit(value - step * 15);
		}
	}

	const displayAngle = $derived(
		max > min ? ((value - min) / (max - min)) * 360 : 0
	);
</script>

<div
	bind:this={dial}
	role="slider"
	tabindex={disabled ? -1 : 0}
	aria-label={label}
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={value}
	aria-valuetext={`${value}°`}
	aria-disabled={disabled || undefined}
	class={[
		'angle-dial focus-ring square',
		size,
		disabled && 'disabled',
		className
	]}
	{@attach vars({ angle: displayAngle })}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	onkeydown={onKeyDown}
	{...rest}
>
	<div class="angle-dial-arm" aria-hidden="true">
		<span class="angle-dial-dot"></span>
	</div>
	{#if showValue}
		<span class={['tabular-nums weight-600', size]}>{value}°</span>
	{/if}
</div>
