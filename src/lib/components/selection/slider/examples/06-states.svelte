<!-- @example States, bubbles and marks :: Disabled, a named slider that submits with a form, and one with marks whose bubble takes its own surface and corner and whose tick labels take their own ink. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';
</script>

<form class="measure-sm column gap-bs" onsubmit={(e) => e.preventDefault()}>
	<Slider name="brightness" value={70} label="Brightness" showValue />
	<Slider disabled value={25} label="Locked setting" />
	<Slider
		value={[20, 80]}
		label="Contrast window"
		marks
		showValue
		surface="paneled"
		shape="curved"
		childTextSize="text-sm"
		childTextColor="text-secondary"
	/>
</form>
