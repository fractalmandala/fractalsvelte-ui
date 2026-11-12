<!-- @component Content that only screen readers hear, with an optional reveal on focus. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The element to render. Use span inside text and div inside blocks. */
		as?: 'span' | 'div';
		/** Shows the content while something inside it has keyboard focus, such as a skip link. */
		focusable?: boolean;
		/** The content, which only assistive technology and the focus reveal show. */
		children?: Snippet;
	}

	let { as = 'span', focusable = false, class: klass, children, ...rest }: Props = $props();

	const classes = $derived(['sr-only', focusable && 'sr-only-focusable', klass]);
</script>

<svelte:element this={as} class={classes} {...rest}>
	{@render children?.()}
</svelte:element>
