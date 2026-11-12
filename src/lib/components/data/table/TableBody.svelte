<!-- @component The body section (<tbody>) — holds the data rows. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		/** The body rows — `TableRow`s of `TableCell`s. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<tbody class={klass} {...rest}>
	{@render children?.()}
</tbody>
