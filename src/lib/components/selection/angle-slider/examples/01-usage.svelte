<!-- @example Usage :: Picking a linear gradient angle with 15-degree snapping. -->
<script lang="ts">
	import { AngleSlider } from '@fractaldesign/fractalsvelte-ui';

	let angle = $state(135);
</script>

<div class="row ycenter gap-md">
	<AngleSlider bind:value={angle} step={15} label="Gradient angle" />
	<span class="text-sm text-secondary tabular-nums">Direction: {angle}°</span>
</div>
