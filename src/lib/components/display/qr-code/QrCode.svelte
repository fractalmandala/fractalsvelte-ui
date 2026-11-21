<!-- @component Renders a deterministic QR code matrix onto a high-DPI canvas with optional center overlay. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  AlignContent, Pad, Shape, Surface, TextColor, TextSize  } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { qrEncode, type QrCodeEcc } from './qr-encode.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value: string;
		ecc?: QrCodeEcc;
		pixelSize?: number;
		quietZone?: number;
		shape?: Shape;
		label?: string;
		alignContent?: AlignContent;
		overlay?: Snippet;
		surface?: Surface;
		overlaySurface?: Surface;
		textSize?: TextSize;
		textColor?: TextColor;
	}

	let {
		value,
		ecc = 'M',
		pixelSize = 4,
		quietZone = 2,
		shape = 'modern',
		label,
		alignContent = 'xcenter',
		overlay,
		surface = 'elevated',
		overlaySurface = 'elevated',
		textSize = 'text-xs',
		textColor = 'text-danger',
		class: className,
		...rest
	}: Props = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);

	const encoded = $derived.by(() => {
		try {
			return { matrix: qrEncode(value || ' ', { ecc, border: quietZone, boostEcc: true }), error: '' };
		} catch (e) {
			return { matrix: null, error: e instanceof Error ? e.message : 'Unable to encode' };
		}
	});

	const logicalSize = $derived(encoded.matrix ? encoded.matrix.size * pixelSize : 120);

	$effect(() => {
		const el = canvas;
		const matrix = encoded.matrix;
		if (!el || !matrix) return;

		const size = matrix.size * pixelSize;
		const dpr = typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1;
		el.width = size * dpr;
		el.height = size * dpr;

		const ctx = el.getContext('2d');
		if (!ctx) return;

		const cs = getComputedStyle(el);
		const bg = cs.backgroundColor;
		const fg = cs.color || 'currentColor';

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		if (bg) {
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, size, size);
		}

		ctx.fillStyle = fg;
		for (let r = 0; r < matrix.size; r++) {
			for (let c = 0; c < matrix.size; c++) {
				if (matrix.data[r][c]) {
					ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
				}
			}
		}
	});
</script>

<div
	role="img"
	aria-label={label ?? `QR code for ${value}`}
	class={['relative inline-flex row ycenter overflow-hidden', alignContent, surface, shape, className]}
	{...rest}
>
	{#if encoded.error}
		<div class={['pad-md', textSize, textColor]}>{encoded.error}</div>
	{:else}
		<canvas
			bind:this={canvas}
			class="block wvar square"
			{@attach vars({ w: `${logicalSize}px` })}
		></canvas>
		{#if overlay}
			<div class="cover row xcenter ycenter pointer-none">
				<div class={[overlaySurface, 'pad-xs', shape]}>
					{@render overlay()}
				</div>
			</div>
		{/if}
	{/if}
</div>
