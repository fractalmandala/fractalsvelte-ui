<!-- @example Cross-axis alignment and wrap :: start, center, end and stretch applied to the same column, beside a row that wraps onto a second line. -->
<script lang="ts">
	import { Stack } from '@fractaldesign/fractalsvelte-ui';

	const items = ['Deploys', 'Log search', 'Alerts'];
	const filters = ['Production', 'Europe', 'Last 24 hours', 'Warnings only', 'Slow queries'];
</script>

<div class="row wrap gap-lg">
	{#each ['start', 'center', 'end', 'stretch'] as const as align (align)}
		<Stack gap="gap-xs" {align} class="outlined modern pad-sm measure-xs">
			<span class="text-xs text-muted">{align}</span>
			{#each items as item (item)}
				<span class="bg-panel radius-xs pad-xs text-xs">{item}</span>
			{/each}
		</Stack>
	{/each}
</div>

<Stack direction="horizontal" gap="gap-sm" wrap class="outlined modern pad-sm measure-md mt-md">
	{#each filters as filter (filter)}
		<span class="bg-panel radius-xs pad-xs text-xs">{filter}</span>
	{/each}
</Stack>
