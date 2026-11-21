<!-- @component A header cell (<th scope="col">) with alignment, numeric and width helpers. -->

<script lang="ts">
	import type {  TextAlign  } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLThAttributes  } from 'svelte/elements';
	import { vars } from '../../../motion/index.js';
	import { cellAlign, type TableAlign } from './table.js';
	

	interface Props extends Omit<HTMLThAttributes, 'align'> {
		align?: TextAlign;
		numeric?: boolean;
		width?: string;
		children?: Snippet;
	}

	let { align, numeric = false, width, scope = 'col', class: className, children, ...rest }: Props = $props();

</script>

<th
	class={[cellAlign(align, numeric), width && 'wvar', className]}
	{scope}
	{@attach vars({ w: width })}
	{...rest}
>
	{@render children?.()}
</th>
