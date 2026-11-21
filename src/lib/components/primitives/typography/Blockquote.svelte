<!-- @component A quoted passage with a leading hairline. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  TextColor  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLQuoteElement> {
		textColor?: TextColor;
		children?: Snippet;
	}

	let { textColor = 'text-secondary', class: className, children, ...rest }: Props = $props();
</script>

<blockquote class={['bl pl-bs', textColor, className]} {...rest}>
	{@render children?.()}
</blockquote>
