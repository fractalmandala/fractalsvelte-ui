<!-- @example Animated panels :: Selected panels enter and leave with a spring fade. -->
<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>('departures');
</script>

<Tabs bind:value animated variant="underline">
	<TabList label="Board">
		<Tab value="departures">Departures</Tab>
		<Tab value="arrivals">Arrivals</Tab>
		<Tab value="notices">Notices</Tab>
	</TabList>
	<TabPanel value="departures">
		<p class="text-body text-secondary">
			The 09:40 to Bergen leaves from platform 3, on time. The 10:15 to Stavanger is boarding at platform 1.
		</p>
	</TabPanel>
	<TabPanel value="arrivals">
		<p class="text-body text-secondary">
			The overnight from Trondheim is due at 10:02 on platform 4, a few minutes behind the timetable.
		</p>
	</TabPanel>
	<TabPanel value="notices">
		<p class="text-body text-secondary">
			Lift work on the west concourse runs through Friday. Follow signs via the lower hall.
		</p>
	</TabPanel>
</Tabs>
