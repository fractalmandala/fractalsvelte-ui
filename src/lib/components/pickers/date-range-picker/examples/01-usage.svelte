<!-- @example Usage :: A two-month range calendar bound to a start and end date. -->
<script lang="ts">
	import { DateRangePicker, formatIso, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: '2026-11-01', end: '2026-11-12' });
</script>

<div class="box gap-sm measure-sm">
	<DateRangePicker bind:value={period} placeholder="Analytics period" aria-label="Analytics period" />
	<p class="text-sm text-muted">
		{#if period.start && period.end}
			{formatIso(period.start)} – {formatIso(period.end)}
		{:else}
			Pick a start and end date
		{/if}
	</p>
</div>
