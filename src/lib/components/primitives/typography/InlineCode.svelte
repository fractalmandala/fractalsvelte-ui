<!-- @component A short code snippet in running text. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Shape, TextSize  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		textSize?: TextSize;
		shape?: Shape;
		children?: Snippet;
	}

	let { textSize = 'text-sm', shape = 'curved', class: className, children, ...rest }: Props = $props();
</script>

<code class={['font-mono bg-panel', textSize, '', shape, className]} {...rest}>{@render children?.()}</code>
