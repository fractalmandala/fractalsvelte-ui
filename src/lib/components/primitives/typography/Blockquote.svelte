<!-- @component A quoted passage with a leading hairline. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLQuoteElement> {
		/** The quoted text, and an optional citation. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<blockquote class={['bl pl-bs text-secondary', klass]} {...rest}>
	{@render children?.()}
</blockquote>
