<!-- @example Usage :: Free-text search box filtering framework suggestions. -->
<script lang="ts">
	import { Autocomplete } from '@fractaldesign/fractalsvelte-ui';

	const suggestions = [
		{ value: 'svelte', label: 'SvelteKit', description: 'Full-stack web framework' },
		{ value: 'fractal', label: 'Fractalstyler', description: 'Semantic CSS styling tokens' },
		{ value: 'vite', label: 'Vite', description: 'Next generation frontend tooling' },
		{ value: 'gpui', label: 'GPUI', description: 'GPU-accelerated native UI framework' }
	];

	let query = $state('');
</script>

<div class="column gap-sm measure-xs wfull">
	<Autocomplete bind:value={query} options={suggestions} placeholder="Search ecosystem…" aria-label="Search ecosystem" />
	{#if query}
		<p class="text-xs text-muted">Query: {query}</p>
	{/if}
</div>
