<!-- @component A vertical stack of items. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The items in the stack. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<div class={['box wfull', klass]} {...rest}>
	{@render children?.()}
</div>
