<!-- @example States and control :: invalid marks a failed field, disabled locks it, and open with onOpenChange drives the list from outside. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let timezone = $state<string | null>(null);
	const zones = [
		{ value: 'America/New_York', label: 'Eastern Time — New York' },
		{ value: 'Europe/London', label: 'Greenwich Mean Time — London' },
		{ value: 'Asia/Kolkata', label: 'India Standard Time — Kolkata' },
		{ value: 'Asia/Tokyo', label: 'Japan Standard Time — Tokyo' }
	];
</script>

<div class="box gap-bs measure-xs">
	<div class="box gap-xs">
		<Select options={zones} bind:value={timezone} invalid={!timezone} placeholder="Time zone" aria-label="Time zone" aria-describedby="tz-help" />
		{#if !timezone}
			<p id="tz-help" class="text-sm text-danger">Choose a time zone for the schedule.</p>
		{/if}
	</div>
	<Select options={zones} value="Europe/London" disabled aria-label="Account time zone" />
	<div class="row ycenter gap-sm">
		<button class="button outline h-bs text-sm modern" type="button" onclick={() => (open = !open)}>
			{open ? 'Close' : 'Open'} from outside
		</button>
		<span class="text-sm text-muted">open = {open}</span>
	</div>
	<Select options={zones} bind:open onOpenChange={(o) => console.info('open', o)} placeholder="Controlled list" aria-label="Controlled" />
</div>
