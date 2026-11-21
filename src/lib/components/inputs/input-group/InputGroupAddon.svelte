<!-- @component A start or end cluster of icons, text or buttons. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Gap  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		align?: 'start' | 'end';
		gap?: Gap;
		children?: Snippet;
	}

	let { align = 'start', gap = 'gap-xs', class: className, children, ...rest }: Props = $props();
</script>

<div class={['row ycenter shrink-0', gap, className]} data-align={align} {...rest}>
	{@render children?.()}
</div>
