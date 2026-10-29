<script lang="ts">
	// Page template section 2: install by CLI command, or copy the full source by hand.
	import Button from '../actions/Button.svelte';
	import Code from '../../fractalpop/Code.svelte';

	interface Props {
		/** Component name as exported from lib/styler/index.ts, e.g. "Button". */
		name: string;
		/** Path under lib/styler without extension, e.g. "actions/Button". */
		path: string;
	}

	let { name, path }: Props = $props();

	const sources = import.meta.glob<string>('../**/*.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	});
	const source = $derived(sources[`../${path}.svelte`] ?? '');
	const command = $derived(`pnpm dlx fractalsvelte-ui@latest add ${name.toLowerCase()}`);
	const tabs = [
		{ id: 'command', label: 'Command' },
		{ id: 'manual', label: 'Manual' }
	];
	let active = $state('command');

</script>

{#snippet tabStrip()}
	<div class="row ycenter gap-xs" role="tablist">
		{#each tabs as tab (tab.id)}
			<Button
				role="tab"
				aria-selected={active === tab.id}
				variant={active === tab.id ? 'secondary' : 'ghost'}
				size="h-sm"
				class="font-sans"
				onclick={() => (active = tab.id)}>{tab.label}</Button
			>
		{/each}
	</div>
{/snippet}

{#if active === 'command'}
	<Code code={command} lang="bash" header={tabStrip} />
{:else}
	<Code code={source} lang="svelte" header={tabStrip} lineNumbers />
{/if}
