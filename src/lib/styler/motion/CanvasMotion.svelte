<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FsTone } from '../types';
	import { FRAME, TONE_TEXT, type FsRatio } from '../classes';
	import { inkOf } from './ink';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		particleCount?: number;
		tone?: FsTone;
		maxDistance?: number;
		speed?: number;
		interactive?: boolean;
		/** Box shape: one of fractalstyler's .frame-* ratios */
		ratio?: FsRatio;
		class?: string;
	}

	let {
		particleCount = 45,
		tone = 'theme',
		maxDistance = 110,
		speed = 0.6,
		interactive = true,
		ratio = '16/9',
		class: className = '',
		...restProps
	}: Props = $props();

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// Drawing on a canvas is not styling: the canvas fills a .frame-* box
	// (.full), its pixel buffer is sized from that box, and the ink is read from
	// the canvas's own .text-* class.
	$effect(() => {
		if (!canvasEl) return;
		const canvas = canvasEl;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		let w = 0;
		let h = 0;
		let raf = 0;
		const mouse = { x: -1, y: -1 };
		let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

		// The box can change size after mount (late stylesheet, responsive grid):
		// particles are rescaled with it so the field always fills the canvas.
		const resize = () => {
			const nw = canvas.clientWidth;
			const nh = canvas.clientHeight;
			if (!nw || !nh) return;
			if (w && h) {
				for (const p of particles) {
					p.x *= nw / w;
					p.y *= nh / h;
				}
			}
			w = nw;
			h = nh;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		particles = Array.from({ length: particleCount }, () => ({
			x: Math.random() * (w || 1),
			y: Math.random() * (h || 1),
			vx: (Math.random() - 0.5) * speed,
			vy: (Math.random() - 0.5) * speed,
			r: Math.random() * 1.5 + 1
		}));
		if (!w || !h) w = h = 1;
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		const move = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			mouse.x = e.clientX - r.left;
			mouse.y = e.clientY - r.top;
		};
		const leave = () => (mouse.x = mouse.y = -1);
		if (interactive) {
			canvas.addEventListener('pointermove', move);
			canvas.addEventListener('pointerleave', leave);
		}

		const frame = () => {
			const ink = inkOf(canvas);
			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = ink;
			ctx.strokeStyle = ink;
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > w) p.vx *= -1;
				if (p.y < 0 || p.y > h) p.vy *= -1;
				ctx.globalAlpha = 0.6;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
				const links: [number, number, number][] = [];
				if (interactive && mouse.x >= 0) links.push([mouse.x, mouse.y, maxDistance * 1.2]);
				for (let j = i + 1; j < particles.length; j++) links.push([particles[j].x, particles[j].y, maxDistance]);
				for (const [lx, ly, max] of links) {
					const d = Math.hypot(p.x - lx, p.y - ly);
					if (d >= max) continue;
					ctx.globalAlpha = 0.25 * (1 - d / max);
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(lx, ly);
					ctx.stroke();
				}
			}
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			canvas.removeEventListener('pointermove', move);
			canvas.removeEventListener('pointerleave', leave);
		};
	});
</script>

<div class="wfull radius-md bg-sunken border {FRAME[ratio]} {className}" {...restProps}>
	<canvas bind:this={canvasEl} class="full {TONE_TEXT[tone]}" aria-hidden="true"></canvas>
</div>
