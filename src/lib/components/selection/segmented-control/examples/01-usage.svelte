<!-- @example Usage :: A calendar-scope control bound to a value. -->
<script lang="ts">
	import { SegmentedControl } from '@fractaldesign/fractalsvelte-ui';

	let scope = $state<'day' | 'week' | 'month'>('week');
	const options = [
		{ value: 'day', label: 'Day' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' }
	] as const;
</script>

<div class="box gap-sm">
	<SegmentedControl options={[...options]} bind:value={scope} label="Calendar scope" />
	<p class="text-sm text-muted">Showing the {scope} view</p>
</div>
