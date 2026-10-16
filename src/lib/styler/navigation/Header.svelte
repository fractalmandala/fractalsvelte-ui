<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Sticky uses .app-header (sticky, --header-height tall); off is a plain row. */
		sticky?: boolean;
		bordered?: boolean;
		class?: string;
		brand?: Snippet;
		center?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		sticky = true,
		bordered = true,
		class: className = '',
		brand,
		center,
		actions,
		children,
		...restProps
	}: Props = $props();
</script>

<header
	class="{sticky ? 'app-header' : 'px-lg py-sm'} row ycenter xbetween gap-md bg-surface {bordered ? 'bb' : ''} {className}"
	{...restProps}
>
	{#if brand}<div class="row ycenter gap-sm shrink-0">{@render brand()}</div>{/if}
	{#if center}<div class="row ycenter xcenter gap-sm grow min0">{@render center()}</div>{/if}
	{#if actions}<div class="row ycenter xright gap-xs shrink-0">{@render actions()}</div>{/if}
	{#if children && !brand && !center && !actions}{@render children()}{/if}
</header>
