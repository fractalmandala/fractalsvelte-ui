<!-- @component Animated shimmer placeholder for loading states with line count, dimensions, and shape. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Shape } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Width of the skeleton item (e.g. '100%', '8rem'). */
		width?: string;
		/** Height of the skeleton item (e.g. '1rem', '2.5rem'). */
		height?: string;
		/** Render as a circular avatar or icon placeholder. */
		circle?: boolean;
		/** Number of skeleton line blocks to stack. */
		lines?: number;
		shape?: Shape;
		class?: string;
	}

	let {
		width = '100%',
		height = '1rem',
		circle = false,
		lines = 1,
		shape = 'min',
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<div
	aria-hidden="true"
	class="skeleton-wrap box gap-xs {className}"
	{...restProps}
>
	{#each { length: lines }, i (i)}
		<div
			class="skeleton-bar {shape} {circle ? 'is-circle' : ''}"
			style:width={lines > 1 && i === lines - 1 && !circle ? '60%' : width}
			style:height={circle ? width : height}
		></div>
	{/each}
</div>

<style>
	.skeleton-wrap {
		width: 100%;
	}

	.skeleton-bar {
		background: linear-gradient(
			90deg,
			var(--bg-sunken, #f0f0f0) 25%,
			var(--bg-extra, #e4e4e4) 50%,
			var(--bg-sunken, #f0f0f0) 75%
		);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s ease-in-out infinite;
	}

	.skeleton-bar.is-circle {
		border-radius: 9999px !important;
	}

	@keyframes skeleton-shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-bar {
			animation: none;
		}
	}
</style>
