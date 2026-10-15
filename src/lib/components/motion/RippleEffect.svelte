<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		color?: string;
		duration?: number;
		center?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		color = 'rgba(255, 255, 255, 0.35)',
		duration = 600,
		center = false,
		class: className = '',
		children,
		onpointerdown,
		...restProps
	}: Props = $props();

	interface RippleItem {
		id: number;
		x: number;
		y: number;
		size: number;
	}

	let ripples = $state<RippleItem[]>([]);
	let rippleCounter = 0;

	function handlePointerDown(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		let x: number;
		let y: number;

		if (center) {
			x = width / 2;
			y = height / 2;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		const radius = Math.max(
			Math.hypot(x, y),
			Math.hypot(width - x, y),
			Math.hypot(x, height - y),
			Math.hypot(width - x, height - y)
		);
		const size = radius * 2;
		const id = ++rippleCounter;

		ripples = [...ripples, { id, x, y, size }];

		setTimeout(() => {
			ripples = ripples.filter((r) => r.id !== id);
		}, duration);

		onpointerdown?.(e);
	}
</script>

<div
	class="f-ripple-wrapper {className}"
	style="--ripple-color: {color}; --ripple-duration: {duration}ms;"
	onpointerdown={handlePointerDown}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}

	<div class="f-ripple-plane" aria-hidden="true">
		{#each ripples as r (r.id)}
			<span
				class="f-ripple-wave"
				style="left: {r.x}px; top: {r.y}px; width: {r.size}px; height: {r.size}px;"
			></span>
		{/each}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-ripple-wrapper {
			position: relative;
			overflow: hidden;
			display: inline-block;
			cursor: pointer;
			user-select: none;
		}

		.f-ripple-plane {
			position: absolute;
			inset: 0;
			pointer-events: none;
			overflow: hidden;
			border-radius: inherit;
			z-index: 10;
		}

		.f-ripple-wave {
			position: absolute;
			border-radius: var(--f-radius-full);
			background: radial-gradient(circle, var(--ripple-color) 0%, transparent 70%);
			transform: translate(-50%, -50%) scale(0);
			animation: f-ripple-anim var(--ripple-duration) cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
			pointer-events: none;
		}

		@keyframes f-ripple-anim {
			0% {
				transform: translate(-50%, -50%) scale(0);
				opacity: 1;
			}
			100% {
				transform: translate(-50%, -50%) scale(1);
				opacity: 0;
			}
		}
	}
</style>
