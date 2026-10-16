<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AspectRatioValue =
		| '16/9'
		| '4/3'
		| '1/1'
		| '21/9'
		| '9/16'
		| '3/2'
		| number;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		ratio?: AspectRatioValue;
		class?: string;
		children?: Snippet;
	}

	let {
		ratio = '16/9',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const ratioCss = $derived(
		typeof ratio === 'number' ? `${ratio}` : ratio.replace(':', '/')
	);
</script>

<div
	class="f-aspect-ratio {className}"
	style="aspect-ratio: {ratioCss};"
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-aspect-ratio {
			position: relative;
			width: 100%;
			overflow: hidden;
			box-sizing: border-box;
		}

		.f-aspect-ratio > :global(*) {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
