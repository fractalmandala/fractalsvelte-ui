<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'surface' | 'glass' | 'raised' | 'outline';
		spotlight?: boolean;
		floating?: boolean;
		spotlightColor?: string;
		class?: string;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		variant = 'surface',
		spotlight = true,
		floating = true,
		spotlightColor = 'rgba(16, 185, 129, 0.15)',
		class: className = '',
		children,
		header,
		footer,
		...restProps
	}: Props = $props();

	let mouseX = $state(-1000);
	let mouseY = $state(-1000);
	let isHovered = $state(false);

	function handlePointerMove(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (!spotlight) return;
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
	class="f-animated-card {className}"
	data-variant={variant}
	data-floating={floating ? 'true' : undefined}
	data-hovered={isHovered ? 'true' : undefined}
	style="--spotlight-x: {mouseX}px; --spotlight-y: {mouseY}px; --spotlight-color: {spotlightColor};"
	onpointermove={handlePointerMove}
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	{...restProps}
>
	{#if spotlight}
		<div class="f-card-spotlight" aria-hidden="true"></div>
	{/if}

	{#if header}
		<header class="f-card-header">
			{@render header()}
		</header>
	{/if}

	{#if children}
		<div class="f-card-body">
			{@render children()}
		</div>
	{/if}

	{#if footer}
		<footer class="f-card-footer">
			{@render footer()}
		</footer>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-animated-card {
			position: relative;
			display: flex;
			flex-direction: column;
			border-radius: var(--f-radius-lg);
			border: 1px solid var(--f-border);
			overflow: hidden;
			transition:
				transform var(--f-duration-normal) var(--f-ease-spring),
				box-shadow var(--f-duration-normal) var(--f-ease),
				border-color var(--f-duration-normal) var(--f-ease);
			isolation: isolate;
		}

		/* Variants */
		.f-animated-card[data-variant='surface'] {
			background: var(--f-surface);
			box-shadow: var(--f-shadow-sm);
		}

		.f-animated-card[data-variant='raised'] {
			background: var(--f-raised);
			box-shadow: var(--f-shadow-md);
		}

		.f-animated-card[data-variant='outline'] {
			background: transparent;
			box-shadow: none;
		}

		.f-animated-card[data-variant='glass'] {
			background: rgba(255, 255, 255, 0.04);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			border-color: rgba(255, 255, 255, 0.1);
		}

		/* Floating hover lift */
		.f-animated-card[data-floating='true']:hover {
			transform: translateY(-5px);
			box-shadow: var(--f-shadow-xl), 0 0 24px rgba(0, 0, 0, 0.06);
			border-color: var(--f-border-strong);
		}

		/* Spotlight radial overlay */
		.f-card-spotlight {
			position: absolute;
			inset: 0;
			pointer-events: none;
			z-index: 0;
			opacity: 0;
			transition: opacity var(--f-duration-normal) var(--f-ease);
			background: radial-gradient(
				450px circle at var(--spotlight-x) var(--spotlight-y),
				var(--spotlight-color),
				transparent 80%
			);
		}

		.f-animated-card[data-hovered='true'] .f-card-spotlight {
			opacity: 1;
		}

		.f-card-header {
			position: relative;
			z-index: 1;
			padding: var(--f-space-lg) var(--f-space-xl);
			border-bottom: 1px solid var(--f-border-subtle);
		}

		.f-card-body {
			position: relative;
			z-index: 1;
			flex: 1 1 auto;
			padding: var(--f-space-xl);
		}

		.f-card-footer {
			position: relative;
			z-index: 1;
			padding: var(--f-space-md) var(--f-space-xl);
			border-top: 1px solid var(--f-border-subtle);
			background: var(--f-sunken);
		}
	}
</style>
