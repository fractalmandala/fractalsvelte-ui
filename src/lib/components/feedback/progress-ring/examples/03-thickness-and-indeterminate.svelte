<!-- @example Thickness and indeterminate :: Three stroke thicknesses, a custom centre label, and a spinning ring. -->
<script lang="ts">
	import { ProgressRing } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<ProgressRing value={72} size="xl" thickness="sm" />
	<ProgressRing value={72} size="xl" thickness="md" />
	<ProgressRing value={72} size="xl" thickness="lg" />
	<ProgressRing value={4} max={8} size="xl" label="4 / 8" />
	<ProgressRing indeterminate size="xl" tone="info" label="Syncing" />
</div>
