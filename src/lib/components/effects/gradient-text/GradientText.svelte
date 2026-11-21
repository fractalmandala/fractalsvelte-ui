<!-- @component Text filled with a theme-derived gradient, with optional slow motion and readable selection. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		gradient?: 'theme' | 'aurora' | 'sunset' | 'mono';
		animated?: boolean;
		children?: Snippet;
	}

	let {
		gradient = 'theme',
		animated = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const gradientClass = {
		theme: 'ink-theme',
		aurora: 'ink-aurora',
		sunset: 'ink-sunset',
		mono: 'ink-mono'
	};
</script>

<span class={['ink', gradientClass[gradient], animated && 'ink-flow', className]} {...rest}>
	{@render children?.()}
</span>
