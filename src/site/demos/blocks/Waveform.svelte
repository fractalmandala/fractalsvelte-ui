<script lang="ts">
	import Waveform from '$lib/components/blocks/Waveform.svelte';
	let progress = $state(42);
</script>

<div class="box gap-md max-w-lg">
	<Waveform bind:progress duration={214} />
</div>
