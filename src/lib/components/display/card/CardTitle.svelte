<!-- @component The card heading, at a configurable level. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { getCardContext, titleClass } from './context.js';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		children?: Snippet;
	}

	let { level = 3, class: className, children, ...rest }: Props = $props();
	const card = getCardContext();
</script>

<svelte:element
	this={`h${level}`}
	class={['weight-600 lh12 ls-tight-bs', titleClass[card.size], className]}
	{...rest}
>
	{@render children?.()}
</svelte:element>
