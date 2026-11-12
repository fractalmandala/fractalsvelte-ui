<!-- @example States, sizes and forms :: sizes, shapes, formats, min and max, invalid, disabled, locale, and a named range in a form. -->
<script lang="ts">
	import { DateRangePicker, type DateRange } from '@fractaldesign/fractalsvelte-ui';

	let period = $state<DateRange>({ start: null, end: null });
	let open = $state(false);
	let submitted = $state('');
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;
	const seed: DateRange = { start: '2026-11-01', end: '2026-11-12' };

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = `${data.get('leave-start')} – ${data.get('leave-end')}`;
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm measure-sm" onsubmit={submit}>
		<DateRangePicker
			bind:value={period}
			bind:open
			min="2026-01-01"
			max="2027-12-31"
			locale="en-GB"
			weekStartsOn={1}
			format="long"
			invalid={!period.start || !period.end}
			name="leave"
			placeholder="Leave dates"
			aria-label="Leave dates"
			onOpenChange={(o) => console.info('open', o)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Request leave</button>
			<span class="text-sm text-muted">{submitted ? `Submitted ${submitted}` : 'Start and end dates are required'}</span>
		</div>
	</form>
	<div class="box gap-sm measure-sm">
		{#each sizes as size (size)}
			<DateRangePicker value={seed} {size} aria-label={`Range (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-sm">
		{#each shapes as shape (shape)}
			<DateRangePicker value={seed} {shape} aria-label={`Range (${shape})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-sm">
		<DateRangePicker value={seed} format="short" aria-label="Short format" />
		<DateRangePicker value={seed} format="medium" aria-label="Medium format" />
	</div>
	<DateRangePicker value={seed} disabled aria-label="Locked range" />
</div>
