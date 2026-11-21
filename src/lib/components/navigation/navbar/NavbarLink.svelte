<!-- @component A header link, with an optional current-page state. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAnchorAttributes  } from 'svelte/elements';
	import type {  TextColor  } from '../../../internal/tokens.js';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		current?: boolean;
		textColor?: TextColor;
		children?: Snippet;
	}

	let { href, current = false, textColor = 'text-secondary', class: className, children, ...rest }: Props = $props();
</script>

<a
	{href}
	class={['nav-link', current ? ' weight-500' : textColor, className]}
	aria-current={current ? 'page' : undefined}
	{...rest}
>
	{@render children?.()}
</a>
