<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from 'fractalicons';
	import { luPlus, luMinus, luRotateCcw } from 'fractalicons/lucide';
	import type { FsRatio } from '../classes';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		gridType?: 'dots' | 'lines' | 'crosses';
		/** Grid pitch in canvas px at zoom 1 */
		gridSize?: number;
		zoom?: number;
		panX?: number;
		panY?: number;
		minZoom?: number;
		maxZoom?: number;
		interactive?: boolean;
		/** Box shape (width / height) */
		ratio?: FsRatio;
		/** Size of the content plane, in canvas px */
		planeWidth?: number;
		planeHeight?: number;
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
		ratio = '16/9',
		planeWidth = 1600,
		planeHeight = 1000,
		class: className = '',
		children,
		controls,
		...restProps
	}: Props = $props();

	const uid = $props.id();
	let width = $state(0);
	const height = $derived.by(() => {
		const [a, b] = ratio.split('/').map(Number);
		return Math.round((width * b) / a);
	});
	let panning = $state(false);
	let start = { x: 0, y: 0, px: 0, py: 0 };

	// Pan and zoom are one SVG transform attribute on the group holding a
	// <foreignObject>; the HTML nodes inside it move with the plane. The grid is
	// an SVG pattern carried by the same transform.
	const transform = $derived(`translate(${panX} ${panY}) scale(${zoom})`);

	function onpointerdown(e: PointerEvent) {
		if (!interactive || (e.button !== 0 && e.button !== 1)) return;
		if ((e.target as Element).closest('[data-flow-node], [data-flow-controls]')) return;
		panning = true;
		start = { x: e.clientX, y: e.clientY, px: panX, py: panY };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onpointermove(e: PointerEvent) {
		if (!panning) return;
		panX = start.px + e.clientX - start.x;
		panY = start.py + e.clientY - start.y;
	}

	function onwheel(e: WheelEvent) {
		if (!interactive) return;
		e.preventDefault();
		zoom = Number(Math.min(maxZoom, Math.max(minZoom, zoom - e.deltaY * 0.0015)).toFixed(3));
	}

	const zoomBy = (d: number) => (zoom = Number(Math.min(maxZoom, Math.max(minZoom, zoom + d)).toFixed(3)));
	function reset() {
		zoom = 1;
		panX = 0;
		panY = 0;
	}
</script>

<!-- The SVG is sized by its own viewBox (kept 1:1 with the measured width, so
     nothing inside scales), and .box.ybot.xright parks the controls — an
     .absolute child with no offsets — in the bottom-right corner. A .frame-*
     box is avoided on purpose: its rule stretches every descendant <svg>,
     which would include icons inside the nodes. -->
<div
	bind:clientWidth={width}
	class="relative box ybot xright wfull bg-sunken border radius-md {className}"
	role="application"
	aria-label="Flow canvas"
	{onpointerdown}
	{onpointermove}
	onpointerup={() => (panning = false)}
	onpointercancel={() => (panning = false)}
	{onwheel}
	{...restProps}
>
	<svg viewBox="0 0 {width || 1} {height || 1}" class="wfull text-muted" aria-hidden={children ? undefined : 'true'}>
		<defs>
			<pattern id="{uid}-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
				{#if gridType === 'dots'}
					<circle cx={gridSize / 2} cy={gridSize / 2} r="1" fill="currentColor" opacity="0.6" />
				{:else if gridType === 'lines'}
					<path d="M {gridSize} 0 L 0 0 0 {gridSize}" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
				{:else}
					<path
						d="M {gridSize / 2 - 3} {gridSize / 2} h 6 M {gridSize / 2} {gridSize / 2 - 3} v 6"
						stroke="currentColor"
						stroke-width="1"
						opacity="0.6"
					/>
				{/if}
			</pattern>
		</defs>
		<g {transform}>
			<rect x={-planeWidth} y={-planeHeight} width={planeWidth * 3} height={planeHeight * 3} fill="url(#{uid}-grid)" />
			<foreignObject x="0" y="0" width={planeWidth} height={planeHeight}>
				<div class="row wrap ytop gap-xl pad-xl text-primary">
					{@render children?.()}
				</div>
			</foreignObject>
		</g>
	</svg>
	<div class="absolute ml-sm mb-sm mr-sm row ycenter gap-xs pad-xs bg-surface border shadow-md radius-md" data-flow-controls>
		{#if controls}
			{@render controls()}
		{:else}
			<button type="button" data-variant="iconbox" data-size="icon-bs" class="px-xs" aria-label="Zoom out" onclick={() => zoomBy(-0.15)}>
				<Icon icon={luMinus} />
			</button>
			<span class="text-sm mono text-secondary">{Math.round(zoom * 100)}%</span>
			<button type="button" data-variant="iconbox" data-size="icon-bs" class="px-xs" aria-label="Zoom in" onclick={() => zoomBy(0.15)}>
				<Icon icon={luPlus} />
			</button>
			<button type="button" data-variant="iconbox" data-size="icon-bs" class="px-xs" aria-label="Reset view" onclick={reset}>
				<Icon icon={luRotateCcw} />
			</button>
		{/if}
	</div>
</div>
