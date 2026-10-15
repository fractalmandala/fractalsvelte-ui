<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { playSharedElementTransition, recordSharedElement } from '../../view-transitions.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		name: string;
		duration?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		name,
		duration = 400,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let element: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (element) {
			playSharedElementTransition(name, element, duration);
		}
	});

	onDestroy(() => {
		if (element) {
			recordSharedElement(name, element);
		}
	});
</script>

<div
	bind:this={element}
	class="f-shared-element {className}"
	style="view-transition-name: {name};"
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-shared-element {
			display: inline-block;
			box-sizing: border-box;
			will-change: transform, border-radius;
		}
	}
</style>
