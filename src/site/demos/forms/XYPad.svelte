<script lang="ts">
	import { XYPad } from '@fractaldesign/fractalsvelte-ui';
	let pos = $state({ x: 65, y: 35 });
</script>

<div class="box gap-md wfull">
	<XYPad bind:value={pos} label="Synth Resonance & Cutoff" />
</div>
