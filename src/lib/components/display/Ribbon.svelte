<!-- @component A corner ribbon banner for cards and containers, with bookmark styling and variant themes. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant, Message } from '$lib/types.js';

	export type RibbonPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Which corner of its positioned parent the ribbon sits on. */
		position?: RibbonPosition;
		variant?: Variant | Message;
		/** Render with a decorative triangular bookmark notch */
		bookmark?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		position = 'top-right',
		variant = 'primary',
		bookmark = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));

	const positionClasses: Record<RibbonPosition, string> = {
		'top-right': 'pin-tr',
		'top-left': 'pin-tl',
		'bottom-right': 'pin-br',
		'bottom-left': 'pin-bl'
	};
</script>

<div
	class="inline-flex row xcenter ycenter px-sm mincurved text-xs weight-700 tt-u ls-wide-xl shad-xs {positionClasses[position]} {bookmark ? 'ribbon-bookmark' : ''} {isMessage ? `tint ${variant}` : variant} {className}"
	{...restProps}
>
	<span class={isMessage ? `text-${variant}` : ''}>{@render children?.()}</span>
</div>

