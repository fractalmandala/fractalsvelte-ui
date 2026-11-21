<!-- @component Body, lead, muted, large or small text, rendered as a p, span, div or similar via as. -->

<script lang="ts">
	import type { TextColor, TextSize } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		textSize?: TextSize;
		textColor?: TextColor;
		as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'label';
		children?: Snippet;
	}

	let { textSize = 'text-md', textColor, as = 'p', class: className, children, ...rest }: Props = $props();

</script>

<svelte:element this={as} class={[textSize, textColor, className]} {...rest}>
	{@render children?.()}
</svelte:element>
