<!-- @example Range :: A two-thumb price range with step, formatting and a change callback. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';

	let price = $state<[number, number]>([200, 800]);
	let changes = $state(0);
</script>

<div class="measure-md column gap-sm">
	<Slider
		bind:value={price}
		min={0}
		max={1000}
		step={50}
		label="Price"
		showValue
		format={(v) => `$${v}`}
		onValueChange={() => changes++}
	/>
	<p class="text-sm text-muted tabular-nums">${price[0]} to ${price[1]}, {changes} changes</p>
</div>
