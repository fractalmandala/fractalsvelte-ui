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
	class="status-badge inline-flex items-center gap-xs px-sm size shape {size} {shape} {textsize} {lite ? 'lite border' : isMessage ? `tint ${variant}` : `variant ${variant}`} {className}"
	{...restProps}
>
	<Dot {variant} {animated} size={size === 'h-xs' || size === 'h-sm' ? 'sm' : 'md'} />
	{#if children}
		{@render children()}
	{:else if label}
		<span class="status-label font-medium">{label}</span>
	{/if}
</span>

<style>
	.status-badge.lite {
		background-color: transparent;
		color: var(--text-primary);
		border-color: var(--border);
	}
	.status-badge.tint.success {
		color: var(--success);
	}
	.status-badge.tint.warning {
		color: var(--warning-hover);
	}
	.status-badge.tint.danger {
		color: var(--danger);
	}
	.status-badge.tint.info {
		color: var(--info);
	}
</style>
