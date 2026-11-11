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
		/** `inline` flows with the content; the others pin the stamp to a corner of its positioned parent. */
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
		'top-start': 'pin-tl',
		'top-end': 'pin-tr',
		'bottom-start': 'pin-bl',
		'bottom-end': 'pin-br'
	};
</script>

<div
	class="btn-icon inline-flex row xcenter ycenter weight-600 {size} {shape} {positionClasses[position]} {textsize} {isMessage ? `tint ${variant}` : variant} {className}"
	{...restProps}
>
	<span class="row ycenter {isMessage ? `text-${variant}` : ''}">
		{#if icon}
			{@render icon()}
		{:else if children}
			{@render children()}
		{/if}
	</span>
</div>

