<!-- @example Frames and popover look :: outline, ghost and secondary frames, presets on a popover panel with their own scale and ink. -->
<script lang="ts">
	import { DateRangePicker, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: '2026-11-01', end: '2026-11-12' });
	const presets = [
		{ label: 'Last 7 days', value: { start: '2026-11-06', end: '2026-11-12' } },
		{ label: 'This month', value: { start: '2026-11-01', end: '2026-11-30' } }
	];
</script>

<div class="box gap-sm measure-sm">
	{#each ['outline', 'ghost', 'secondary'] as const as variant (variant)}
		<DateRangePicker
			bind:value={period}
			{variant}
			{presets}
			surface="paneled"
			childTextSize="text-md"
			childTextColor="text-secondary"
			placeholder={`Period — ${variant}`}
			aria-label={`Reporting period, ${variant} frame`}
		/>
	{/each}
</div>
