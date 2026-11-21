<!-- @component A keyboard-focusable scroll region with thin themed scrollbars and edge fades that appear only when there is more to scroll. -->

<script lang="ts">
	import { maxHeightStyle } from '../../../internal/helpers.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Size } from '../../../internal/tokens.js';
	import { attachFades } from './scroll-area.js';

	type Orientation = 'vertical' | 'horizontal' | 'both';
	type Scrollbar = 'auto' | 'hover' | 'hidden';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: Orientation;
		maxHeight?: Size | string;
		scrollbar?: Scrollbar;
		label?: string;
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
		maxHeight && `max-h-${String(maxHeight).replace(/^h-/, '')}`,
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
