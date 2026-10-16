<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLQuoteElement> {
		quote?: string;
		author?: string;
		citation?: string;
		icon?: boolean;
		class?: string;
		children?: Snippet;
		authorSnippet?: Snippet;
	}

	let {
		quote,
		author,
		citation,
		icon = true,
		class: className = '',
		children,
		authorSnippet,
		...restProps
	}: Props = $props();
</script>

<blockquote class="row ytop gap-md pl-md py-xs bl-str {className}" {...restProps}>
	{#if icon}
		<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="currentColor" class="text-theme shrink-0" aria-hidden="true">
			<path
				d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"
			/>
		</svg>
	{/if}
	<div class="box gap-sm min0">
		{#if quote}<p class="text-body-lg text-primary">{quote}</p>{/if}
		{#if children}<div class="text-body text-primary">{@render children()}</div>{/if}
		{#if author || citation || authorSnippet}
			<footer class="row ycenter gap-xs wrap text-sm">
				{#if authorSnippet}
					{@render authorSnippet()}
				{:else}
					{#if author}<cite class="weight-600 text-primary">{author}</cite>{/if}
					{#if citation}<span class="text-muted">— {citation}</span>{/if}
				{/if}
			</footer>
		{/if}
	</div>
</blockquote>
