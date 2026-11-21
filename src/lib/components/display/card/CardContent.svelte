<!-- @component The body of the card. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type { Gap, TextColor } from '../../../internal/tokens.js';
	import { bodyClass, getCardContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		textColor?: TextColor;
		gap?: Gap;
		children?: Snippet;
	}

	let { textColor = 'text-secondary', gap = 'gap-sm', class: className, children, ...rest }: Props = $props();
	const card = getCardContext();
</script>

<div class={['box lh15', gap, textColor, bodyClass[card.size], className]} {...rest}>
	{@render children?.()}
</div>
