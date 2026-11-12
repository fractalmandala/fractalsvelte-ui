<!-- @example Usage :: A tab list and matching panels, bound to the selected value. -->
<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>('overview');
</script>

<Tabs bind:value onValueChange={() => {}} orientation="horizontal" activation="automatic">
	<TabList label="Publication">
		<Tab value="overview">Overview</Tab>
		<Tab value="activity">Activity</Tab>
		<Tab value="settings">Settings</Tab>
	</TabList>
	<TabPanel value="overview">
		<p class="text-body text-secondary">
			Northwind Atlas is a field guide to the coasts of the north Atlantic, updated twice a year
			by a small editorial desk in Reykjavík.
		</p>
	</TabPanel>
	<TabPanel value="activity">
		<p class="text-body text-secondary">
			The March edition added twelve harbour maps and a revised tide table for the Faroe Islands.
		</p>
	</TabPanel>
	<TabPanel value="settings">
		<p class="text-body text-secondary">
			Choose a digest frequency and whether new charts arrive as they are filed or in a weekly bundle.
		</p>
	</TabPanel>
</Tabs>
