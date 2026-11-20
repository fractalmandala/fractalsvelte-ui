<!-- @component A presentational table of records with quiet headers, hairline rows and aligned numerals. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { type Size } from '../../../internal/tokens.js';
import { maxHeightClass, maxHeightStyle } from '../../../internal/helpers.js';
	import { densityClass, type Density } from './table.js';

	interface Props extends HTMLTableAttributes {
		/** Shades every other body row. */
		striped?: boolean;
		/** Lights a body row under the pointer. Turn off for dense reference tables. */
		hoverable?: boolean;
		/** Row density, on the shared ladder: `compact` · `cozy` · `comfortable`. */
		density?: Density;
		/** Keeps the header row in view while the body scrolls. Pair it with `maxHeight`. */
		stickyHeader?: boolean;
		/** Caps the height and scrolls the body: a ladder word (`lg`) or any CSS length (`24rem`). */
		maxHeight?: Size | string;
		/** Names the scroll region for assistive technology and makes it keyboard-scrollable. */
		label?: string;
		/** Draws the hairline frame and surface fill around the table. */
		framed?: boolean;
		/** The table parts: `TableCaption`, `TableHead`, `TableBody`. */
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
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- a scrollable region must be keyboard-focusable -->
<div
	class={[
		'scroll-xy scroll-thin wfull',
		maxHeightClass(maxHeight),
		framed && 'border modern bg-surface',
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
