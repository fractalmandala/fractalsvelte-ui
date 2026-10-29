<!-- @component A grid of lines that turn to point at the pointer. -->

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { MessageText } from '../types';

	interface Props extends SVGAttributes<SVGSVGElement> {
		rows?: number;
		columns?: number;
		tone?: MessageText;
		/** Stroke width in grid units (each cell is 10) */
		lineWidth?: number;
		/** Line length in grid units */
		lineLength?: number;
		class?: string;
	}

	let {
		rows = 7,
		columns = 7,
		tone,
		lineWidth = 1,
		lineLength = 6,
		class: className = '',
		...restProps
	}: Props = $props();

	let svgEl = $state<SVGSVGElement | null>(null);
	// Pointer in viewBox units; null until the pointer arrives.
	let pointer = $state<{ x: number; y: number } | null>(null);

	function onpointermove(e: PointerEvent) {
		if (!svgEl) return;
		const r = svgEl.getBoundingClientRect();
		pointer = { x: ((e.clientX - r.left) / r.width) * columns * 10, y: ((e.clientY - r.top) / r.height) * rows * 10 };
	}

	// Each line turns toward the pointer through its own transform attribute.
	function angle(cx: number, cy: number) {
		if (!pointer) return -45;
		return (Math.atan2(pointer.y - cy, pointer.x - cx) * 180) / Math.PI;
	}
</script>

<svg
	bind:this={svgEl}
	viewBox="0 0 {columns * 10} {rows * 10}"
	class="wfull {tone ?? 'text-theme'} {className}"
	role="img"
	aria-label="Magnetic field visualization"
	{onpointermove}
	{...restProps}
>
	{#each Array.from({ length: rows * columns }) as _, i (i)}
		{@const cx = (i % columns) * 10 + 5}
		{@const cy = Math.floor(i / columns) * 10 + 5}
		<line
			x1={cx - lineLength / 2}
			y1={cy}
			x2={cx + lineLength / 2}
			y2={cy}
			stroke="currentColor"
			stroke-width={lineWidth}
			stroke-linecap="round"
			transform="rotate({angle(cx, cy)} {cx} {cy})"
		/>
	{/each}
</svg>
