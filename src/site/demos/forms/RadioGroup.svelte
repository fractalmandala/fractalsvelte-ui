<script lang="ts">
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';

	const options = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'team', label: 'Team' }
	];
</script>

<RadioGroup label="Plan" {options} />
