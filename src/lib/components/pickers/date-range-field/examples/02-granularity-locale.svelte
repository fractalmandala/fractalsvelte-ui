<!-- @example Granularity and locale :: day and month ranges, a British locale, and a placeholder for empty segments. -->
<script lang="ts">
	import { DateRangeField, formatIso, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let stay = $state<DateRange>({ start: '2026-11-12', end: '2026-11-16' });
	let report = $state<DateRange>({ start: '2026-01-01', end: '2026-03-01' });
</script>

<div class="box gap-md measure-sm">
	<DateRangeField bind:value={stay} granularity="day" locale="en-GB" placeholder="2026-11-12" aria-label="Stay dates" />
	<DateRangeField bind:value={report} granularity="month" locale="en-GB" aria-label="Report months" />
	<p class="text-sm text-muted">
		{#if stay.start && stay.end}
			{formatIso(stay.start, 'en-GB')} – {formatIso(stay.end, 'en-GB')}
		{:else}
			Type check-in and check-out dates
		{/if}
	</p>
</div>
