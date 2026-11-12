<!-- @example Usage :: A start and end date for an analytics period, typed as segments in one field. -->
<script lang="ts">
	import { DateRangeField, formatIso, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: '2026-11-01', end: '2026-11-12' });
</script>

<div class="box gap-sm measure-sm">
	<DateRangeField bind:value={period} aria-label="Analytics period" />
	<p class="text-sm text-muted">
		{#if period.start && period.end}
			{formatIso(period.start)} – {formatIso(period.end)}
		{:else}
			Type a start and end date
		{/if}
	</p>
</div>
