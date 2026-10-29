<script lang="ts">
	import { Select } from '$lib/styler';

	const options = [
		{ value: 'in', label: 'India' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'us', label: 'United States' }
	];
</script>

<Select label="Country" {options} />
