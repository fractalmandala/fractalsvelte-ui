<!-- @example Usage :: Circular rings across tones, sizes, and indeterminate loading. -->
<script lang="ts">
	import { ProgressCircular } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<ProgressCircular value={72} showValue tone="info" size="h-2xl" label="Download progress" />
	<ProgressCircular value={100} showValue tone="success" size="h-2xl" label="Verified" />
	<ProgressCircular value={45} showValue tone="warning" size="h-3xl" label="Syncing" />
	<ProgressCircular tone="neutral" size="h-xl" label="Loading" />
</div>
