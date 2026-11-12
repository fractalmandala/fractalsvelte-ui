<!-- @example Granularity and hour cycle :: hour, minute and second granularities, 12- and 24-hour clocks, and a placeholder for empty segments. -->
<script lang="ts">
	import { TimeField } from '@fractaldesign/fractalsvelte-ui';

	let hour = $state<string | null>('09:00');
	let minute = $state<string | null>('09:30');
	let second = $state<string | null>('09:30:00');
	let twelve = $state<string | null>('14:15');
</script>

<div class="box gap-md measure-xs">
	<TimeField bind:value={hour} granularity="hour" hourCycle={24} placeholder="09:00" aria-label="Opens at" />
	<TimeField bind:value={minute} granularity="minute" hourCycle={24} locale="en-GB" aria-label="Kitchen closes" />
	<TimeField bind:value={second} granularity="second" hourCycle={24} aria-label="Cue point" />
	<TimeField bind:value={twelve} granularity="minute" hourCycle={12} locale="en-US" aria-label="Appointment time" />
	<p class="text-sm text-muted">{twelve ? `Appointment at ${twelve}` : 'Type an appointment time'}</p>
</div>
