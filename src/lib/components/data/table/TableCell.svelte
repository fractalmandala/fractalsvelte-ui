<!-- @component A data cell (<td>) with alignment, numeric and muted helpers. -->

<script lang="ts">
	import type {  TextAlign, TextColor  } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLTdAttributes  } from 'svelte/elements';
	import { cellAlign, type TableAlign } from './table.js';
	

	interface Props extends Omit<HTMLTdAttributes, 'align'> {
		align?: TextAlign;
		numeric?: boolean;
		muted?: boolean;
		textColor?: TextColor;
		children?: Snippet;
	}

	let {
		align,
		numeric = false,
		muted = false,
		textColor = 'text-secondary',
		class: className,
		children,
		...rest
	}: Props = $props();

</script>

<td class={[cellAlign(align, numeric), numeric && 'tabular-nums', muted && textColor, className]} {...rest}>
	{@render children?.()}
</td>
