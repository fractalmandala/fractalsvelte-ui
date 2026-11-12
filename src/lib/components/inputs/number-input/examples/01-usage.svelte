<!-- @example Usage :: A bound quantity inside a Field, with a live total. -->
<script lang="ts">
	import { Field, NumberInput } from '@fractaldesign/fractalsvelte-ui';

	let seats = $state<number | null>(12);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Reserved seats" hint="The dining room holds 40.">
		<NumberInput bind:value={seats} min={0} max={40} />
	</Field>
	<p class="text-sm text-muted tabular-nums">
		{seats === null ? 'Enter a number of seats.' : `${seats} reserved · ${40 - seats} remaining.`}
	</p>
</div>
