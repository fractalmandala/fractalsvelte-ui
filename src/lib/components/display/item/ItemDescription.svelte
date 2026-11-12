<!-- @component Supporting text under the title. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLParagraphElement> {
		/** The supporting text under the title. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<p class={['text-sm text-muted lh14', klass]} {...rest}>
	{@render children?.()}
</p>
