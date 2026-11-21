<!-- @component Freehand signature pad on a high-DPI canvas with pressure strokes, baseline guide, and PNG export. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luRotateCcw } from '@fractaldesign/icons/lucide';
	import type {  Shape, Size, Surface, TextColor  } from '../../../internal/tokens.js';
	import {
		getStroke,
		getSvgPathFromStroke,
		type SignaturePadPoint
	} from './signature-pad-stroke.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		paths?: string[];
		onPathsChange?: (paths: string[]) => void;
		onEnd?: (dataUrl: string) => void;
		lineWidth?: number;
		showClear?: boolean;
		showGuide?: boolean;
		shape?: Shape;
		surface?: Surface;
		size?: Size;
		textColor?: TextColor;
		disabled?: boolean;
		label?: string;
	}

	let {
		paths = $bindable([]),
		onPathsChange,
		onEnd,
		lineWidth = 2.5,
		showClear = true,
		showGuide = true,
		shape = 'modern',
		surface = 'elevated',
		size = 'h-sm',
		textColor = 'text-muted',
		disabled = false,
		label = 'Signature pad',
		class: className,
		...rest
	}: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let drawing = $state(false);
	let activePoints = $state<SignaturePadPoint[]>([]);

	function redraw() {
		const el = canvas;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const dpr = typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1;
		const w = Math.max(1, Math.round(rect.width));
		const h = Math.max(1, Math.round(rect.height));
		if (el.width !== w * dpr || el.height !== h * dpr) {
			el.width = w * dpr;
			el.height = h * dpr;
		}
		const ctx = el.getContext('2d');
		if (!ctx) return;

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = getComputedStyle(el).color || 'currentColor';

		for (const d of paths) {
			ctx.fill(new Path2D(d));
		}

		if (activePoints.length >= 2) {
			const outline = getStroke(activePoints, { size: lineWidth, simulatePressure: true });
			const livePath = getSvgPathFromStroke(outline);
			if (livePath) ctx.fill(new Path2D(livePath));
		}
	}

	$effect(() => {
		paths;
		activePoints;
		redraw();
	});

	function pointFromEvent(event: PointerEvent): SignaturePadPoint {
		const rect = canvas!.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
			pressure: event.pressure || undefined
		};
	}

	function handlePointerDown(event: PointerEvent) {
		if (disabled || !canvas || event.button > 0) return;
		canvas.setPointerCapture(event.pointerId);
		drawing = true;
		activePoints = [pointFromEvent(event)];
	}

	function handlePointerMove(event: PointerEvent) {
		if (!drawing || disabled) return;
		activePoints = [...activePoints, pointFromEvent(event)];
	}

	function finishStroke() {
		if (!drawing) return;
		drawing = false;
		if (activePoints.length >= 2) {
			const outline = getStroke(activePoints, { size: lineWidth, simulatePressure: true });
			const path = getSvgPathFromStroke(outline);
			if (path) {
				paths = [...paths, path];
				onPathsChange?.(paths);
			}
		}
		activePoints = [];
		queueMicrotask(() => {
			if (canvas && paths.length > 0) {
				onEnd?.(canvas.toDataURL('image/png'));
			}
		});
	}

	function clear() {
		if (disabled) return;
		activePoints = [];
		paths = [];
		onPathsChange?.([]);
		onEnd?.('');
	}
</script>

<div
	class={[
		'relative frame-3-2 overflow-hidden',
		surface,
		shape,
		disabled && 'disabled',
		className
	]}
	{...rest}
>
	{#if showGuide}
		<div class="signature-guide" aria-hidden="true"></div>
	{/if}
	<canvas
		bind:this={canvas}
		aria-label={label}
		class="signature-canvas"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={finishStroke}
		onpointercancel={finishStroke}
	></canvas>
	{#if showClear && paths.length > 0 && !disabled}
		<button
			type="button"
			class={['button btn-icon ghost corner-tr', size, shape, textColor]}
			aria-label="Clear signature"
			onclick={clear}
		>
			<Icon icon={luRotateCcw} />
		</button>
	{/if}
</div>
