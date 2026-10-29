<!-- @component A quotation with author and citation. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, type IconData } from '@fractaldesign/icons';
	import { luQuote } from '@fractaldesign/icons/lucide';
	import type { Border, ThemeColor } from '../types';

	interface Props extends HTMLAttributes<HTMLQuoteElement> {
		quote?: string;
		author?: string;
		citation?: string;
		/** An icon from @fractaldesign/icons, or false for none */
		icon?: IconData | false;
		/** Colour of the icon */
		accent?: ThemeColor;
		/** Left rule colour */
		border?: Border;
		class?: string;
		children?: Snippet;
		authorSnippet?: Snippet;
	}

	let {
		quote,
		author,
		citation,
		icon = luQuote,
		accent = 'theme-color',
		border = 'border-strong',
		class: className = '',
		children,
		authorSnippet,
		...restProps
	}: Props = $props();
</script>

<blockquote class="row ytop gap-md pl-md py-xs {className}" style:border-left="2px solid var(--{border})" {...restProps}>
	{#if icon}
		<span class="row shrink-0 text-xl" style:color="var(--{accent})" aria-hidden="true"><Icon {icon} /></span>
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
