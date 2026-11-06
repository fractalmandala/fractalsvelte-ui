<script lang="ts">
	import Combobox from '$lib/components/forms/Combobox.svelte';

	const options = [
		{ value: 'svelte', label: 'Svelte 5' },
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'fractalstyler', label: 'Fractalstyler' },
		{ value: 'typescript', label: 'TypeScript' }
	];

	let selected = $state('svelte');
</script>

<Combobox label="Technology" {options} bind:value={selected} />
