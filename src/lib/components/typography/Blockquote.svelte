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

<blockquote
	class="f-blockquote {className}"
	{...restProps}
>
	{#if icon}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="f-blockquote-icon"
			aria-hidden="true"
		>
			<path
				d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"
			/>
		</svg>
	{/if}

	<div class="f-blockquote-body">
		{#if quote}
			<p class="f-blockquote-quote">{quote}</p>
		{/if}

		{#if children}
			<div class="f-blockquote-content">
				{@render children()}
			</div>
		{/if}

		{#if author || citation || authorSnippet}
			<footer class="f-blockquote-footer">
				{#if authorSnippet}
					{@render authorSnippet()}
				{:else}
					{#if author}
						<cite class="f-blockquote-author">{author}</cite>
					{/if}
					{#if citation}
						<span class="f-blockquote-cite">&mdash; {citation}</span>
					{/if}
				{/if}
			</footer>
		{/if}
	</div>
</blockquote>

<style>
	@layer fractalsvelte-ui.components {
		.f-blockquote {
			margin: var(--f-space-lg) 0;
			padding: var(--f-space-sm) var(--f-space-lg);
			border-left: 3px solid var(--f-primary);
			background: var(--f-sunken);
			border-radius: 0 var(--f-radius-md) var(--f-radius-md) 0;
			box-sizing: border-box;
			font-family: inherit;
			position: relative;
			display: flex;
			gap: var(--f-space-md);
		}

		.f-blockquote-icon {
			flex-shrink: 0;
			color: var(--f-primary);
			opacity: 0.4;
			margin-top: 2px;
		}

		.f-blockquote-body {
			flex: 1 1 auto;
			display: flex;
			flex-direction: column;
			gap: var(--f-space-xs);
		}

		.f-blockquote-quote {
			margin: 0;
			font-size: var(--f-text-base);
			color: var(--f-text);
			line-height: 1.6;
			font-style: italic;
		}

		.f-blockquote-content {
			font-size: var(--f-text-base);
			color: var(--f-text);
			line-height: 1.6;
		}

		.f-blockquote-footer {
			display: flex;
			align-items: center;
			gap: var(--f-space-xs);
			margin-top: var(--f-space-2xs);
			font-size: var(--f-text-sm);
		}

		.f-blockquote-author {
			font-weight: 600;
			font-style: normal;
			color: var(--f-text);
		}

		.f-blockquote-cite {
			color: var(--f-text-muted);
		}
	}
</style>
