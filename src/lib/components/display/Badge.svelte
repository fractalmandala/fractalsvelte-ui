<!-- @component A small label for status or counts, with optional leading dot. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Message, Size, Shape, TextSize } from '$lib/types.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		message?: Message;
		size?: Size;
		shape?: Shape;
		/** Leading status dot */
		dot?: boolean;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		message = 'success',
		size = 'h-md',
		shape = 'modern',
		dot = false,
		textsize = 'text-sm',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<span class="badge row ycenter gap-xs shrink-0 msg {message} {size} {shape} {textsize} {className}" {...restProps}>
	{#if dot}
		<svg width="0.6em" height="0.6em" viewBox="0 0 8 8" aria-hidden="true" class="shrink-0">
			<circle cx="4" cy="4" r="4" fill="currentColor" />
		</svg>
	{/if}
	{@render children?.()}
</span>
