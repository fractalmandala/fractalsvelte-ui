<script>
	import { Slider } from 'fractalsvelte/components';
	let volume = $state(50);
</script>

<div class="wfull" style="max-width: 22rem">
	<Slider label="Volume" bind:value={volume} />
</div>
