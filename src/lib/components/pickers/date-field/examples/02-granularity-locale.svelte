<!-- @example Granularity and locale :: day, month and year granularities, a British locale, and a placeholder used when incrementing an empty segment. -->
<script lang="ts">
	import { DateField, formatIso } from '@fractaldesign/fractalsvelte-ui';

	let day = $state<string | null>('2026-11-12');
	let month = $state<string | null>('2026-11-01');
	let year = $state<string | null>('2026-01-01');
</script>

<div class="box gap-md measure-xs">
	<DateField bind:value={day} granularity="day" locale="en-GB" placeholder="2026-11-12" aria-label="Publish date" />
	<DateField bind:value={month} granularity="month" locale="en-GB" aria-label="Report month" />
	<DateField bind:value={year} granularity="year" locale="en-GB" aria-label="Founded year" />
	<p class="text-sm text-muted">
		{day ? formatIso(day, 'en-GB', 'long') : 'No publish date'}
	</p>
</div>
