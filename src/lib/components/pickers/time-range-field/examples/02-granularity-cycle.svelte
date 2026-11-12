<!-- @example Granularity and hour cycle :: hour and second ranges, 12- and 24-hour clocks, and a placeholder for empty segments. -->
<script lang="ts">
	import { TimeRangeField, type TimeRange } from '@fractaldesign/fractalsvelte-ui';

	let shift = $state<TimeRange>({ start: '09:00', end: '17:00' });
	let window = $state<TimeRange>({ start: '01:00:00', end: '01:00:15' });
	let visit = $state<TimeRange>({ start: '14:00', end: '15:30' });
</script>

<div class="box gap-md measure-sm">
	<TimeRangeField bind:value={shift} granularity="hour" hourCycle={24} placeholder="09:00" aria-label="Shift hours" />
	<TimeRangeField bind:value={window} granularity="second" hourCycle={24} locale="en-GB" aria-label="Recording window" />
	<TimeRangeField bind:value={visit} granularity="minute" hourCycle={12} locale="en-US" aria-label="Visit time" />
	<p class="text-sm text-muted">
		{#if visit.start && visit.end}
			Visit {visit.start} – {visit.end}
		{:else}
			Type a visit window
		{/if}
	</p>
</div>
