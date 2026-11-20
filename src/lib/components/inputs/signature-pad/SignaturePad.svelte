<!-- @component Freehand signature pad on a high-DPI canvas with pressure strokes, baseline guide, and PNG export. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luRotateCcw } from '@fractaldesign/icons/lucide';
	import type { Shape } from '../../../internal/tokens.js';
	import {
		getStroke,
		getSvgPathFromStroke,
		type SignaturePadPoint
	} from './signature-pad-stroke.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Recorded SVG path strings for each completed stroke; bindable. */
		paths?: string[];
		/** Called whenever the stroke list updates (draw or clear). */
		onPathsChange?: (paths: string[]) => void;
		/** Called after lifting the pointer with a PNG data URL of the signature. */
		onEnd?: (dataUrl: string) => void;
		/** Nominal stroke width multiplier. */
		lineWidth?: number;
		/** Show a clear action button in the top-right corner when ink exists. */
		showClear?: boolean;
		/** Draw a dashed signature baseline guide inside the pad. */
		showGuide?: boolean;
		/** Corner shape. */
		shape?: Shape;
		/** Disables drawing and clearing. */
		disabled?: boolean;
		/** Accessible label describing what is being signed. */
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
		'relative frame-3-2 bg-surface border overflow-hidden',
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
			class="button btn-icon ghost h-sm modern corner-tr text-muted"
			aria-label="Clear signature"
			onclick={clear}
		>
			<Icon icon={luRotateCcw} />
		</button>
	{/if}
</div>
