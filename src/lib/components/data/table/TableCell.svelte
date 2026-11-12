<!-- @component A data cell (<td>) with alignment, numeric and muted helpers. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cellAlign, type TableAlign } from './table.js';

	interface Props extends HTMLTdAttributes {
		/** Horizontal alignment of the content. */
		align?: TableAlign;
		/** A number: right-aligned with tabular numerals, so digits line up down the column. */
		numeric?: boolean;
		/** Secondary ink, for supporting values (dates, ids, units). */
		muted?: boolean;
		/** The content. */
		children?: Snippet;
	}

	let { align, numeric = false, muted = false, class: klass, children, ...rest }: Props = $props();

</script>

<td class={[cellAlign(align, numeric), numeric && 'tabular-nums', muted && 'text-secondary', klass]} {...rest}>
	{@render children?.()}
</td>
