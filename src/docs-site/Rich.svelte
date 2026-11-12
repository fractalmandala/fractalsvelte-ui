<script lang="ts">
	interface Props {
		/** Text with `code` spans in backticks. */
		text: string;
	}

	let { text }: Props = $props();

	const parts = $derived(text.split(/(`[^`]+`)/g).filter(Boolean));
</script>

{#each parts as part, i (i)}{#if part.startsWith('`') && part.endsWith('`') && part.length > 1}<code class="code-chip">{part.slice(1, -1)}</code>{:else}{part}{/if}{/each}
