<!-- @component Horizontal or vertical divider separator rule with optional centered label. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Border, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Optional text label centered along the divider line. */
		label?: string;
		/** Vertical orientation instead of default horizontal. */
		vertical?: boolean;
		border?: Border;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		vertical = false,
		border = 'border',
		textsize = 'text-sm',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const hasLabel = $derived(Boolean(label || children));

	// The line is one edge of an otherwise empty box, in the weight the border prop asks for.
	const LINE: Record<string, string> = {
		border: 'bt',
		'border-strong': 'bt-str',
		'border-subtle': 'bt-sub',
		'border-dashed': 'bt-dash',
		'border-none': '',
		bb: 'bt',
		'bb-str': 'bt-str',
		'bb-sub': 'bt-sub',
		'bb-dash': 'bt-dash'
	};
</script>

{#if vertical}
	<div role="separator" aria-orientation="vertical" class="hfull mx-sm {LINE[border].replace('bt', 'bl')} {className}" {...restProps}></div>
{:else if hasLabel}
	<div role="separator" aria-orientation="horizontal" class="row ycenter gap-md wfull my-sm {textsize} {className}" {...restProps}>
		<span class="grow {LINE[border]}"></span>
		<span class="shrink-0 text-xs weight-500 tt-u ls-wide-xl text-secondary">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
		<span class="grow {LINE[border]}"></span>
	</div>
{:else}
	<div role="separator" aria-orientation="horizontal" class="wfull my-sm {LINE[border]} {className}" {...restProps}></div>
{/if}
