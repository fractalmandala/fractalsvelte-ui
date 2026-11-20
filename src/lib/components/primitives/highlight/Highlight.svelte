<!-- @component Highlights matching query substrings within text. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant } from '../../../internal/tokens.js';
	import { splitHighlight } from './highlight.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The full source string to scan. */
		text: string;
		/** One substring or a list of substrings to mark. */
		query?: string | string[];
		/** Match without regard to case. */
		ignoreCase?: boolean;
		/** Highlight every occurrence rather than only the first. */
		matchAll?: boolean;
		/** The visual variant applied to matched `<mark>` spans. */
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
