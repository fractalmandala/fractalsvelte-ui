<script lang="ts">
	import type { Snippet } from 'svelte';
	import DocsShell from '../../docs-site/DocsShell.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<DocsShell>{@render children()}</DocsShell>
