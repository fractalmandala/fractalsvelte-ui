<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		maxTilt?: number;
		perspective?: number;
		glare?: boolean;
		scale?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		maxTilt = 15,
		perspective = 1000,
		glare = true,
		scale = 1.02,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let rotateX = $state(0);
	let rotateY = $state(0);
	let currentScale = $state(1);
	let glareX = $state(50);
	let glareY = $state(50);
	let glareOpacity = $state(0);
	let isHovered = $state(false);

	function handlePointerMove(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const xPct = (mouseX / width) - 0.5;
		const yPct = (mouseY / height) - 0.5;

		rotateX = -(yPct * maxTilt * 2);
		rotateY = xPct * maxTilt * 2;
		currentScale = scale;

		if (glare) {
			glareX = (mouseX / width) * 100;
			glareY = (mouseY / height) * 100;
			glareOpacity = 0.35;
		}
	}

	function handlePointerEnter() {
		isHovered = true;
	}

	function handlePointerLeave() {
		isHovered = false;
		rotateX = 0;
		rotateY = 0;
		currentScale = 1;
		glareOpacity = 0;
	}
</script>

<div
	class="f-card-3d-wrap {className}"
	style="perspective: {perspective}px;"
	onpointermove={handlePointerMove}
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	{...restProps}
>
	<div
		class="f-card-3d-inner"
		data-hovered={isHovered ? 'true' : undefined}
		style="transform: rotateX({rotateX}deg) rotateY({rotateY}deg) scale3d({currentScale}, {currentScale}, {currentScale});"
	>
		{#if children}
			{@render children()}
		{/if}

		{#if glare}
			<div
				class="f-card-3d-glare"
				aria-hidden="true"
				style="opacity: {glareOpacity}; background: radial-gradient(circle at {glareX}% {glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%);"
			></div>
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-card-3d-wrap {
			position: relative;
			display: block;
			transform-style: preserve-3d;
		}

		.f-card-3d-inner {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: var(--f-radius-lg);
			background: var(--f-surface);
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-md);
			transform-style: preserve-3d;
			transition: transform var(--f-duration-normal) var(--f-ease-spring), box-shadow var(--f-duration-normal) var(--f-ease);
			overflow: hidden;
			will-change: transform;
		}

		.f-card-3d-inner[data-hovered='true'] {
			box-shadow: var(--f-shadow-xl), 0 20px 30px -10px rgba(0, 0, 0, 0.2);
			transition-duration: 60ms;
		}

		.f-card-3d-glare {
			position: absolute;
			inset: 0;
			pointer-events: none;
			z-index: 10;
			border-radius: inherit;
			transition: opacity var(--f-duration-normal) var(--f-ease);
			mix-blend-mode: overlay;
		}
	}
</style>
