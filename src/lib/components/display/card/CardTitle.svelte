<!-- @component The card heading, at a configurable level. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getCardContext, titleClass } from './context.js';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		/** The heading level, 1 to 6. Pick the one that fits the page outline. */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		/** The title text. */
		children?: Snippet;
	}

	let { level = 3, class: klass, children, ...rest }: Props = $props();
	const card = getCardContext();
</script>

<svelte:element
	this={`h${level}`}
	class={['weight-600 lh12 ls-tight-bs text-primary', titleClass[card.size], klass]}
	{...rest}
>
	{@render children?.()}
</svelte:element>
