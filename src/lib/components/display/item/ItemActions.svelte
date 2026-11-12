<!-- @component Trailing actions or metadata. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Trailing actions — a button, a badge, a switch. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<div class={['shrink-0 row ycenter gap-sm', klass]} {...rest}>
	{@render children?.()}
</div>
