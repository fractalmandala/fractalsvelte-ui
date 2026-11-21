<!-- @component Content that only screen readers hear, with an optional reveal on focus. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		as?: 'span' | 'div';
		focusable?: boolean;
		children?: Snippet;
	}

	let { as = 'span', focusable = false, class: className, children, ...rest }: Props = $props();

	const classes = $derived(['sr-only', focusable && 'sr-only-focusable', className]);
</script>

<svelte:element this={as} class={classes} {...rest}>
	{@render children?.()}
</svelte:element>
