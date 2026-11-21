<!-- @component One cell of the bento, with column and row span, an optional featured surface, and an optional hover lift. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Pad, Surface  } from '../../../internal/tokens.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		colSpan?: number;
		rowSpan?: number;
		featured?: boolean;
		pad?: Pad;
		surface?: Surface;
		lift?: boolean;
		children?: Snippet;
	}

	let {
		colSpan = 1,
		rowSpan = 1,
		featured = false,
		pad = 'pad-md',
		surface = 'paneled',
		lift = false,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={[
		'span min0 anim-in',
		featured && ['box', pad, 'radius-md', surface],
		lift && 'lift',
		className
	]}
	{@attach vars({ cspan: colSpan, rspan: rowSpan })}
	{...rest}
>
	{@render children?.()}
</div>
