<!-- @component The table caption — its accessible name; can be visually hidden. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type { TextColor, TextSize } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		visuallyHidden?: boolean;
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let {
		visuallyHidden = false,
		textSize = 'text-sm',
		textColor = 'text-secondary',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<caption class={[visuallyHidden ? 'sr-only' : [textSize, textColor, 'weight-500'], className]} {...rest}>
	{@render children?.()}
</caption>
