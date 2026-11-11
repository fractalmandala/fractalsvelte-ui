<!-- @component A status pill or badge with an integrated indicator dot and label. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Message, Size, Shape, TextSize } from '$lib/types.js';
	import Dot from './Dot.svelte';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant | Message;
		size?: Size;
		shape?: Shape;
		/** Lite mode renders a subtle transparent border outline instead of a tinted surface */
		lite?: boolean;
		/** Pulsating animation on the indicator dot */
		animated?: boolean;
		/** Status label text */
		label?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'success',
		size = 'h-sm',
		shape = 'round',
		lite = false,
		animated = false,
		label,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));
</script>

<span
	class="inline-flex row ycenter gap-xs px-sm weight-500 {size} {shape} {textsize} {lite ? 'border text-primary' : isMessage ? `tint ${variant}` : variant} {className}"
	{...restProps}
>
	<Dot {variant} {animated} size={size === 'h-xs' || size === 'h-sm' ? 'sm' : 'md'} />
	<!-- on a tint the label takes the message colour; a solid fill keeps its own ink -->
	<span class={isMessage && !lite ? `text-${variant}` : ''}>
		{#if children}
			{@render children()}
		{:else if label}
			{label}
		{/if}
	</span>
</span>
