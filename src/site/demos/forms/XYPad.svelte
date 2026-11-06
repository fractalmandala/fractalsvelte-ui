<script lang="ts">
	import XYPad from '$lib/components/forms/XYPad.svelte';
	let pos = $state({ x: 65, y: 35 });
</script>

<div class="box gap-md max-w-md">
	<XYPad bind:value={pos} label="Synth Resonance & Cutoff" />
</div>
