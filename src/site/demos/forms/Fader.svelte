<script lang="ts">
	import Fader from '$lib/components/forms/Fader.svelte';
	let master = $state(75);
	let balance = $state(50);
</script>

<div class="row ycenter gap-xl wrap">
	<Fader bind:value={master} label="Master (dB)" orientation="vertical" />
	<Fader bind:value={balance} label="Crossfader" orientation="horizontal" />
</div>
