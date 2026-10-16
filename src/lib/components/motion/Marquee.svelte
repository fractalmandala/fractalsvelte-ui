<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		speed?: number;
		pauseOnHover?: boolean;
		reverse?: boolean;
		fadeEdges?: boolean;
		gap?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		speed = 30,
		pauseOnHover = true,
		reverse = false,
		fadeEdges = true,
		gap = '2rem',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-marquee {className}"
	data-pause-on-hover={pauseOnHover ? 'true' : undefined}
	data-fade-edges={fadeEdges ? 'true' : undefined}
	style="--marquee-duration: {speed}s; --marquee-gap: {gap}; --marquee-direction: {reverse ? 'reverse' : 'normal'};"
	{...restProps}
>
	<div class="f-marquee-track">
		<div class="f-marquee-content">
			{#if children}
				{@render children()}
			{/if}
		</div>
		<div class="f-marquee-content" aria-hidden="true">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-marquee {
			position: relative;
			overflow: hidden;
			display: flex;
			width: 100%;
			max-width: 100%;
			user-select: none;
		}

		.f-marquee[data-fade-edges='true'] {
			mask-image: linear-gradient(
				to right,
				transparent 0%,
				black 8%,
				black 92%,
				transparent 100%
			);
			-webkit-mask-image: linear-gradient(
				to right,
				transparent 0%,
				black 8%,
				black 92%,
				transparent 100%
			);
		}

		.f-marquee-track {
			display: flex;
			flex-direction: row;
			width: max-content;
			animation: f-marquee-scroll var(--marquee-duration) linear infinite;
			animation-direction: var(--marquee-direction);
		}

		.f-marquee[data-pause-on-hover='true']:hover .f-marquee-track {
			animation-play-state: paused;
		}

		.f-marquee-content {
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-shrink: 0;
			gap: var(--marquee-gap);
			padding-right: var(--marquee-gap);
		}

		@keyframes f-marquee-scroll {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(-50%);
			}
		}
	}
</style>
