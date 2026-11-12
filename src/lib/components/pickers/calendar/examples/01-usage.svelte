<!-- @example Usage :: A single-month calendar bound to an ISO date. -->
<script lang="ts">
	import { Calendar, formatIso } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>('2026-11-12');
</script>

<div class="box gap-sm measure-sm">
	<Calendar mode="single" bind:value={date} label="Publish date" />
	<p class="text-sm text-muted">{date ? `Publishing on ${formatIso(date)}` : 'Pick a publish date'}</p>
</div>
