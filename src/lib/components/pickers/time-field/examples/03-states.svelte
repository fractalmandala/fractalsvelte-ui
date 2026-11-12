<!-- @example States, sizes and forms :: sizes, shapes, min and max, invalid, disabled, readonly, and a named field in a form. -->
<script lang="ts">
	import { TimeField } from '@fractaldesign/fractalsvelte-ui';

	let time = $state<string | null>(null);
	let submitted = $state('');
	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('starts') ?? '');
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm measure-xs" onsubmit={submit}>
		<TimeField
			bind:value={time}
			min="08:00"
			max="18:00"
			locale="en-GB"
			invalid={!time}
			name="starts"
			aria-label="Shift starts"
			onValueChange={(v) => console.info('starts', v)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Schedule</button>
			<span class="text-sm text-muted">{submitted ? `Submitted starts=${submitted}` : 'A start time is required'}</span>
		</div>
	</form>
	<div class="box gap-sm measure-xs">
		{#each sizes as size (size)}
			<TimeField value="09:30" {size} aria-label={`Session starts (${size})`} />
		{/each}
	</div>
	<div class="box gap-sm measure-xs">
		{#each shapes as shape (shape)}
			<TimeField value="09:30" {shape} aria-label={`Session starts (${shape})`} />
		{/each}
	</div>
	<TimeField value="09:30" disabled aria-label="Locked start time" />
	<TimeField value="09:30" readonly aria-label="Published start time" />
</div>
