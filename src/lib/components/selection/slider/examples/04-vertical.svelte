<!-- @example Vertical :: Upright sliders, a mixer-style pair. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';

	let bass = $state(60);
	let treble = $state(35);
</script>

<div class="row gap-xl">
	<Slider orientation="vertical" bind:value={bass} label="Bass" showValue />
	<Slider orientation="vertical" bind:value={treble} label="Treble" showValue />
</div>
