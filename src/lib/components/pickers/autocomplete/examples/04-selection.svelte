<!-- @example Selection feedback :: onValueChange reports every keystroke, onSelect reports the pick, and a custom message fills the empty list. -->
<script lang="ts">
	import { Autocomplete, type AutocompleteOption } from '@fractaldesign/fractalsvelte-ui';

	const registry: AutocompleteOption[] = [
		{ value: 'svelte', label: 'svelte', description: 'Cybernetically enhanced web apps' },
		{ value: 'sveltekit', label: '@sveltejs/kit', description: 'The application framework' },
		{ value: 'vite', label: 'vite', description: 'Dev server and bundler' }
	];

	let typed = $state('');
	let picked = $state<AutocompleteOption | null>(null);
</script>

<div class="column gap-sm measure-sm">
	<Autocomplete
		options={registry}
		emptyText="No package in the registry matches that name"
		placeholder="Install a package…"
		aria-label="Install a package"
		onValueChange={(next) => (typed = next)}
		onSelect={(item) => (picked = item)}
	/>
	<p class="text-xs text-muted">
		{#if picked}
			Chose {picked.label} — {picked.description}
		{:else if typed}
			Filtering on “{typed}”
		{:else}
			Type a package name, or a fragment of one.
		{/if}
	</p>
</div>
