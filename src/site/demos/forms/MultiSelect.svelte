<script lang="ts">
	import { MultiSelect } from '@fractaldesign/fractalsvelte-ui';

	const frameworkOptions = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'solid', label: 'Solid' }
	];

	let chosen = $state(['svelte']);
</script>

<MultiSelect label="Select Frameworks" options={frameworkOptions} bind:value={chosen} />
