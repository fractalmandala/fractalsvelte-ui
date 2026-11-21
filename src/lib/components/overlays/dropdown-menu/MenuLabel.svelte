<!-- @component A section heading inside the menu. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type { TextColor, TextSize } from '../../../internal/tokens.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		textSize?: TextSize;
		textColor?: TextColor;
		children?: Snippet;
	}

	let { textSize = 'text-xs', textColor = 'text-muted', children, class: className, ...rest }: Props = $props();
</script>

<div class={['weight-500 px-sm pt-sm pb-xs select-none', textSize, textColor, className]} {...rest}>
	{@render children?.()}
</div>
