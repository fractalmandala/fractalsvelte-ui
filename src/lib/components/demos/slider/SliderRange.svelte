<script>
	import { Slider } from 'fractalsvelte/components';
	let zoom = $state(100);
</script>

<div class="wfull" style="max-width: 22rem">
	<Slider label="Zoom" bind:value={zoom} min={50} max={200} step={10} showValue />
</div>
