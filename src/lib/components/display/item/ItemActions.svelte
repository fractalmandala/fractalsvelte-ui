<!-- @component Trailing actions or metadata. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Gap  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		gap?: Gap;
		children?: Snippet;
	}

	let { gap = 'gap-sm', class: className, children, ...rest }: Props = $props();
</script>

<div class={['shrink-0 row ycenter', gap, className]} {...rest}>
	{@render children?.()}
</div>
