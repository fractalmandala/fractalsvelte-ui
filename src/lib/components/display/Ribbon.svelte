<!-- @component A corner ribbon banner for cards and containers, with bookmark styling and variant themes. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Message, TextSize } from '$lib/types.js';

	export type RibbonPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		position?: RibbonPosition;
		variant?: Variant | Message;
		/** Render with a decorative triangular bookmark notch */
		bookmark?: boolean;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		position = 'top-right',
		variant = 'primary',
		bookmark = false,
		textsize = 'text-md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));

	const positionClasses: Record<RibbonPosition, string> = {
		'top-right': 'top-3 -right-1 origin-top-right',
		'top-left': 'top-3 -left-1 origin-top-left',
		'bottom-right': 'bottom-3 -right-1 origin-bottom-right',
		'bottom-left': 'bottom-3 -left-1 origin-bottom-left'
	};
</script>

<div
	class="ribbon absolute z-10 inline-flex items-center justify-center font-bold tracking-wider uppercase shadow-xs px-2 py-0.5 {positionClasses[position]} {textsize} {bookmark ? 'ribbon-bookmark' : ''} {isMessage ? `tint ${variant}` : `variant ${variant}`} {className}"
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.ribbon {
		font-size: 0.6875rem;
		line-height: 1.2;
		border-radius: 4px;
	}
	.ribbon.ribbon-bookmark {
		clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%);
		padding-bottom: 0.5rem;
	}
	.ribbon.tint.info {
		color: var(--info);
	}
	.ribbon.tint.success {
		color: var(--success);
	}
	.ribbon.tint.warning {
		color: var(--warning-hover);
	}
	.ribbon.tint.danger {
		color: var(--danger);
	}
</style>
