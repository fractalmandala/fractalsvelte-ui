<script lang="ts">
	// Page template section 1: the demo file src/lib/demos/<path>.svelte, rendered
	// in the demo box, with its own source shown below as the usage snippet.
	import type { Component } from 'svelte';
	import CodeSnippet from '../typography/CodeSnippet.svelte';

	interface Props {
		/** Path under lib/styler without extension, e.g. "actions/Button". */
		path: string;
	}

	let { path }: Props = $props();

	const demos = import.meta.glob<Component>('../../demos/**/*.svelte', { eager: true, import: 'default' });
	const sources = import.meta.glob<string>('../../demos/**/*.svelte', { eager: true, query: '?raw', import: 'default' });

	const key = $derived(`../../demos/${path}.svelte`);
	const Demo = $derived(demos[key]);
	const source = $derived(sources[key]);
</script>

{#if Demo}
	<div class="demo-box pad-2xl box xcenter ycenter" style:position="relative" style:z-index="2">
		<Demo />
	</div>
	{#if source}<CodeSnippet code={source} language="svelte" />{/if}
{:else}
	<p class="text-muted">No demo yet</p>
{/if}
