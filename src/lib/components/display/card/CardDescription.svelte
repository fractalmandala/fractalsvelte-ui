<!-- @component Secondary text under the title. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { bodyClass, getCardContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLParagraphElement> {
		/** The supporting text. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
	const card = getCardContext();
</script>

<p class={['text-secondary lh14', bodyClass[card.size], klass]} {...rest}>
	{@render children?.()}
</p>
