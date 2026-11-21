<!-- @component Muted prefix or suffix text, such as a scheme or a unit. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  TextColor, TextSize  } from '../../../internal/tokens.js';
	import { getInputGroupContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let { textSize, textColor = 'text-muted', class: className, children, ...rest }: Props = $props();

	const group = getInputGroupContext();
	const resolvedTextSize = $derived(textSize ?? group.textSize ?? 'text-sm');
</script>

<span class={[textColor, resolvedTextSize, 'select-none shrink-0', className]} {...rest}>
	{@render children?.()}
</span>
