<!-- @component A keyboard-focusable scroll region with thin themed scrollbars and edge fades that appear only when there is more to scroll. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Size } from '../../../internal/tokens.js';
import { maxHeightClass, maxHeightStyle } from '../../../internal/helpers.js';
	import { attachFades } from './scroll-area.js';

	type Orientation = 'vertical' | 'horizontal' | 'both';
	type Scrollbar = 'auto' | 'hover' | 'hidden';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Which axes can scroll. */
		orientation?: Orientation;
		/** Caps the height of the region: a ladder word (`lg`) or any CSS length (`24rem`). */
		maxHeight?: Size | string;
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
		class: className,
		children,
		...rest
	}: Props = $props();

	const overflowClass: Record<Orientation, string> = {
		vertical: 'scroll-y',
		horizontal: 'scroll-x',
		both: 'scroll-xy'
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
		maxHeightClass(maxHeight),
		maxHeight && 'capped',
		barClass[scrollbar],
		fadeY && 'fade-y',
		fadeX && 'fade-x',
		className
	]}
	{@attach vars({ 'max-height': maxHeightStyle(maxHeight) })}
	role="region"
	aria-label={label}
	tabindex="0"
	{@attach fades}
	{...rest}
>
	{@render children?.()}
</div>
