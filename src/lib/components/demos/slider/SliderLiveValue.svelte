<script>
	import { Slider } from 'fractalsvelte/components';
	let brightness = $state(72);
</script>

<div class="wfull" style="max-width: 22rem">
	<Slider label="Brightness" bind:value={brightness} showValue />
</div>
