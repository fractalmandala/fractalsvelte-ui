<!-- @component A top-level link in the list, with an optional current page state. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAnchorAttributes  } from 'svelte/elements';
	import type { Size, TextColor } from '../../../internal/tokens.js';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		current?: boolean;
		size?: Size;
		textColor?: TextColor;
		children?: Snippet;
	}

	let { href, current = false, size = 'h-lg', textColor = 'text-secondary', class: className, children, ...rest }: Props = $props();
</script>

<a
	{href}
	data-nav-link
	tabindex="-1"
	class={[
		'bare relative z-raised row ycenter px-md weight-500 focus-ring',
		size,
		current ? '' : textColor,
		className
	]}
	aria-current={current ? 'page' : undefined}
	{...rest}
>
	{@render children?.()}
</a>
