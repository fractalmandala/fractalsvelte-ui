<!-- @example Custom scale :: Neither bar starts at zero or ends at a hundred, so each readout is written by formatValue; the second carries its own type scale and ink. -->
<script lang="ts">
	import { ProgressLinear } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-md measure-sm wfull">
	<ProgressLinear
		value={180}
		min={0}
		max={250}
		size="h-lg"
		shape="rect"
		label="Events replayed"
		showValue
		formatValue={(value) => `${value} of 250`}
	/>
	<ProgressLinear
		value={20}
		min={0}
		max={40}
		size="h-md"
		shape="curved"
		gap="gap-sm"
		label="Worker connections"
		textSize="text-md"
		textColor="text-primary"
		childTextColor="text-secondary"
		showValue
		formatValue={(value) => `${value} of 40 in use`}
	/>
</div>
