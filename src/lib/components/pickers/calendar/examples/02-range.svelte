<!-- @example Range :: mode="range" takes a start and end; hovering previews the span before the second click. -->
<script lang="ts">
	import { Calendar, formatIso, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: '2026-11-09', end: '2026-11-20' });
</script>

<div class="box gap-sm">
	<Calendar mode="range" bind:value={period} numberOfMonths={2} label="Leave" />
	<p class="text-sm text-muted">
		{#if period.start && period.end}
			{formatIso(period.start)} – {formatIso(period.end)}
		{:else if period.start}
			From {formatIso(period.start)} — pick an end date
		{:else}
			Pick a start date
		{/if}
	</p>
</div>
