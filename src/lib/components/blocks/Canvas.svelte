<!-- @component High-DPI auto-resizing HTML5 canvas container with draw callback and aspect ratio. -->

<script lang="ts">
	import type { HTMLCanvasAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Surface, Border, Shape, Shadow } from '$lib/types.js';

	interface Props extends HTMLCanvasAttributes {
		/** Canvas 2D render callback invoked on mount and resize with device pixel ratio scaling. */
		draw?: (ctx: CanvasRenderingContext2D, size: { width: number; height: number }) => void;
		/** Aspect ratio string, e.g. '16 / 9' or '2 / 1'. */
		ratio?: string;
		label?: string;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		shadow?: Shadow;
		class?: string;
		children?: Snippet;
	}

	let {
		draw,
		ratio = '2 / 1',
		label,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow = 'shad-none',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let el: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (!el || !draw) return;
		const canvas = el;
		const render = () => {
			const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
			const { width, height } = canvas.getBoundingClientRect();
			if (width === 0 || height === 0) return;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			draw(ctx, { width, height });
		};

		render();
		const ro = new ResizeObserver(render);
		ro.observe(canvas);
		return () => ro.disconnect();
	});
</script>

<canvas
	bind:this={el}
	role={label ? 'img' : undefined}
	aria-label={label}
	class="canvas-box {surface} {border} {shape} {shadow} {className}"
	style:aspect-ratio={ratio}
	{...restProps}
>{@render children?.()}</canvas>

<style>
	.canvas-box {
		display: block;
		width: 100%;
		max-width: 100%;
	}
</style>
