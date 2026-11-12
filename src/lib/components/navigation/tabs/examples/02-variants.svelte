<!-- @example Variants :: Underline, pill and enclosed lists, each with a sliding indicator. -->
<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@fractaldesign/fractalsvelte-ui';

	const variants = ['underline', 'pill', 'enclosed'] as const;
	const labels = {
		underline: 'Underline',
		pill: 'Pill',
		enclosed: 'Enclosed'
	};
	let values = $state({ underline: 'read', pill: 'read', enclosed: 'read' });
</script>

<div class="box gap-xl">
	{#each variants as variant (variant)}
		<div class="box gap-sm">
			<p class="text-sm text-muted weight-500">{labels[variant]}</p>
			<Tabs bind:value={values[variant]} {variant}>
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
