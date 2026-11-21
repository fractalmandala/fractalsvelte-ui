<!-- @example Fixed columns :: A stated column count instead of a minimum track width, so the tracks stay equal at every viewport. -->
<script lang="ts">
	import { SimpleGrid } from '@fractaldesign/fractalsvelte-ui';

	const metrics = [
		{ label: 'Requests', value: '1.24M' },
		{ label: 'Error rate', value: '0.31%' },
		{ label: 'p95 latency', value: '184ms' },
		{ label: 'Cache hit', value: '92.6%' },
		{ label: 'Events', value: '38.1M' },
		{ label: 'Seats', value: '24 of 30' }
	];
</script>

<SimpleGrid columns={2} gap="gap-md" class="measure-md">
	{#each metrics as metric (metric.label)}
		<div class="box gap-xs outlined modern pad-md">
			<span class="text-xs text-muted">{metric.label}</span>
			<span class="weight-600 tabular-nums">{metric.value}</span>
		</div>
	{/each}
</SimpleGrid>
