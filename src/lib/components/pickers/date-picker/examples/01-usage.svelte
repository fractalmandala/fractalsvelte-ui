<!-- @example Usage :: A date field bound to an ISO value, with the calendar opening from the field. -->
<script lang="ts">
	import { DatePicker, formatIso } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>('2026-11-12');
</script>

<div class="box gap-sm measure-xs">
	<DatePicker bind:value={date} placeholder="Publish on" aria-label="Publish date" />
	<p class="text-sm text-muted">{date ? `Publishing on ${formatIso(date)}` : 'Pick a publish date'}</p>
</div>
