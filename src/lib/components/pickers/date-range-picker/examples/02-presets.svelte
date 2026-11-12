<!-- @example Presets :: Quick ranges such as "Last 7 days", with a clearable field and a change callback. -->
<script lang="ts">
	import { DateRangePicker, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: null, end: null });
	const presets = [
		{ label: 'Last 7 days', value: { start: '2026-11-06', end: '2026-11-12' } },
		{ label: 'Last 30 days', value: { start: '2026-10-14', end: '2026-11-12' } },
		{ label: 'This month', value: { start: '2026-11-01', end: '2026-11-30' } },
		{ label: 'Last month', value: { start: '2026-10-01', end: '2026-10-31' } },
		{ label: 'Year to date', value: { start: '2026-01-01', end: '2026-11-12' } }
	];
</script>

<div class="measure-sm">
	<DateRangePicker
		bind:value={period}
		{presets}
		clearable
		placeholder="Pick a range"
		aria-label="Report range"
		onValueChange={(v) => console.info('range', v)}
	/>
</div>
