<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The heading id (the table of contents links to it). */
		id: string;
		/** The heading text. */
		title: string;
		/** The section body. */
		children: Snippet;
	}

	let { id, title, children }: Props = $props();
</script>

<section class="box gap-bs" aria-labelledby={id}>
	<h2 {id} class="page-heading-lg anchored">{title}</h2>
	{@render children()}
</section>
