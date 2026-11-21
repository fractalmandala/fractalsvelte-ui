<!-- @example Step, precision, format and locale :: A sterling invoice total, and the same amount shown the German way through locale and formatOptions. -->
<script lang="ts">
	import { Field, NumberInput } from '@fractaldesign/fractalsvelte-ui';

	let price = $state<number | null>(1284);
	let budget = $state<number | null>(96000);
</script>

<div class="measure-sm box gap-md">
	<Field label="Invoice total" hint="Arrow keys move by a pound; blur formats the amount.">
		<NumberInput
			bind:value={price}
			min={0}
			step={1}
			precision={2}
			format={{ style: 'currency', currency: 'GBP' }}
		/>
	</Field>
	<Field label="Berlin budget" hint="German grouping: dots for thousands, a comma for cents.">
		<NumberInput
			bind:value={budget}
			min={0}
			precision={2}
			locale="de-DE"
			formatOptions={{ style: 'currency', currency: 'EUR' }}
		/>
	</Field>
</div>
