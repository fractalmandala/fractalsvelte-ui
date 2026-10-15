<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		spotlightColor?: string;
		radius?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		spotlightColor = 'rgba(99, 102, 241, 0.25)',
		radius = 300,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let cardEl: HTMLDivElement | undefined = $state();
	let mouseX = $state(-1000);
	let mouseY = $state(-1000);
	let isHovered = $state(false);

	function handlePointerMove(e: PointerEvent) {
		if (!cardEl) return;
		const rect = cardEl.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		isHovered = true;
	}

	function handlePointerLeave() {
		isHovered = false;
	}
</script>

<div
	bind:this={cardEl}
	class="f-spotlight-card {className}"
	onpointermove={handlePointerMove}
	onpointerleave={handlePointerLeave}
	{...restProps}
>
	<!-- Border spotlight -->
	<div
		class="f-spotlight-border"
		style="
			opacity: {isHovered ? 1 : 0};
			background: radial-gradient({radius}px circle at {mouseX}px {mouseY}px, var(--f-primary, #6366f1) 0%, transparent 70%);
		"
		aria-hidden="true"
	></div>

	<!-- Inner surface spotlight -->
	<div
		class="f-spotlight-surface"
		style="
			opacity: {isHovered ? 1 : 0};
			background: radial-gradient({radius}px circle at {mouseX}px {mouseY}px, {spotlightColor} 0%, transparent 70%);
		"
		aria-hidden="true"
	></div>

	<div class="f-spotlight-content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-spotlight-card {
			position: relative;
			border-radius: var(--f-radius-xl);
			background: var(--f-surface, #18181f);
			border: 1px solid var(--f-border);
			box-sizing: border-box;
			overflow: hidden;
			transition: border-color var(--f-duration-normal) var(--f-ease);
		}

		.f-spotlight-border {
			position: absolute;
			inset: -1px;
			border-radius: inherit;
			pointer-events: none;
			z-index: 1;
			transition: opacity var(--f-duration-fast) var(--f-ease);
		}

		.f-spotlight-surface {
			position: absolute;
			inset: 0;
			border-radius: inherit;
			pointer-events: none;
			z-index: 2;
			transition: opacity var(--f-duration-fast) var(--f-ease);
		}

		.f-spotlight-content {
			position: relative;
			z-index: 3;
			padding: 1.5rem;
			height: 100%;
			box-sizing: border-box;
		}
	}
</style>
