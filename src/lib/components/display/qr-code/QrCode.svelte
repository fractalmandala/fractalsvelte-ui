<!-- @component Renders a deterministic QR code matrix onto a high-DPI canvas with optional center overlay. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Shape } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';
	import { qrEncode, type QrCodeEcc } from './qr-encode.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Text or URL encoded in the QR symbol. */
		value: string;
		/** Reed–Solomon error correction level. */
		ecc?: QrCodeEcc;
		/** Logical pixel size per QR module. */
		pixelSize?: number;
		/** Blank margin modules around the symbol. */
		quietZone?: number;
		/** Corner shape around the QR container. */
		shape?: Shape;
		/** Accessible label describing the encoded destination. */
		label?: string;
		/** Optional centered logo or badge snippet (use high `ecc` like `'H'`). */
		overlay?: Snippet;
	}

	let {
		value,
		ecc = 'M',
		pixelSize = 4,
		quietZone = 2,
		shape = 'modern',
		label,
		overlay,
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
		const bg = cs.backgroundColor || 'white';
		const fg = cs.color || 'black';

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, size, size);

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
	class={['relative inline-flex row xcenter ycenter bg-surface border overflow-hidden', shape, className]}
	{...rest}
>
	{#if encoded.error}
		<div class="pad-md text-xs text-danger">{encoded.error}</div>
	{:else}
		<canvas
			bind:this={canvas}
			class="block wvar square bg-surface"
			{@attach vars({ w: `${logicalSize}px` })}
		></canvas>
		{#if overlay}
			<div class="cover row xcenter ycenter pointer-none">
				<div class="bg-surface pad-xs modern border-subtle">
					{@render overlay()}
				</div>
			</div>
		{/if}
	{/if}
</div>
