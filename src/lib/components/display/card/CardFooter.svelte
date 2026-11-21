<!-- @component A row for actions or metadata at the bottom. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { type Align, type Gap } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		align?: Align;
		gap?: Gap;
		children?: Snippet;
	}

	let { align = 'left', gap = 'gap-sm', class: className, children, ...rest }: Props = $props();

</script>

<footer class={['row wrap ycenter', gap, `x${`align`}`, className]} {...rest}>
	{@render children?.()}
</footer>
