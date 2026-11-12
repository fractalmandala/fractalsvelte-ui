<!-- @example Usage :: A volume slider with a value bubble. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';

	let volume = $state(40);
</script>

<div class="measure-sm column gap-sm">
	<Slider orientation="horizontal" bind:value={volume} label="Volume" showValue />
	<p class="text-sm text-muted tabular-nums">Volume {volume}%</p>
</div>
