<!-- @example Text size :: The text scale can be set independently of the segment height. -->
<script lang="ts">
	import { SegmentedControl } from '@fractaldesign/fractalsvelte-ui';

	const options = [
		{ value: 'day', label: 'Day' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' }
	];
</script>

<div class="box gap-sm">
	<SegmentedControl size="h-lg" textSize="text-xs" {options} value="week" label="Extra-small type" />
	<SegmentedControl size="h-lg" textSize="text-sm" {options} value="week" label="Small type" />
	<SegmentedControl size="h-lg" textSize="text-md" {options} value="week" label="Medium type" />
	<SegmentedControl size="h-lg" textSize="text-lg" {options} value="week" label="Large type" />
	<SegmentedControl size="h-lg" textSize="text-xl" {options} value="week" label="Extra-large type" />
</div>
