<script lang="ts">
	import Popover from '$lib/components/overlays/Popover.svelte';
	import Button from '$lib/components/actions/Button.svelte';
</script>

<Popover>
	{#snippet trigger({ toggle })}<Button onclick={toggle}>Info</Button>{/snippet}
	<p>Popover content</p>
</Popover>
