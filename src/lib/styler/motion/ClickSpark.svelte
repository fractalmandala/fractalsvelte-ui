<!-- @component Wraps content and throws sparks from each click. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { MessageText } from '../types';
	import { inkOf } from './ink';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: MessageText;
		sparkCount?: number;
		/** Travel distance in px */
		sparkRadius?: number;
		/** Streak length in px */
		sparkSize?: number;
		/** ms */
		duration?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		tone,
		sparkCount = 8,
		sparkRadius = 18,
		sparkSize = 10,
		duration = 450,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let sparks: { x: number; y: number; angle: number; t0: number }[] = [];
	let raf: number | null = null;

	function render(now: number) {
		const canvas = canvasEl;
		const ctx = canvas?.getContext('2d');
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = inkOf(canvas);
		ctx.lineCap = 'round';
		sparks = sparks.filter((s) => now - s.t0 < duration);
		for (const s of sparks) {
			const p = (now - s.t0) / duration;
			const dist = Math.sin((p * Math.PI) / 2) * sparkRadius;
			const len = sparkSize * (1 - p);
			const x2 = s.x + Math.cos(s.angle) * dist;
			const y2 = s.y + Math.sin(s.angle) * dist;
			ctx.lineWidth = 2 * (1 - p);
			ctx.beginPath();
			ctx.moveTo(x2 - Math.cos(s.angle) * len, y2 - Math.sin(s.angle) * len);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
		raf = sparks.length ? requestAnimationFrame(render) : null;
	}

	function onclick(e: MouseEvent & { currentTarget: HTMLDivElement }) {
		const canvas = canvasEl;
		if (!canvas) return;
		const rect = e.currentTarget.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		const now = performance.now();
		for (let i = 0; i < sparkCount; i++) {
			sparks.push({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				angle: (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.4,
				t0: now
			});
		}
		raf ??= requestAnimationFrame(render);
	}
</script>

<!-- Content first, then the spark canvas over it: .absolute.full at its static
     position covers a padding-free .relative host. -->
<div class="relative box {className}" role="presentation" {onclick} {...restProps}>
	<div class="box">{@render children?.()}</div>
	<canvas bind:this={canvasEl} class="absolute full {tone ?? 'text-theme'}" aria-hidden="true"></canvas>
</div>
