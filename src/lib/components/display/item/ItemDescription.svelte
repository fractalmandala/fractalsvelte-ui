<!-- @component Supporting text under the title. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type { TextColor, TextSize } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLParagraphElement> {
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let {
		textSize = 'text-sm',
		textColor = 'text-muted',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<p class={['lh14', textSize, textColor, className]} {...rest}>
	{@render children?.()}
</p>
