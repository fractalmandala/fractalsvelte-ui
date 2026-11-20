<!-- @component Text filled with a theme-derived gradient, with optional slow motion and readable selection. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The fill: the theme accent, an aurora of hue offsets, a warmer sunset, or a monochrome fade. */
		look?: 'theme' | 'aurora' | 'sunset' | 'mono';
		/** Sweeps the gradient slowly along the text. */
		animated?: boolean;
		/** The text the gradient fills. */
		children?: Snippet;
	}

	let {
		look = 'theme',
		animated = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const lookClass = {
		theme: 'ink-theme',
		aurora: 'ink-aurora',
		sunset: 'ink-sunset',
		mono: 'ink-mono'
	};
</script>

<span class={['ink', lookClass[look], animated && 'ink-flow', className]} {...rest}>
	{@render children?.()}
</span>
