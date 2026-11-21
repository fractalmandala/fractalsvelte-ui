<!-- @example Type and ink :: The readout at three type scales, in the default ink and a muted one. -->
<script lang="ts">
	import { ProgressCircular } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<ProgressCircular value={72} showValue size="h-xl" label="Default readout" />
	<ProgressCircular value={72} showValue size="h-xl" textSize="text-md" textColor="text-primary" label="Larger, stronger" />
	<ProgressCircular value={72} showValue size="h-xl" textSize="text-sm" textColor="text-muted" label="Smaller, quieter" />
</div>
