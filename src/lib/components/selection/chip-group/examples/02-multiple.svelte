<!-- @example Multiple, with icons and counts :: multiple toggles any number of chips; icons and counts in their own ink and scale describe each filter, a corner shape sets the chip edge, and onValueChange reports the set. -->
<script lang="ts">
	import { ChipGroup, type ChipOption } from '@fractaldesign/fractalsvelte-ui';
	import { luActivity, luBox, luCpu, luGlobe } from '@fractaldesign/icons/lucide';

	let filters = $state<string[]>(['healthy', 'node']);
	const options: ChipOption[] = [
		{ value: 'healthy', label: 'Healthy', icon: luActivity, count: 48 },
		{ value: 'degraded', label: 'Degraded', icon: luActivity, count: 3 },
		{ value: 'node', label: 'Node.js', icon: luBox, count: 22 },
		{ value: 'python', label: 'Python', icon: luCpu, count: 17 },
		{ value: 'edge', label: 'Edge', icon: luGlobe, count: 9 }
	];
</script>

<div class="box gap-sm">
	<ChipGroup
		multiple
		{options}
		bind:value={filters}
		shape="modern"
		childTextSize="text-sm"
		childTextColor="text-secondary"
		label="Deployment filters"
		onValueChange={(v) => console.info('filters', v)}
	/>
	<p class="text-sm text-muted">{filters.length ? filters.join(', ') : 'No filters — showing all deployments'}</p>
</div>
