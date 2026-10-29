<script lang="ts">
	import { SegmentedControl } from '$lib/styler';

	const options = [
		{ value: 'day', label: 'Day' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' }
	];
</script>

<SegmentedControl {options} />
