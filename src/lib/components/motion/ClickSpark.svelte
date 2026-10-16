<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Spark {
		x: number;
		y: number;
		angle: number;
		startTime: number;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		sparkColor?: string;
		sparkCount?: number;
		sparkRadius?: number;
		sparkSize?: number;
		duration?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		sparkColor = 'var(--f-primary, #6366f1)',
		sparkCount = 8,
		sparkRadius = 18,
		sparkSize = 10,
		duration = 450,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();
	let sparks: Spark[] = [];
	let animId: number | null = null;

	function triggerSparks(e: MouseEvent) {
		if (!containerEl || !canvasEl) return;
		const rect = containerEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const now = performance.now();

		for (let i = 0; i < sparkCount; i++) {
			const angle = (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.4;
			sparks.push({ x, y, angle, startTime: now });
		}

		if (!animId) {
			animId = requestAnimationFrame(render);
		}
	}

	function render(time: number) {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

		sparks = sparks.filter((s) => time - s.startTime < duration);

		for (const spark of sparks) {
			const elapsed = time - spark.startTime;
			const progress = elapsed / duration;
			const easeProgress = Math.sin(progress * (Math.PI / 2)); // ease-out

			const dist = easeProgress * sparkRadius;
			const currentX = spark.x + Math.cos(spark.angle) * dist;
			const currentY = spark.y + Math.sin(spark.angle) * dist;

			const lineLength = sparkSize * (1 - progress);
			const startX = currentX - Math.cos(spark.angle) * lineLength;
			const startY = currentY - Math.sin(spark.angle) * lineLength;

			ctx.beginPath();
			ctx.strokeStyle = sparkColor;
			ctx.lineWidth = 2 * (1 - progress);
			ctx.lineCap = 'round';
			ctx.moveTo(startX, startY);
			ctx.lineTo(currentX, currentY);
			ctx.stroke();
		}

		if (sparks.length > 0) {
			animId = requestAnimationFrame(render);
		} else {
			animId = null;
		}
	}

	function updateCanvasSize() {
		if (containerEl && canvasEl) {
			const rect = containerEl.getBoundingClientRect();
			canvasEl.width = rect.width;
			canvasEl.height = rect.height;
		}
	}

	$effect(() => {
		updateCanvasSize();
	});
</script>

<svelte:window onresize={updateCanvasSize} />

<div
	bind:this={containerEl}
	class="f-click-spark-container {className}"
	onclick={triggerSparks}
	{...restProps}
>
	<canvas
		bind:this={canvasEl}
		class="f-spark-canvas"
		aria-hidden="true"
	></canvas>

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-click-spark-container {
			position: relative;
			display: inline-block;
			box-sizing: border-box;
		}

		.f-spark-canvas {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 10;
		}
	}
</style>
