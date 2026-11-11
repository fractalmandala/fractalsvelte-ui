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
		1: 'text-4xl weight-800',
		2: 'text-3xl weight-700',
		3: 'text-2xl weight-700',
		4: 'text-xl weight-600',
		5: 'text-lg weight-600',
		6: 'text-md weight-500 text-secondary tt-u'
	};

	const visualLevel = $derived(size ?? level);
	const sizeClass = $derived(textsize ?? defaultSizeMap[visualLevel]);
</script>

<svelte:element
	this={`h${level}`}
	class="text-primary lh12 {sizeClass} {weight ?? ''} {className}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>

