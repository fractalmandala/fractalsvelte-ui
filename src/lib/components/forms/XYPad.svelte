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

	let width = $state(0);
	let height = $state(0);
	const px = $derived((pctX / 100) * width);
	const py = $derived((pctY / 100) * height);

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
		<div class="row ycenter xbetween gap-sm text-xs">
			{#if label}<span class="weight-500 text-secondary">{label}</span>{/if}
			{#if showValues}<span class="font-mono tabular-nums text-muted">X: {value.x} · Y: {value.y}</span>{/if}
		</div>
	{/if}

	<!-- The pad is drawn as SVG in its own pixel box, measured with
	     bind:clientWidth, so nothing writes a CSS position. -->
	<div
		bind:this={padEl}
		bind:clientWidth={width}
		bind:clientHeight={height}
		role="slider"
		tabindex={disabled ? -1 : 0}
		aria-label={label ?? '2D position pad'}
		aria-valuemin={minX}
		aria-valuemax={maxX}
		aria-valuenow={value.x}
		aria-valuetext="X {value.x}, Y {value.y}"
		aria-disabled={disabled || undefined}
		class="wfull frame-16-9 touch-none focus-theme {shape} {surface} {border} {shadow}"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		onkeydown={handleKeyDown}
		{...restProps}
	>
		{#if width > 0 && height > 0}
			<svg viewBox="0 0 {width} {height}" class="text-muted" aria-hidden="true">
				<!-- quarter grid -->
				{#each [0.25, 0.5, 0.75] as q (q)}
					<line x1={width * q} x2={width * q} y1="0" y2={height} stroke="currentColor" opacity="0.25" />
					<line x1="0" x2={width} y1={height * q} y2={height * q} stroke="currentColor" opacity="0.25" />
				{/each}
				<!-- crosshair through the puck -->
				<g class="text-secondary" stroke="currentColor" stroke-dasharray="4 4" opacity="0.6">
					<line x1={px} x2={px} y1="0" y2={height} />
					<line x1="0" x2={width} y1={py} y2={py} />
				</g>
				<!-- puck -->
				<circle cx={px} cy={py} r={isDragging ? 11 : 9} class={disabled ? 'text-muted' : 'text-theme'} fill="currentColor" />
				<circle cx={px} cy={py} r={isDragging ? 11 : 9} class="text-white" fill="none" stroke="currentColor" stroke-width="2" />
			</svg>
		{/if}
	</div>
</div>
