<!-- @component The body of the card. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { bodyClass, getCardContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The card's body. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
	const card = getCardContext();
</script>

<div class={['box gap-sm text-secondary lh15', bodyClass[card.size], klass]} {...rest}>
	{@render children?.()}
</div>
