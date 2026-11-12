<!-- @example States, sizes and forms :: sizes, shapes, min and max, invalid, disabled, locale, and a named field in a form. -->
<script lang="ts">
	import { DatePicker } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>(null);
	let open = $state(false);
	let submitted = $state('');
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('ship') ?? '');
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm measure-xs" onsubmit={submit}>
		<DatePicker
			bind:value={date}
			bind:open
			min="2026-11-12"
			max="2027-01-31"
			locale="en-GB"
			weekStartsOn={1}
			invalid={!date}
			name="ship"
			placeholder="Ship on"
			aria-label="Ship date"
			onValueChange={(v) => console.info('ship', v)}
			onOpenChange={(o) => console.info('open', o)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Schedule</button>
			<span class="text-sm text-muted">{submitted ? `Submitted ship=${submitted}` : 'A ship date is required'}</span>
		</div>
	</form>
	<div class="box gap-sm measure-xs">
		{#each sizes as size (size)}
			<DatePicker value="2026-11-12" {size} aria-label={`Date (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-xs">
		{#each shapes as shape (shape)}
			<DatePicker value="2026-11-12" {shape} aria-label={`Date (${shape})`} />
		{/each}
	</div>
	<DatePicker value="2026-11-12" disabled aria-label="Locked date" />
</div>
