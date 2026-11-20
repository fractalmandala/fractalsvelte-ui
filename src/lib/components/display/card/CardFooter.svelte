<!-- @component A row for actions or metadata at the bottom. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Align } from '../../../internal/tokens.js';
import { justifyClass } from '../../../internal/helpers.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Where the footer's items sit along the row. */
		align?: Align;
		/** The footer's actions or metadata. */
		children?: Snippet;
	}

	let { align = 'left', class: className, children, ...rest }: Props = $props();

</script>

<footer class={['row wrap ycenter gap-sm', justifyClass[align], className]} {...rest}>
	{@render children?.()}
</footer>
