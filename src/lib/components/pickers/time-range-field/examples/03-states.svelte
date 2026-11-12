<!-- @example States, sizes and forms :: sizes, shapes, min and max, invalid, disabled, readonly, and a named range in a form. -->
<script lang="ts">
	import { TimeRangeField, type TimeRange } from '@fractaldesign/fractalsvelte-ui';

	let hours = $state<TimeRange>({ start: null, end: null });
	let submitted = $state('');
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = `${data.get('hours-start') ?? ''} – ${data.get('hours-end') ?? ''}`;
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm measure-sm" onsubmit={submit}>
		<TimeRangeField
			bind:value={hours}
			min="08:00"
			max="22:00"
			locale="en-GB"
			invalid={!hours.start || !hours.end}
			name="hours"
			aria-label="Kitchen hours"
			onValueChange={(v) => console.info('hours', v)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Save hours</button>
			<span class="text-sm text-muted">{submitted.trim() !== '–' ? `Submitted ${submitted}` : 'Opening and closing times are required'}</span>
		</div>
	</form>
	<div class="box gap-sm measure-sm">
		{#each sizes as size (size)}
			<TimeRangeField value={{ start: '09:00', end: '17:30' }} {size} aria-label={`Opening hours (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-sm">
		{#each shapes as shape (shape)}
			<TimeRangeField value={{ start: '09:00', end: '17:30' }} {shape} aria-label={`Opening hours (${shape})`} />
		{/each}
	</div>
	<TimeRangeField value={{ start: '09:00', end: '17:30' }} disabled aria-label="Locked opening hours" />
	<TimeRangeField value={{ start: '09:00', end: '17:30' }} readonly aria-label="Published opening hours" />
</div>
