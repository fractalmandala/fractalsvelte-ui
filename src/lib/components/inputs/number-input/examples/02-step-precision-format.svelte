<!-- @example Step, precision and format :: A currency amount rounded to cents and shown with Intl.NumberFormat. -->
<script lang="ts">
	import { Field, NumberInput } from '@fractaldesign/fractalsvelte-ui';

	let price = $state<number | null>(1284);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Invoice total" hint="Arrow keys move by a pound; blur formats the amount.">
		<NumberInput
			bind:value={price}
			min={0}
			step={1}
			precision={2}
			format={{ style: 'currency', currency: 'GBP' }}
		/>
	</Field>
</div>
