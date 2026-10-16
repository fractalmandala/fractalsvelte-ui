<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		active?: boolean;
		duration?: number;
		angle?: number;
		color?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		active = true,
		duration = 2,
		angle = 45,
		color = 'rgba(255, 255, 255, 0.12)',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-shimmer-wrap {className}"
	data-active={active ? 'true' : undefined}
	style="--shimmer-duration: {duration}s; --shimmer-angle: {angle}deg; --shimmer-color: {color};"
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}

	{#if active}
		<div class="f-shimmer-sweep" aria-hidden="true"></div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-shimmer-wrap {
			position: relative;
			overflow: hidden;
			display: inline-block;
			width: 100%;
		}

		.f-shimmer-sweep {
			position: absolute;
			inset: 0;
			pointer-events: none;
			z-index: 5;
			background: linear-gradient(
				var(--shimmer-angle),
				transparent 0%,
				transparent 35%,
				var(--shimmer-color) 50%,
				transparent 65%,
				transparent 100%
			);
			background-size: 250% 250%;
			animation: f-shimmer-anim var(--shimmer-duration) infinite linear;
		}

		@keyframes f-shimmer-anim {
			0% {
				background-position: 200% 0;
			}
			100% {
				background-position: -200% 0;
			}
		}
	}
</style>
