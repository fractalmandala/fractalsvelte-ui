<!-- @example States :: A disabled option, a disabled group and an invalid group in a form. -->
<script lang="ts">
	import { RadioGroup, Radio } from '@fractaldesign/fractalsvelte-ui';
</script>

<form class="column gap-lg" onsubmit={(e) => e.preventDefault()}>
	<RadioGroup name="region" aria-label="Region">
		<Radio value="eu" label="Europe (Frankfurt)" />
		<Radio value="us" label="United States (Virginia)" />
		<Radio value="ap" label="Asia Pacific (Singapore)" disabled description="Coming in Q3." />
	</RadioGroup>
	<RadioGroup disabled value="daily" aria-label="Backups">
		<Radio value="daily" label="Daily backups" />
		<Radio value="weekly" label="Weekly backups" />
	</RadioGroup>
	<RadioGroup invalid name="priority" aria-label="Priority">
		<Radio value="low" label="Low" />
		<Radio value="high" label="High" description="Choose a priority to continue." />
	</RadioGroup>
</form>
