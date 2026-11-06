<!-- @component An icon or metric tile stamp with square aspect ratio, rounded corners, and status variants. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Message, Size, Shape, TextSize } from '$lib/types.js';

	export type StampPosition = 'inline' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		size?: Size;
		variant?: Variant | Message;
		shape?: Shape;
		position?: StampPosition;
		textsize?: TextSize;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		size = 'h-lg',
		variant = 'primary',
		shape = 'curved',
		position = 'inline',
		textsize = 'text-md',
		class: className = '',
		icon,
		children,
		...restProps
	}: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));

	const positionClasses: Record<StampPosition, string> = {
		inline: 'relative',
		'top-start': 'absolute top-2 start-2 z-10',
		'top-end': 'absolute top-2 end-2 z-10',
		'bottom-start': 'absolute bottom-2 start-2 z-10',
		'bottom-end': 'absolute bottom-2 end-2 z-10'
	};
</script>

<div
	class="stamp inline-flex items-center justify-center aspect-square shrink-0 size shape {size} {shape} {positionClasses[position]} {textsize} {isMessage ? `tint ${variant}` : `variant ${variant}`} {className}"
	{...restProps}
>
	{#if icon}
		{@render icon()}
	{:else if children}
		{@render children()}
	{/if}
</div>

<style>
	.stamp {
		width: auto;
		min-width: unset;
		padding: 0;
	}
	.stamp.tint.info {
		color: var(--info);
	}
	.stamp.tint.success {
		color: var(--success);
	}
	.stamp.tint.warning {
		color: var(--warning-hover);
	}
	.stamp.tint.danger {
		color: var(--danger);
	}
</style>
