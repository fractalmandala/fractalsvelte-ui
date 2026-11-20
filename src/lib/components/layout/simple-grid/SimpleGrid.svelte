<!-- @component Responsive CSS Grid with fixed columns or minimum column width auto-fit. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Gap } from '../../../internal/tokens.js';
import { gapValue } from '../../../internal/helpers.js';
	import { vars } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Fixed column count when `minChildWidth` is omitted. */
		columns?: number;
		/** Minimum width per track for fluid responsive `auto-fit` wrapping (e.g. `'14rem'`). */
		minChildWidth?: string;
		/** Gap between grid tracks on the shared gap ladder. */
		gap?: Gap;
		/** Grid items. */
		children?: Snippet;
	}

	let {
		columns = 3,
		minChildWidth,
		gap = 'gap-md',
		class: className,
		children,
		...rest
	}: Props = $props();

	const autoFit = $derived(Boolean(minChildWidth));
</script>

<div
	class={['simple-grid', autoFit && 'auto-fit', className]}
	{@attach vars({
		cols: autoFit ? undefined : columns,
		'min-col': minChildWidth,
		gap: gapValue(gap)
	})}
	{...rest}
>
	{@render children?.()}
</div>
