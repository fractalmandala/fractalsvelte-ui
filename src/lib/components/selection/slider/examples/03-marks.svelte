<!-- @example Marks :: A tick at every step, and custom labelled marks. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';

	let quality = $state(3);
	let zoom = $state(100);
</script>

<div class="measure-md column gap-xl">
	<Slider bind:value={quality} min={1} max={5} step={1} marks label="Quality" />
	<Slider
		bind:value={zoom}
		min={50}
		max={200}
		step={25}
		label="Zoom"
		marks={[
			{ value: 50, label: '50%' },
			{ value: 100, label: '100%' },
			{ value: 200, label: '200%' }
		]}
	/>
</div>
