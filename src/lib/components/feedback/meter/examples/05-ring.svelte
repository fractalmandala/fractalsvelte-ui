<!-- @example Ring :: A circular gauge, three stroke thicknesses, and custom centre content. -->
<script lang="ts">
	import { Meter } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<Meter variant="ring" value={72} size="xl" thickness="sm" label="Battery" />
	<Meter variant="ring" value={72} size="xl" thickness="md" label="Battery" />
	<Meter variant="ring" value={72} size="xl" thickness="lg" label="Battery" />
	<Meter variant="ring" value={4} min={0} max={8} size="xl" label="Connected peers" valueText="4 of 8 peers">
		<span class="text-sm text-secondary">4 / 8</span>
	</Meter>
</div>
