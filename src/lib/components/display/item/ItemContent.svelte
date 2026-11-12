<!-- @component The growing middle column for the title and description. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The title, description and any other middle-column content. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<div class={['box grow wmin0', klass]} {...rest}>
	{@render children?.()}
</div>
