<!-- @component A top-level link in the list, with an optional current page state. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		/** The destination of the link. */
		href: string;
		/** Marks this link as the current page. */
		current?: boolean;
		/** The link label. */
		children?: Snippet;
	}

	let { href, current = false, class: klass, children, ...rest }: Props = $props();
</script>

<a
	{href}
	data-nav-link
	tabindex="-1"
	class={[
		'bare relative z-raised row ycenter px-md h-lg weight-500 focus-ring',
		current ? 'text-primary' : 'text-secondary',
		klass
	]}
	aria-current={current ? 'page' : undefined}
	{...rest}
>
	{@render children?.()}
</a>
