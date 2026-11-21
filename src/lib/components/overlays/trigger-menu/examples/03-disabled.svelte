<!-- @example Locked composer :: An archived thread keeps its last text but takes no mentions and opens no menu. -->
<script lang="ts">
	import { TriggerMenu, type TriggerConfig } from '@fractaldesign/fractalsvelte-ui';

	const triggers: TriggerConfig[] = [
		{
			trigger: '@',
			label: 'People',
			items: [{ value: 'ada', label: 'ada', description: 'Systems lead' }]
		}
	];
</script>

<div class="measure-sm wfull">
	<TriggerMenu
		{triggers}
		disabled
		value="Archived at 18:40 — thanks @ada for the review."
		placeholder="Comments are closed"
		size="h-lg"
		shape="round"
	/>
</div>
