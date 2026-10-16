<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		glowColor?: string;
		glowSize?: number;
		borderWidth?: number;
		background?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		glowColor = 'rgba(16, 185, 129, 0.4)',
		glowSize = 300,
		borderWidth = 1,
		background = 'var(--f-surface)',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let mouseX = $state(-1000);
	let mouseY = $state(-1000);
	let isHovered = $state(false);

	function handlePointerMove(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		const rect = e.currentTarget.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	}

	function handlePointerEnter() {
		isHovered = true;
	}

	function handlePointerLeave() {
		isHovered = false;
		mouseX = -1000;
		mouseY = -1000;
	}
</script>

<div
	class="f-glow-card {className}"
	data-hovered={isHovered ? 'true' : undefined}
	style="--glow-x: {mouseX}px; --glow-y: {mouseY}px; --glow-color: {glowColor}; --glow-size: {glowSize}px; --glow-border-width: {borderWidth}px; --glow-bg: {background};"
	onpointermove={handlePointerMove}
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	{...restProps}
>
	<div class="f-glow-border" aria-hidden="true"></div>
	<div class="f-glow-inner">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-glow-card {
			position: relative;
			border-radius: var(--f-radius-lg);
			background: var(--f-border);
			padding: var(--glow-border-width);
			overflow: hidden;
			isolation: isolate;
			transition: box-shadow var(--f-duration-normal) var(--f-ease);
		}

		.f-glow-border {
			position: absolute;
			inset: 0;
			border-radius: inherit;
			pointer-events: none;
			z-index: 1;
			opacity: 0;
			transition: opacity var(--f-duration-normal) var(--f-ease);
			background: radial-gradient(
				var(--glow-size) circle at var(--glow-x) var(--glow-y),
				var(--glow-color),
				transparent 70%
			);
		}

		.f-glow-card[data-hovered='true'] .f-glow-border {
			opacity: 1;
		}

		.f-glow-card[data-hovered='true'] {
			box-shadow: 0 0 25px -5px var(--glow-color);
		}

		.f-glow-inner {
			position: relative;
			z-index: 2;
			border-radius: calc(var(--f-radius-lg) - var(--glow-border-width));
			background: var(--glow-bg);
			height: 100%;
			width: 100%;
			overflow: hidden;
		}
	}
</style>
