<!-- @component Polymorphic heading element with semantic level, text size scale, tracking, and weight. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { TextSize, Weight } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		/** Heading tag level (h1 through h6). Defaults to 2. */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		/** Visual size scale 1-6. When omitted, matches the level. */
		size?: 1 | 2 | 3 | 4 | 5 | 6;
		textsize?: TextSize;
		weight?: Weight;
		class?: string;
		children?: Snippet;
	}

	let {
		level = 2,
		size,
		textsize,
		weight,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const defaultSizeMap: Record<number, string> = {
		1: 'text-4xl font-extrabold',
		2: 'text-3xl font-bold',
		3: 'text-2xl font-bold',
		4: 'text-xl font-semibold',
		5: 'text-lg font-semibold',
		6: 'text-md font-medium text-secondary uppercase'
	};

	const visualLevel = $derived(size ?? level);
	const sizeClass = $derived(textsize ?? defaultSizeMap[visualLevel]);
</script>

<svelte:element
	this={`h${level}`}
	class="heading-element {sizeClass} {weight ?? ''} {className}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.heading-element {
		margin: 0;
		color: var(--text-primary, #111);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}
</style>
