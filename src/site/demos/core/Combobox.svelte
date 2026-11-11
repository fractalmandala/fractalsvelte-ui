<script lang="ts">
	import { Combobox } from '@fractaldesign/fractalsvelte-ui';

	const options = [
		{ value: 'svelte', label: 'Svelte 5' },
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'fractalstyler', label: 'Fractalstyler' },
		{ value: 'typescript', label: 'TypeScript' }
	];

	let selected = $state('svelte');
</script>

<Combobox label="Technology" {options} bind:value={selected} />
