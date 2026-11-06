<!-- @component A 2D interactive XY control pad with crosshair guide, draggable puck, and value readout. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Size, Surface, Border, Shape, Shadow, TextSize, Point } from '$lib/types.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		value?: Point;
		minX?: number;
		maxX?: number;
		minY?: number;
		maxY?: number;
		stepX?: number;
		stepY?: number;
		disabled?: boolean;
		size?: Size;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		label?: string;
		showValues?: boolean;
		textsize?: TextSize;
		class?: string;
		onchange?: (value: Point) => void;
	}

	let {
		value = $bindable({ x: 50, y: 50 }),
		minX = 0,
		maxX = 100,
		minY = 0,
		maxY = 100,
		stepX = 1,
		stepY = 1,
		disabled = false,
		size = 'h-xl',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow = 'shad-sm',
		label,
		showValues = true,
		textsize = 'text-md',
		class: className = '',
		onchange,
		...restProps
	}: Props = $props();

	let padEl: HTMLDivElement | undefined = $state();
	let isDragging = $state(false);

	function clamp(val: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, val));
	}

	function quantize(val: number, step: number): number {
		if (step <= 0) return val;
		return Math.round(val / step) * step;
	}

	const pctX = $derived(((value.x - minX) / (maxX - minX)) * 100);
	const pctY = $derived((1 - (value.y - minY) / (maxY - minY)) * 100);

	function updateFromPointer(clientX: number, clientY: number) {
		if (!padEl || disabled) return;
		const rect = padEl.getBoundingClientRect();
		const normX = clamp((clientX - rect.left) / rect.width, 0, 1);
		const normY = clamp((clientY - rect.top) / rect.height, 0, 1);

		const rawX = minX + normX * (maxX - minX);
		const rawY = maxY - normY * (maxY - minY);

		const nextX = quantize(clamp(rawX, minX, maxX), stepX);
		const nextY = quantize(clamp(rawY, minY, maxY), stepY);

		value = { x: nextX, y: nextY };
		onchange?.(value);
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled) return;
		e.preventDefault();
		isDragging = true;
		padEl?.focus();
		padEl?.setPointerCapture(e.pointerId);
		updateFromPointer(e.clientX, e.clientY);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || disabled) return;
		updateFromPointer(e.clientX, e.clientY);
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		try {
			padEl?.releasePointerCapture(e.pointerId);
		} catch {}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (disabled) return;
		let nextX = value.x;
		let nextY = value.y;

		switch (e.key) {
			case 'ArrowRight':
				nextX += stepX;
				break;
			case 'ArrowLeft':
				nextX -= stepX;
				break;
			case 'ArrowUp':
				nextY += stepY;
				break;
			case 'ArrowDown':
				nextY -= stepY;
				break;
			case 'Home':
				nextX = minX;
				nextY = maxY;
				break;
			case 'End':
				nextX = maxX;
				nextY = minY;
				break;
			default:
				return;
		}

		e.preventDefault();
		value = {
			x: quantize(clamp(nextX, minX, maxX), stepX),
			y: quantize(clamp(nextY, minY, maxY), stepY)
		};
		onchange?.(value);
	}
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label || showValues}
		<div class="row xbetween ycenter text-xs">
			{#if label}
				<span class="font-medium text-secondary">{label}</span>
			{/if}
			{#if showValues}
				<span class="font-mono text-muted">X: {value.x} · Y: {value.y}</span>
			{/if}
		</div>
	{/if}

	<div
		bind:this={padEl}
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label ?? '2D Position Pad'}
		aria-valuemin={minX}
		aria-valuemax={maxX}
		aria-valuenow={value.x}
		aria-disabled={disabled}
		class="xypad-surface relative w-full h-44 overflow-hidden touch-none select-none cursor-crosshair shape {shape} {surface} {border} {shadow} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onkeydown={handleKeyDown}
		{...restProps}
	>
		<!-- Grid lines -->
		<div class="absolute inset-0 pointer-events-none opacity-20">
			<div class="absolute left-1/4 top-0 bottom-0 border-r border-current"></div>
			<div class="absolute left-1/2 top-0 bottom-0 border-r border-current"></div>
			<div class="absolute left-3/4 top-0 bottom-0 border-r border-current"></div>
			<div class="absolute top-1/4 left-0 right-0 border-b border-current"></div>
			<div class="absolute top-1/2 left-0 right-0 border-b border-current"></div>
			<div class="absolute top-3/4 left-0 right-0 border-b border-current"></div>
		</div>

		<!-- Crosshair lines following puck -->
		<div
			class="absolute top-0 bottom-0 pointer-events-none border-r border-dashed border-primary opacity-40"
			style="left: {pctX}%;"
		></div>
		<div
			class="absolute left-0 right-0 pointer-events-none border-b border-dashed border-primary opacity-40"
			style="top: {pctY}%;"
		></div>

		<!-- Draggable Puck -->
		<div
			class="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full pointer-events-none shadow-md transition-transform"
			style="left: {pctX}%; top: {pctY}%; background-color: var(--theme-color); border: 2px solid var(--white-fixed); transform: scale({isDragging ? 1.25 : 1});"
		></div>
	</div>
</div>

<style>
	.xypad-surface:focus-visible {
		outline: 2px solid var(--theme-color);
		outline-offset: 2px;
	}
</style>
