<!-- @component A small label for status or counts, with optional leading dot. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Message, Size, Shape } from '../types';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant | Message;
		size?: Size;
		shape?: Shape;
		/** Leading status dot */
		dot?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'secondary',
		size = 'h-sm',
		shape = 'round',
		dot = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<span class="badge row ycenter gap-xs shrink-0 el-variant el-size el-shape {variant} {size} {shape} {className}" {...restProps}>
	{#if dot}
		<svg width="0.6em" height="0.6em" viewBox="0 0 8 8" aria-hidden="true" class="shrink-0">
			<circle cx="4" cy="4" r="4" fill="currentColor" />
		</svg>
	{/if}
	{@render children?.()}
</span>
