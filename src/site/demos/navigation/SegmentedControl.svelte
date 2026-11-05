<script lang="ts">
	import SegmentedControl from '$lib/components/navigation/SegmentedControl.svelte';

	const options = [
		{ value: 'day', label: 'Day' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' }
	];
</script>

<SegmentedControl {options} />
