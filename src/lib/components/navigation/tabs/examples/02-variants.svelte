<!-- @example Variants :: Underline, pill and enclosed lists, each with a sliding indicator. -->
<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@fractaldesign/fractalsvelte-ui';

	const forms = ['flush', 'separated', 'contained'] as const;
	const labels = {
		flush: 'Underline',
		separated: 'Pill',
		contained: 'Enclosed'
	};
	let values = $state({ flush: 'read', separated: 'read', contained: 'read' });
</script>

<div class="box gap-xl">
	{#each forms as grouping (grouping)}
		<div class="box gap-sm">
			<p class="text-sm text-muted weight-500">{labels[grouping]}</p>
			<Tabs bind:value={values[grouping]} {grouping} surface={grouping === 'contained' ? 'paneled' : 'vacant'}>
				<TabList>
					<Tab value="read">Reading</Tab>
					<Tab value="queue">Up next</Tab>
					<Tab value="done">Finished</Tab>
				</TabList>
				<TabPanel value="read">
					<p class="text-body-sm text-secondary">You are mid-way through The Living Sea of Waking Dreams.</p>
				</TabPanel>
				<TabPanel value="queue">
					<p class="text-body-sm text-secondary">Next in the queue: A Line Made by Walking, reserved at the desk.</p>
				</TabPanel>
				<TabPanel value="done">
					<p class="text-body-sm text-secondary">Last finished: The Periodic Table, returned on Tuesday.</p>
				</TabPanel>
			</Tabs>
		</div>
	{/each}
</div>
