<!-- @component A small text hint shown on hover or focus. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Anchor, { type Placement } from '../overlays/Anchor.svelte';
	import type { Surface, Border, Shadow, TextSize } from '$lib/types.js';

	export type TooltipPlacement = Placement;

	interface Props {
		content?: string;
		placement?: TooltipPlacement;
		/** ms before showing on hover */
		delay?: number;
		disabled?: boolean;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
		tooltipSnippet?: Snippet;
		children?: Snippet;
	}

	let {
		content,
		placement = 'top',
		delay = 200,
		disabled = false,
		surface = 'bg-button',
		border = 'border-none',
		shadow = 'shad-sm',
		textsize = 'text-sm',
		class: className = '',
		tooltipSnippet,
		children
	}: Props = $props();

	const uid = $props.id();
	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	function show() {
		if (disabled || (!content && !tooltipSnippet)) return;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => (visible = true), delay);
	}

	function hide() {
		if (timer) clearTimeout(timer);
		visible = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="row"
	aria-describedby={visible ? uid : undefined}
	onpointerenter={show}
	onpointerleave={hide}
	onfocusin={show}
	onfocusout={hide}
	onkeydown={(e) => e.key === 'Escape' && hide()}
>
	<Anchor {placement} open={visible}>
		{#snippet trigger()}{@render children?.()}{/snippet}
		{#snippet panel()}
			<!-- .truncate keeps the tip on one line inside a narrow anchor. -->
			<div id={uid} role="tooltip" class="px-sm py-xs mincurved text-inverse truncate {surface} {border} {shadow} {textsize} {className}">
				{#if tooltipSnippet}{@render tooltipSnippet()}{:else}{content}{/if}
			</div>
		{/snippet}
	</Anchor>
</div>
