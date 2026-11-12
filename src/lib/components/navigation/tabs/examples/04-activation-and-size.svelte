<!-- @example Activation, size and disabled :: Manual activation waits for Enter or Space; every size on the control ladder, and a disabled tab. -->
<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	let manual = $state<string | null>('live');
	let size = $state<(typeof sizes)[number]>('md');
</script>

<div class="box gap-xl">
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">Manual activation</p>
		<Tabs bind:value={manual} activation="manual" variant="pill">
			<TabList label="Broadcast">
				<Tab value="live">Live</Tab>
				<Tab value="scheduled">Scheduled</Tab>
				<Tab value="archived" disabled>Archived</Tab>
			</TabList>
			<TabPanel value="live">
				<p class="text-body-sm text-secondary">
					The midday briefing is on air. Arrow keys move focus; Enter or Space selects the tab.
				</p>
			</TabPanel>
			<TabPanel value="scheduled">
				<p class="text-body-sm text-secondary">The evening edition goes out at 18:00, with a short weather window at 18:20.</p>
			</TabPanel>
			<TabPanel value="archived">
				<p class="text-body-sm text-secondary">Past briefings will be listed here once the archive is open.</p>
			</TabPanel>
		</Tabs>
	</div>
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">Sizes</p>
		<Tabs bind:value={size} {size} variant="enclosed">
			<TabList>
				{#each sizes as step (step)}
					<Tab value={step}>{step}</Tab>
				{/each}
			</TabList>
			{#each sizes as step (step)}
				<TabPanel value={step}>
					<p class="text-body-sm text-secondary">The tab list is drawn at the {step} step of the control ladder.</p>
				</TabPanel>
			{/each}
		</Tabs>
	</div>
</div>
