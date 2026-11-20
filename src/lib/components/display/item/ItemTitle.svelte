<!-- @component The primary label of the row. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getItemContext, titleClass } from './context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The title text. */
		children?: Snippet;
	}

	let { class: className, children, ...rest }: Props = $props();
	const item = getItemContext();
</script>

<div class={['weight-500 lh13', titleClass[item.size], className]} {...rest}>
	{@render children?.()}
</div>
