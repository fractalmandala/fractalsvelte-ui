<script lang="ts">
	import { Waveform } from '@fractaldesign/fractalsvelte-ui';
	let progress = $state(42);
</script>

<div class="box gap-md max-w-lg">
	<Waveform bind:progress duration={214} />
</div>
