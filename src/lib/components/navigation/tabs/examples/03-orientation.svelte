<!-- @example Orientation :: A vertical list, with the indicator running along the start edge. -->
<script lang="ts">
	import { Tabs, TabList, Tab, TabPanel } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>('studio');
</script>

<Tabs bind:value orientation="vertical" variant="underline">
	<div class="row gap-lg ytop">
		<TabList>
			<Tab value="studio">Studio</Tab>
			<Tab value="archive">Archive</Tab>
			<Tab value="credits">Credits</Tab>
		</TabList>
		<div class="grow">
			<TabPanel value="studio">
				<p class="text-body text-secondary">
					The studio is booked Tuesday through Friday. Lights and a mid-format camera are included;
					bring your own backs and film.
				</p>
			</TabPanel>
			<TabPanel value="archive">
				<p class="text-body text-secondary">
					Contact sheets from 2019 to last autumn are filed by sitting. High-resolution scans ship on request.
				</p>
			</TabPanel>
			<TabPanel value="credits">
				<p class="text-body text-secondary">
					Printed by North Press on a warm uncoated stock. Binding and foil by Harbour Bindery.
				</p>
			</TabPanel>
		</div>
	</div>
</Tabs>
