<!-- @component A quotation with author and citation. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/components/core/Icon.svelte';
	import type { IconNode } from '$lib/icons/types.js';
	import { klQuote } from '$lib/icons/keylinestroke.js';
	import type { Border, ThemeColor, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLQuoteElement> {
		quote?: string;
		author?: string;
		citation?: string;
		/** An icon from $lib/icons/keylinestroke or keylinefill, or false for none */
		icon?: IconNode | false;
		/** Colour of the icon */
		accent?: ThemeColor;
		/** Left rule colour */
		border?: Border;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		authorSnippet?: Snippet;
	}

	let {
		quote,
		author,
		citation,
		icon = klQuote,
		accent = 'theme-color',
		border = 'border-strong',
		textsize = 'text-md',
		class: className = '',
		children,
		authorSnippet,
		...restProps
	}: Props = $props();

	// The rule down the left edge, in the weight the border prop asks for.
	const LINE: Record<string, string> = {
		border: 'bl',
		'border-strong': 'bl-str',
		'border-subtle': 'bl-sub',
		'border-dashed': 'bl-dash',
		'border-none': '',
		bb: 'bl',
		'bb-str': 'bl-str',
		'bb-sub': 'bl-sub',
		'bb-dash': 'bl-dash'
	};
	const ACCENT: Record<string, string> = { 'theme-color': 'text-theme', 'theme-color-up': 'text-theme-up', 'theme-color-down': 'text-theme-down' };
</script>

<blockquote class="row ytop gap-md pl-md py-xs {LINE[border] ?? 'bl'} {textsize} {className}" {...restProps}>
	{#if icon}
		<span class="row shrink-0 text-xl {ACCENT[accent]}" aria-hidden="true"><Icon {icon} /></span>
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
