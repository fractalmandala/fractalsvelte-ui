<!-- @example Multiple :: mode="multiple" toggles any number of days — useful for scheduling publish slots. -->
<script lang="ts">
	import { Calendar, formatIso } from '@fractaldesign/fractalsvelte-ui';

	let days = $state<string[]>(['2026-11-12', '2026-11-19', '2026-11-26']);
</script>

<div class="box gap-sm measure-sm">
	<Calendar mode="multiple" bind:value={days} label="Publish slots" />
	<p class="text-sm text-muted">{days.length ? days.map((d) => formatIso(d, undefined, 'short')).join(', ') : 'No days selected'}</p>
</div>
