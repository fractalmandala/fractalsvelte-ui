<!-- @component A keyboard-focusable scroll region with thin themed scrollbars and edge fades that appear only when there is more to scroll. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { attachFades } from './scroll-area.js';

	type Orientation = 'vertical' | 'horizontal' | 'both';
	type MaxHeight = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type Scrollbar = 'auto' | 'hover' | 'hidden';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Which axes can scroll. */
		orientation?: Orientation;
		/** Caps the height of the region using the measure ladder. */
		maxHeight?: MaxHeight;
		/** When the scrollbar is shown: always when there is overflow, on hover and focus, or never. */
		scrollbar?: Scrollbar;
		/** Accessible name of the region. The region is keyboard-focusable so it can be scrolled from the keyboard. */
		label?: string;
		/** The scrollable content. */
		children?: Snippet;
	}

	let {
		orientation = 'vertical',
		maxHeight,
		scrollbar = 'auto',
		label = 'Scrollable content',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const overflowClass: Record<Orientation, string> = {
		vertical: 'scroll-y',
		horizontal: 'scroll-x',
		both: 'scroll-xy'
	};
	const heightClass: Record<MaxHeight, string> = {
		xs: 'max-h-xs',
		sm: 'max-h-sm',
		md: 'max-h-md',
		lg: 'max-h-lg',
		xl: 'max-h-xl',
		'2xl': 'max-h-2xl'
	};
	const barClass: Record<Scrollbar, string> = {
		auto: 'scroll-thin',
		hover: 'scroll-hover',
		hidden: 'scroll-hidden'
	};

	const fadeY = $derived(orientation === 'vertical' || orientation === 'both');
	const fadeX = $derived(orientation === 'horizontal' || orientation === 'both');
	const fades = $derived(attachFades({ y: fadeY, x: fadeX }));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a labelled scroll region must be keyboard-focusable -->
<div
	class={[
		'wfull focus-ring',
		overflowClass[orientation],
		maxHeight && heightClass[maxHeight],
		barClass[scrollbar],
		fadeY && 'fade-y',
		fadeX && 'fade-x',
		klass
	]}
	role="region"
	aria-label={label}
	tabindex="0"
	{@attach fades}
	{...rest}
>
	{@render children?.()}
</div>
