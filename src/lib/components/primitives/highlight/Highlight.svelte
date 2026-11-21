<!-- @component Highlights matching query substrings within text. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Variant  } from '../../../internal/tokens.js';
	import { splitHighlight } from './highlight.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		text: string;
		query?: string | string[];
		ignoreCase?: boolean;
		matchAll?: boolean;
		variant?: Variant;
	}

	let {
		text,
		query,
		ignoreCase = true,
		matchAll = true,
		variant = 'themed',
		class: className,
		...rest
	}: Props = $props();

	const chunks = $derived(splitHighlight(text, query, ignoreCase, matchAll));
</script>

<span class={className} {...rest}>
	{#each chunks as chunk, i (i)}
		{#if chunk.match}
			<mark class={['mark-highlight weight-500', variant]}>{chunk.text}</mark>
		{:else}
			{chunk.text}
		{/if}
	{/each}
</span>
