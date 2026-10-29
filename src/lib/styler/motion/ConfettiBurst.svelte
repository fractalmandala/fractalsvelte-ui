<!-- @component A canvas that fires a burst of confetti. -->

<script lang="ts">
	import type { Frame } from '../types';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tokens, PALETTE_TOKENS } from './ink';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		particleCount?: number;
		/** ms */
		duration?: number;
		/** Colour tokens to draw with; defaults to the theme and status palette */
		colorTokens?: string[];
		ratio?: Frame;
		class?: string;
	}

	let {
		particleCount = 50,
		duration = 2000,
		colorTokens = PALETTE_TOKENS,
		ratio = 'frame-16-9',
		class: className = '',
		...restProps
	}: Props = $props();

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	/** Fire one burst from the centre of the box. */
	export function burst() {
		const canvas = canvasEl;
		const ctx = canvas?.getContext('2d');
		if (!canvas || !ctx) return;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const colors = tokens(canvas, colorTokens);
		const parts = Array.from({ length: particleCount }, () => {
			const a = Math.random() * Math.PI * 2;
			const v = Math.random() * 8 + 3;
			return {
				x: w / 2,
				y: h / 2,
				vx: Math.cos(a) * v,
				vy: Math.sin(a) * v - 3,
				size: Math.random() * 6 + 4,
				color: colors[Math.floor(Math.random() * colors.length)] ?? 'currentColor',
				rot: Math.random() * 360,
				vRot: (Math.random() - 0.5) * 15
			};
		});
		const t0 = performance.now();
		requestAnimationFrame(function frame(now) {
			const p = (now - t0) / duration;
			ctx.clearRect(0, 0, w, h);
			if (p >= 1) return;
			for (const c of parts) {
				c.x += c.vx;
				c.y += c.vy;
				c.vy += 0.2;
				c.rot += c.vRot;
				ctx.save();
				ctx.translate(c.x, c.y);
				ctx.rotate((c.rot * Math.PI) / 180);
				ctx.globalAlpha = 1 - p;
				ctx.fillStyle = c.color;
				ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
				ctx.restore();
			}
			requestAnimationFrame(frame);
		});
	}
</script>

<div class="wfull {ratio} {className}" {...restProps}>
	<canvas bind:this={canvasEl} class="full" aria-hidden="true"></canvas>
</div>
