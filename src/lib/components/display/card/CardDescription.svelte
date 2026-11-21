<!-- @component Secondary text under the title. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type { TextColor } from '../../../internal/tokens.js';
	import { bodyClass, getCardContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLParagraphElement> {
		textColor?: TextColor;
		children?: Snippet;
	}

	let { textColor = 'text-secondary', class: className, children, ...rest }: Props = $props();
	const card = getCardContext();
</script>

<p class={['lh14', textColor, bodyClass[card.size], className]} {...rest}>
	{@render children?.()}
</p>
