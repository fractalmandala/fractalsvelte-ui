<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		gridType?: 'dots' | 'lines' | 'crosses';
		gridSize?: number;
		zoom?: number;
		panX?: number;
		panY?: number;
		minZoom?: number;
		maxZoom?: number;
		interactive?: boolean;
		class?: string;
		children?: Snippet;
		controls?: Snippet;
	}

	let {
		gridType = 'dots',
		gridSize = 24,
		zoom = $bindable(1),
		panX = $bindable(0),
		panY = $bindable(0),
		minZoom = 0.2,
		maxZoom = 2.5,
		interactive = true,
		class: className = '',
		children,
		controls,
		...restProps
	}: Props = $props();

	let isPanning = $state(false);
	let startPointer = { x: 0, y: 0 };
	let startPan = { x: 0, y: 0 };

	function handlePointerDown(e: PointerEvent) {
		if (!interactive) return;
		if (e.button !== 0 && e.button !== 1) return; // Only primary or middle click
		// Ignore if pointer down originates from inside a node
		const target = e.target as HTMLElement;
		if (target.closest('.f-workflow-node') || target.closest('.f-canvas-controls')) return;

		isPanning = true;
		startPointer = { x: e.clientX, y: e.clientY };
		startPan = { x: panX, y: panY };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isPanning) return;
		const dx = e.clientX - startPointer.x;
		const dy = e.clientY - startPointer.y;
		panX = startPan.x + dx;
		panY = startPan.y + dy;
	}

	function handlePointerUp(e: PointerEvent) {
		if (isPanning) {
			isPanning = false;
			try {
				(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			} catch {}
		}
	}

	function handleWheel(e: WheelEvent) {
		if (!interactive) return;
		e.preventDefault();
		const zoomDelta = -e.deltaY * 0.0015;
		const newZoom = Math.min(maxZoom, Math.max(minZoom, zoom + zoomDelta));
		zoom = Number(newZoom.toFixed(3));
	}

	function zoomIn() {
		zoom = Math.min(maxZoom, Number((zoom + 0.15).toFixed(3)));
	}

	function zoomOut() {
		zoom = Math.max(minZoom, Number((zoom - 0.15).toFixed(3)));
	}

	function resetView() {
		zoom = 1;
		panX = 0;
		panY = 0;
	}

	const scaledGridSize = $derived(gridSize * zoom);
	const backgroundPosition = $derived(`${panX}px ${panY}px`);
</script>

<div
	class="f-flow-canvas {className}"
	data-grid={gridType}
	data-panning={isPanning ? 'true' : undefined}
	style="--scaled-grid: {scaledGridSize}px; --bg-pos: {backgroundPosition};"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onwheel={handleWheel}
	{...restProps}
>
	<div
		class="f-flow-viewport"
		style="transform: translate({panX}px, {panY}px) scale({zoom});"
	>
		{#if children}
			{@render children()}
		{/if}
	</div>

	<div class="f-canvas-controls" aria-label="Canvas Zoom Controls">
		{#if controls}
			{@render controls()}
		{:else}
			<button class="f-ctrl-btn" onclick={zoomIn} title="Zoom In" aria-label="Zoom in">
				+
			</button>
			<span class="f-ctrl-label">{Math.round(zoom * 100)}%</span>
			<button class="f-ctrl-btn" onclick={zoomOut} title="Zoom Out" aria-label="Zoom out">
				−
			</button>
			<button class="f-ctrl-btn f-reset-btn" onclick={resetView} title="Reset View" aria-label="Reset view">
				Reset
			</button>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-flow-canvas {
			position: relative;
			width: 100%;
			height: 100%;
			min-height: 24rem;
			overflow: hidden;
			background-color: var(--f-bg);
			touch-action: none;
			user-select: none;
			cursor: grab;
		}

		.f-flow-canvas[data-panning='true'] {
			cursor: grabbing;
		}

		/* Dot Grid */
		.f-flow-canvas[data-grid='dots'] {
			background-image: radial-gradient(var(--f-border-strong) 1px, transparent 1px);
			background-size: var(--scaled-grid) var(--scaled-grid);
			background-position: var(--bg-pos);
		}

		/* Line Grid */
		.f-flow-canvas[data-grid='lines'] {
			background-image:
				linear-gradient(to right, var(--f-border-subtle) 1px, transparent 1px),
				linear-gradient(to bottom, var(--f-border-subtle) 1px, transparent 1px);
			background-size: var(--scaled-grid) var(--scaled-grid);
			background-position: var(--bg-pos);
		}

		/* Crosses Grid */
		.f-flow-canvas[data-grid='crosses'] {
			background-image:
				radial-gradient(circle, var(--f-border-strong) 1.5px, transparent 1.5px);
			background-size: var(--scaled-grid) var(--scaled-grid);
			background-position: var(--bg-pos);
		}

		.f-flow-viewport {
			position: absolute;
			inset: 0;
			transform-origin: 0 0;
			will-change: transform;
			pointer-events: auto;
		}

		.f-canvas-controls {
			position: absolute;
			bottom: var(--f-space-lg);
			right: var(--f-space-lg);
			display: flex;
			align-items: center;
			gap: 0.25rem;
			background: var(--f-panel);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-full);
			padding: 0.25rem;
			box-shadow: var(--f-shadow-md);
			z-index: 50;
		}

		.f-ctrl-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1.75rem;
			height: 1.75rem;
			border: none;
			background: transparent;
			color: var(--f-text);
			border-radius: var(--f-radius-full);
			cursor: pointer;
			font-weight: 600;
			font-size: var(--f-text-base);
			line-height: 1;
			transition: background-color var(--f-duration-fast) var(--f-ease);
		}

		.f-ctrl-btn:hover {
			background: var(--f-hover);
		}

		.f-ctrl-btn.f-reset-btn {
			width: auto;
			padding: 0 0.5rem;
			font-size: var(--f-text-xs);
			font-weight: 500;
		}

		.f-ctrl-label {
			font-size: var(--f-text-xs);
			font-family: var(--f-font-mono);
			color: var(--f-text-muted);
			padding: 0 0.25rem;
			min-width: 2.75rem;
			text-align: center;
		}
	}
</style>
