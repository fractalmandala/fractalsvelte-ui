<script lang="ts">
	import type { HTMLCanvasAttributes } from 'svelte/elements';

	interface Props extends HTMLCanvasAttributes {
		particleCount?: number;
		duration?: number;
		colors?: string[];
		class?: string;
	}

	let {
		particleCount = 50,
		duration = 2000,
		colors = ['#10b981', '#6366f1', '#fbbf24', '#f43f5e', '#3b82f6', '#ec4899'],
		class: className = '',
		...restProps
	}: Props = $props();

	let canvasEl: HTMLCanvasElement | undefined = $state();

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		rotation: number;
		vRot: number;
		alpha: number;
	}

	export function burst() {
		if (!canvasEl) return;
		const canvas = canvasEl;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.scale(dpr, dpr);

		const originX = rect.width / 2;
		const originY = rect.height / 2;

		const particles: Particle[] = [];
		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 8 + 3;
			particles.push({
				x: originX,
				y: originY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 3,
				size: Math.random() * 6 + 4,
				color: colors[Math.floor(Math.random() * colors.length)],
				rotation: Math.random() * 360,
				vRot: (Math.random() - 0.5) * 15,
				alpha: 1
			});
		}

		const startTime = Date.now();

		function frame() {
			if (!ctx) return;
			const elapsed = Date.now() - startTime;
			if (elapsed > duration) {
				ctx.clearRect(0, 0, rect.width, rect.height);
				return;
			}

			ctx.clearRect(0, 0, rect.width, rect.height);
			const progress = elapsed / duration;

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.2; // gravity
				p.rotation += p.vRot;
				p.alpha = Math.max(0, 1 - progress);

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate((p.rotation * Math.PI) / 180);
				ctx.globalAlpha = p.alpha;
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
				ctx.restore();
			}

			requestAnimationFrame(frame);
		}

		requestAnimationFrame(frame);
	}
</script>

<canvas
	bind:this={canvasEl}
	class="f-confetti-canvas {className}"
	{...restProps}
></canvas>

<style>
	@layer fractalsvelte-ui.components {
		.f-confetti-canvas {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 100;
		}
	}
</style>
