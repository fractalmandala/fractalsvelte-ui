<!-- @component A header cell (<th scope="col">) with alignment, numeric and width helpers. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { cellAlign, type TableAlign } from './table.js';

	interface Props extends HTMLThAttributes {
		/** Horizontal alignment of the header text. Match it to the column's cells. */
		align?: TableAlign;
		/** A numeric column: right-aligned, so it lines up with `numeric` cells. */
		numeric?: boolean;
		/** A fixed column width (any CSS length, e.g. `8rem` or `20%`). */
		width?: string;
		/** The header text. */
		children?: Snippet;
	}

	let { align, numeric = false, width, scope = 'col', class: klass, children, ...rest }: Props = $props();

</script>

<th
	class={[cellAlign(align, numeric), width && 'wvar', klass]}
	{scope}
	{@attach vars({ w: width })}
	{...rest}
>
	{@render children?.()}
</th>
