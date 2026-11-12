<!-- @component A section heading inside the menu. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The label text. */
		children?: Snippet;
	}

	let { children, class: klass, ...rest }: Props = $props();
</script>

<div class={['text-xs text-muted weight-500 px-sm pt-sm pb-xs select-none', klass]} {...rest}>
	{@render children?.()}
</div>
