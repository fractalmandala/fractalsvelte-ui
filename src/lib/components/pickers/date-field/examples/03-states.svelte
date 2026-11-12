<!-- @example States, sizes and forms :: sizes, shapes, min and max, invalid, disabled, readonly, and a named field in a form. -->
<script lang="ts">
	import { DateField } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>(null);
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
		<DateField
			bind:value={date}
			min="2026-11-12"
			max="2027-01-31"
			locale="en-GB"
			invalid={!date}
			name="ship"
			aria-label="Ship date"
			onValueChange={(v) => console.info('ship', v)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Schedule</button>
			<span class="text-sm text-muted">{submitted ? `Submitted ship=${submitted}` : 'A ship date is required'}</span>
		</div>
	</form>
	<div class="box gap-sm measure-xs">
		{#each sizes as size (size)}
			<DateField value="2026-11-12" {size} aria-label={`Invoice date (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-xs">
		{#each shapes as shape (shape)}
			<DateField value="2026-11-12" {shape} aria-label={`Invoice date (${shape})`} />
		{/each}
	</div>
	<DateField value="2026-11-12" disabled aria-label="Locked invoice date" />
	<DateField value="2026-11-12" readonly aria-label="Published date" />
</div>
