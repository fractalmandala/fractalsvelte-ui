<!-- @example Usage :: Opening and closing hours typed as a start and end time in one field. -->
<script lang="ts">
	import { TimeRangeField, type TimeRange } from '@fractaldesign/fractalsvelte-ui';

	let hours = $state<TimeRange>({ start: '09:00', end: '17:30' });
</script>

<div class="box gap-sm measure-sm">
	<TimeRangeField bind:value={hours} aria-label="Opening hours" />
	<p class="text-sm text-muted">
		{#if hours.start && hours.end}
			Open {hours.start} – {hours.end}
		{:else}
			Type opening and closing times
		{/if}
	</p>
</div>
