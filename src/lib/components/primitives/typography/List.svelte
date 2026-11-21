<!-- @component A bulleted or numbered list, with markers the platform reset would otherwise hide. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Gap  } from '../../../internal/tokens.js';

	interface Props extends HTMLAttributes<HTMLUListElement> {
		as?: 'ul' | 'ol';
		gap?: Gap;
		children?: Snippet;
	}

	let { as = 'ul', gap = 'gap-xs', class: className, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} class={[as === 'ol' ? 'numbers' : 'bullets', 'box', gap, className]} {...rest}>
	{@render children?.()}
</svelte:element>
