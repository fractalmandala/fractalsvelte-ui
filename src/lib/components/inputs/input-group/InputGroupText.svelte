<!-- @component Muted prefix or suffix text, such as a scheme or a unit. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The prefix or suffix text, such as a scheme or a unit. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<span class={['text-muted text-sm select-none shrink-0', klass]} {...rest}>
	{@render children?.()}
</span>
