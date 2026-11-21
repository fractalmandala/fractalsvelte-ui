<!-- @example Bounds and callbacks :: min and max narrow the sweep, and onValueChange reports every snapped angle. -->
<script lang="ts">
	import { AngleSlider } from '@fractaldesign/fractalsvelte-ui';

	let tilt = $state(-12);
	const side = $derived(tilt < 0 ? 'leaning left' : tilt > 0 ? 'leaning right' : 'upright');
</script>

<div class="box gap-sm">
	<div class="row ycenter gap-lg">
		<AngleSlider
			bind:value={tilt}
			min={-45}
			max={45}
			step={1}
			label="Photo tilt"
			onValueChange={(next) => (tilt = next)}
		/>
		<AngleSlider bind:value={tilt} min={-45} max={45} step={5} label="Photo tilt, coarse steps" />
	</div>
	<p class="text-sm text-secondary tabular-nums">{tilt}° — {side}</p>
</div>
