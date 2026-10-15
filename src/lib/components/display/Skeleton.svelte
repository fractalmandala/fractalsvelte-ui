<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
	export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: SkeletonVariant;
		animation?: SkeletonAnimation;
		width?: string | number;
		height?: string | number;
		lines?: number;
		class?: string;
	}

	let {
		variant = 'text',
		animation = 'shimmer',
		width,
		height,
		lines = 1,
		class: className = '',
		...restProps
	}: Props = $props();

	function formatDim(val: string | number | undefined): string | undefined {
		if (val === undefined) return undefined;
		return typeof val === 'number' ? `${val}px` : val;
	}

	const computedWidth = $derived(formatDim(width));
	const computedHeight = $derived(formatDim(height));
</script>

{#if variant === 'text' && lines > 1}
	<div
		class="f-skeleton-group {className}"
		aria-hidden="true"
		{...restProps}
	>
		{#each Array.from({ length: lines }) as _, i}
			<span
				class="f-skeleton"
				data-variant="text"
				data-animation={animation}
				style:width={i === lines - 1 && !width ? '70%' : computedWidth}
				style:height={computedHeight}
			></span>
		{/each}
	</div>
{:else}
	<span
		class="f-skeleton {className}"
		data-variant={variant}
		data-animation={animation}
		aria-hidden="true"
		style:width={computedWidth}
		style:height={computedHeight}
		{...(restProps as any)}
	></span>
{/if}

<style>
	@layer fractalsvelte-ui.components {
		.f-skeleton-group {
			display: flex;
			flex-direction: column;
			gap: var(--f-space-xs);
			width: 100%;
		}

		.f-skeleton {
			display: block;
			background: var(--f-sunken);
			position: relative;
			overflow: hidden;
			box-sizing: border-box;
		}

		/* Variants */
		.f-skeleton[data-variant='text'] {
			height: 1em;
			border-radius: var(--f-radius-xs);
			width: 100%;
		}

		.f-skeleton[data-variant='circular'] {
			border-radius: var(--f-radius-full);
			width: 40px;
			height: 40px;
			flex-shrink: 0;
		}

		.f-skeleton[data-variant='rectangular'] {
			border-radius: 0;
			width: 100%;
			height: 120px;
		}

		.f-skeleton[data-variant='rounded'] {
			border-radius: var(--f-radius-md);
			width: 100%;
			height: 120px;
		}

		/* Animations */
		.f-skeleton[data-animation='shimmer']::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateX(-100%);
			background-image: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0) 0,
				rgba(255, 255, 255, 0.15) 20%,
				rgba(255, 255, 255, 0.3) 60%,
				rgba(255, 255, 255, 0)
			);
			animation: f-skeleton-shimmer 1.6s infinite;
		}

		:global([data-theme='dark']) .f-skeleton[data-animation='shimmer']::after {
			background-image: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0) 0,
				rgba(255, 255, 255, 0.04) 20%,
				rgba(255, 255, 255, 0.08) 60%,
				rgba(255, 255, 255, 0)
			);
		}

		@keyframes f-skeleton-shimmer {
			100% {
				transform: translateX(100%);
			}
		}

		.f-skeleton[data-animation='pulse'] {
			animation: f-skeleton-pulse 1.5s ease-in-out 0.5s infinite;
		}

		@keyframes f-skeleton-pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.4;
			}
		}

		.f-skeleton[data-animation='none']::after {
			display: none;
		}
	}
</style>
