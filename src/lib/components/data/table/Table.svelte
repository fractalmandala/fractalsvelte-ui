<!-- @component A presentational table of records with quiet headers, hairline rows and aligned numerals. -->

<script lang="ts">
	import { maxHeightStyle } from '../../../internal/helpers.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLTableAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Shape, type Size, type Surface } from '../../../internal/tokens.js';
	import { densityClass, type Density } from './table.js';

	interface Props extends HTMLTableAttributes {
		striped?: boolean;
		hoverable?: boolean;
		density?: Density;
		stickyHeader?: boolean;
		maxHeight?: Size | string;
		label?: string;
		framed?: boolean;
		surface?: Surface;
		shape?: Shape;
		children?: Snippet;
	}

	let {
		striped = false,
		hoverable = true,
		density = 'cozy',
		stickyHeader = false,
		maxHeight,
		label,
		framed = true,
		surface = 'elevated',
		shape = 'modern',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a scrollable region must be keyboard-focusable -->
<div
	class={[
		'scroll-xy scroll-thin wfull',
		maxHeight && `max-h-${String(maxHeight).replace(/^h-/, '')}`,
		framed && [surface, shape],
		label && 'focus-ring'
	]}
	role={label ? 'region' : undefined}
	aria-label={label}
	tabindex={label ? 0 : undefined}
	{@attach vars({ 'max-height': maxHeightStyle(maxHeight) })}
>
	<table
		class={[
			'data-table',
			densityClass[density],
			striped && 'striped',
			!hoverable && 'still',
			stickyHeader && 'sticky-head',
			className
		]}
		{...rest}
	>
		{@render children?.()}
	</table>
</div>
