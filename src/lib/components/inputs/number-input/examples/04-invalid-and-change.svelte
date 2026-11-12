<!-- @example Invalid and onValueChange :: A stock count that turns invalid at zero, reporting every change. -->
<script lang="ts">
	import { Field, NumberInput } from '@fractaldesign/fractalsvelte-ui';

	let stock = $state<number | null>(4);
	let changes = $state(0);
	const invalid = $derived(stock === 0);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Units in stock" error={invalid ? 'This size is sold out.' : undefined}>
		<NumberInput bind:value={stock} {invalid} min={0} max={99} onValueChange={() => changes++} />
	</Field>
	<p class="text-sm text-muted tabular-nums">{changes} adjustments. Use the wheel while the field is focused.</p>
</div>
