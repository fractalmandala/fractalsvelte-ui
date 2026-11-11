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
		shape = 'mincurved',
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<div
	aria-hidden="true"
	class="box gap-xs wfull {className}"
	{...restProps}
>
	{#each { length: lines }, i (i)}
		{#if circle}
			<!-- A circle is square by its frame class; a full-width default would make it a page-wide disc, so it falls back to 3rem. -->
			<div class="state-selected anim-pulse round frame-1-1" style:width={width === '100%' ? '3rem' : width}></div>
		{:else}
			<div
				class="state-selected anim-pulse {shape}"
				style:width={lines > 1 && i === lines - 1 ? '60%' : width}
				style:height={height}
			></div>
		{/if}
	{/each}
</div>

