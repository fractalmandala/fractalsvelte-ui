<script lang="ts">
	import type { HTMLCanvasAttributes } from 'svelte/elements';

	interface Props extends HTMLCanvasAttributes {
		particleCount?: number;
		particleColor?: string;
		lineColor?: string;
		maxDistance?: number;
		speed?: number;
		interactive?: boolean;
		class?: string;
	}

	let {
		particleCount = 45,
		particleColor = 'rgba(16, 185, 129, 0.5)',
		lineColor = 'rgba(16, 185, 129, 0.15)',
		maxDistance = 110,
		speed = 0.6,
		interactive = true,
		class: className = '',
		...restProps
	}: Props = $props();

	let canvasEl: HTMLCanvasElement;

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
	}

	$effect(() => {
		if (!canvasEl) return;
		const canvas = canvasEl;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animId: number;
		let width = 0;
		let height = 0;
		let particles: Particle[] = [];
		let mouse = { x: -1000, y: -1000 };

		function resize() {
			const rect = canvas.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			ctx?.scale(dpr, dpr);
		}

		function initParticles() {
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * speed,
					vy: (Math.random() - 0.5) * speed,
					radius: Math.random() * 1.5 + 1
				});
			}
		}

		resize();
		initParticles();

		const resizeObserver = new ResizeObserver(() => {
			resize();
		});
		resizeObserver.observe(canvas);

		function onPointerMove(e: PointerEvent) {
			if (!interactive) return;
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		}

		function onPointerLeave() {
			mouse.x = -1000;
			mouse.y = -1000;
		}

		canvas.addEventListener('pointermove', onPointerMove);
		canvas.addEventListener('pointerleave', onPointerLeave);

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);

			// Draw particles and update positions
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < 0 || p.x > width) p.vx *= -1;
				if (p.y < 0 || p.y > height) p.vy *= -1;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = particleColor;
				ctx.fill();

				// Distance to mouse
				if (interactive && mouse.x > 0 && mouse.y > 0) {
					const dxM = p.x - mouse.x;
					const dyM = p.y - mouse.y;
					const distM = Math.hypot(dxM, dyM);
					if (distM < maxDistance * 1.2) {
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(mouse.x, mouse.y);
						ctx.strokeStyle = lineColor;
						ctx.lineWidth = 1 - distM / (maxDistance * 1.2);
						ctx.stroke();
					}
				}

				// Connect nearby particles
				for (let j = i + 1; j < particles.length; j++) {
					const p2 = particles[j];
					const dx = p.x - p2.x;
					const dy = p.y - p2.y;
					const dist = Math.hypot(dx, dy);

					if (dist < maxDistance) {
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(p2.x, p2.y);
						ctx.strokeStyle = lineColor;
						ctx.lineWidth = (1 - dist / maxDistance) * 0.8;
						ctx.stroke();
					}
				}
			}

			animId = requestAnimationFrame(animate);
		}

		animId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animId);
			resizeObserver.disconnect();
			canvas.removeEventListener('pointermove', onPointerMove);
			canvas.removeEventListener('pointerleave', onPointerLeave);
		};
	});
</script>

<canvas
	bind:this={canvasEl}
	class="f-canvas-motion {className}"
	{...restProps}
></canvas>

<style>
	@layer fractalsvelte-ui.components {
		.f-canvas-motion {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			pointer-events: auto;
			display: block;
		}
	}
</style>
