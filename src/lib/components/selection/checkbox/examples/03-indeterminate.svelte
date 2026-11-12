<!-- @example Indeterminate :: A parent box that summarises its children and toggles them all. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';

	const channels = ['Email', 'Push', 'SMS'];
	let selected = $state<string[]>(['Email']);

	const all = $derived(selected.length === channels.length);
	const some = $derived(selected.length > 0 && !all);

	function toggleAll(checked: boolean) {
		selected = checked ? [...channels] : [];
	}
	function toggle(channel: string, checked: boolean) {
		selected = checked ? [...selected, channel] : selected.filter((c) => c !== channel);
	}
</script>

<div class="column gap-sm">
	<Checkbox
		label="All channels"
		checked={all}
		indeterminate={some}
		onCheckedChange={toggleAll}
	/>
	<div class="column gap-sm ml-lg">
		{#each channels as channel (channel)}
			<Checkbox
				label={channel}
				checked={selected.includes(channel)}
				onCheckedChange={(checked) => toggle(channel, checked)}
			/>
		{/each}
	</div>
</div>
