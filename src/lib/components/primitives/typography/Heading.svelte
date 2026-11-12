<!-- @component A page heading at level 1 to 4; size sets the visual scale independently of the semantic level. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		/** The heading level, 1 to 4. Pick the one that fits the page outline. */
		level?: 1 | 2 | 3 | 4;
		/** The visual size. Follows `level` when omitted. */
		size?: 1 | 2 | 3 | 4;
		/** The heading text. */
		children?: Snippet;
	}

	let { level = 2, size, class: klass, children, ...rest }: Props = $props();

	const levelClass = {
		1: 'page-title text-primary',
		2: 'text-2xl lh11 weight-600 ls-tight-lg text-primary',
		3: 'page-heading-xl text-primary',
		4: 'page-heading-lg text-primary'
	} as const;

	const visual = $derived(size ?? level);
</script>

<svelte:element this={`h${level}`} class={[levelClass[visual], klass]} {...rest}>
	{@render children?.()}
</svelte:element>
