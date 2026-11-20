<!-- @example Usage :: Determinate, striped, and indeterminate linear progress bars. -->
<script lang="ts">
	import { ProgressLinear } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-md measure-sm wfull">
	<ProgressLinear value={68} label="Uploading archive" showValue tone="info" />
	<ProgressLinear value={100} label="Build complete" showValue tone="success" striped animated />
	<ProgressLinear label="Connecting to worker…" tone="neutral" />
</div>
