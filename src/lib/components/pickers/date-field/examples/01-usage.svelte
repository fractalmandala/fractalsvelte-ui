<!-- @example Usage :: A segmented date field bound to an ISO invoice date. -->
<script lang="ts">
	import { DateField, formatIso } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>('2026-11-12');
</script>

<div class="box gap-sm measure-xs">
	<DateField bind:value={date} aria-label="Invoice date" />
	<p class="text-sm text-muted">{date ? `Invoiced ${formatIso(date)}` : 'Type an invoice date'}</p>
</div>
