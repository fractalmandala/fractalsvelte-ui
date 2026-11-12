<!-- @component The table caption — its accessible name; can be visually hidden. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Hides the caption visually while keeping it as the table's accessible name. */
		visuallyHidden?: boolean;
		/** The caption text. */
		children?: Snippet;
	}

	let { visuallyHidden = false, class: klass, children, ...rest }: Props = $props();
</script>

<caption class={[visuallyHidden ? 'sr-only' : 'text-sm text-secondary weight-500', klass]} {...rest}>
	{@render children?.()}
</caption>
