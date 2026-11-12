<!-- @component The header section (<thead>) — holds the header row. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		/** The header row — a `TableRow` of `TableHeader` cells. */
		children?: Snippet;
	}

	let { class: klass, children, ...rest }: Props = $props();
</script>

<thead class={klass} {...rest}>
	{@render children?.()}
</thead>
