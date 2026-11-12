<!-- @component A bulleted or numbered list, with markers the platform reset would otherwise hide. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLUListElement> {
		/** `ul` is a bulleted list; `ol` is a numbered one. */
		as?: 'ul' | 'ol';
		/** The list items, as `<li>` elements. */
		children?: Snippet;
	}

	let { as = 'ul', class: klass, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} class={[as === 'ol' ? 'numbers' : 'bullets', 'box gap-xs', klass]} {...rest}>
	{@render children?.()}
</svelte:element>
