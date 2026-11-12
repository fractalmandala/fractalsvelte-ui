<!-- @component A header link, with an optional current-page state. -->

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
	class={['nav-link', current ? 'text-primary weight-500' : 'text-secondary', klass]}
	aria-current={current ? 'page' : undefined}
	{...rest}
>
	{@render children?.()}
</a>
