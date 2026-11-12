<!-- @example States, sizes and forms :: sizes, shapes, year granularity, min and max, invalid, disabled, readonly, and a named range in a form. -->
<script lang="ts">
	import { DateRangeField, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: null, end: null });
	let tenure = $state<DateRange>({ start: '2019-01-01', end: '2026-01-01' });
	let submitted = $state('');
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = `${data.get('leave-start') ?? ''} – ${data.get('leave-end') ?? ''}`;
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm measure-sm" onsubmit={submit}>
		<DateRangeField
			bind:value={period}
			min="2026-11-12"
			max="2027-01-31"
			locale="en-GB"
			invalid={!period.start || !period.end}
			name="leave"
			aria-label="Leave dates"
			onValueChange={(v) => console.info('leave', v)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Request leave</button>
			<span class="text-sm text-muted">{submitted.trim() !== '–' ? `Submitted ${submitted}` : 'Start and end dates are required'}</span>
		</div>
	</form>
	<DateRangeField bind:value={tenure} granularity="year" aria-label="Years of service" />
	<div class="box gap-sm measure-sm">
		{#each sizes as size (size)}
			<DateRangeField value={{ start: '2026-11-01', end: '2026-11-12' }} {size} aria-label={`Stay dates (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-sm">
		{#each shapes as shape (shape)}
			<DateRangeField value={{ start: '2026-11-01', end: '2026-11-12' }} {shape} aria-label={`Stay dates (${shape})`} />
		{/each}
	</div>
	<DateRangeField value={{ start: '2026-11-01', end: '2026-11-12' }} disabled aria-label="Locked stay dates" />
	<DateRangeField value={{ start: '2026-11-01', end: '2026-11-12' }} readonly aria-label="Published stay dates" />
</div>
