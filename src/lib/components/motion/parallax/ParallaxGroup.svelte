<!-- @component A clipped frame that stacks Parallax layers into one scene. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The layered scene — typically several `Parallax` children at different speeds. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<div class={['relative overflow-hidden', klass]} {...rest}>
	{@render children?.()}
</div>
