<!-- @component A page heading at level 1 to 4; scale sets the visual size independently of the semantic level. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: 1 | 2 | 3 | 4;
		scale?: 1 | 2 | 3 | 4;
		children?: Snippet;
	}

	let { level = 2, scale, class: className, children, ...rest }: Props = $props();

	const levelClass = {
		1: 'page-title',
		2: 'text-2xl lh11 weight-600 ls-tight-lg',
		3: 'page-heading-xl',
		4: 'page-heading-lg'
	} as const;

	const visual = $derived(scale ?? level);
</script>

<svelte:element this={`h${level}`} class={[levelClass[visual], className]} {...rest}>
	{@render children?.()}
</svelte:element>
