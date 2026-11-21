<!-- @example Usage :: Circular rings across tones and sizes, a step counter on a 1–12 scale, and an indeterminate spinner. -->
<script lang="ts">
	import { ProgressCircular } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<ProgressCircular value={72} showValue tone="info" size="h-xl" label="Download progress" />
	<ProgressCircular value={100} showValue tone="success" size="h-xl" label="Verified" />
	<ProgressCircular value={9} min={1} max={12} showValue tone="warning" size="h-lg" label="Step 9 of the import" />
	<ProgressCircular tone="neutral" size="h-md" label="Loading" />
</div>
