<!-- @example Trends :: Up, down and flat deltas, and every tone. -->
<script lang="ts">
	import { Stat } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="grid-2 gap-xl">
	<Stat label="New subscribers" value={1840} delta={12.5} trend="up" hint="vs last week" />
	<Stat label="Churned seats" value={46} delta={-3.1} trend="down" hint="vs last week" />
	<Stat label="Active workspaces" value={312} delta={0} trend="flat" hint="No change this week" />
	<Stat
		label="Support first response"
		value="2m 14s"
		delta={-18}
		deltaAs="number"
		tone="info"
		hint="Seconds faster than last month"
	/>
	<Stat
		label="Failed payments"
		value={9}
		delta={2}
		deltaAs="number"
		tone="warning"
		hint="Needs a look today"
	/>
	<Stat label="Uptime this quarter" value="99.99%" delta={0} tone="success" hint="No incidents" />
	<Stat
		label="Open incidents"
		value={2}
		delta={1}
		deltaAs="number"
		tone="danger"
		hint="One raised in the last hour"
	/>
	<Stat
		label="Seats on the Team plan"
		value="3 of 10"
		delta={0}
		tone="neutral"
		hint="7 seats remaining"
	/>
</div>
