<!-- @component Thin wrappers around fractalstyler's type scale: headings, lead and muted text, quotes, lists and inline code. -->

<script lang="ts">
	import type {  TextAlign  } from '../../../internal/tokens.js';
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	

	interface Props extends HTMLAttributes<HTMLDivElement> {
		align?: TextAlign;
		children?: Snippet;
	}

	let { align = 'center', class: className, children, ...rest }: Props = $props();

	const measureClass = $derived(align === 'left' || align === 'right' ? 'prose-left' : 'prose');
</script>

<div class={[measureClass, className]} {...rest}>
	{@render children?.()}
</div>
