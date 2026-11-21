<!-- @example Position and pile :: One host near the root takes the viewport position, a visible cap, a duration and an expand flag; the buttons below push toasts into all four registered hosts. -->
<script lang="ts">
	import { Button, Toaster, toast } from '@fractaldesign/fractalsvelte-ui';

	const hosts = [
		{ position: 'top-start', max: 2, duration: 4000, expand: false },
		{ position: 'top-end', max: 3, duration: 4000, expand: true },
		{ position: 'bottom-start', max: 2, duration: 5000, expand: false },
		{ position: 'bottom-end', max: 3, duration: 5000, expand: true }
	] as const;
</script>

{#each hosts as host (host.position)}
	<Toaster position={host.position} max={host.max} duration={host.duration} expand={host.expand} />
{/each}

<div class="row wrap gap-sm">
	<Button size="h-sm" onclick={() => toast('Deploy 27 reached all regions')}>Add a toast</Button>
	<Button size="h-sm" variant="secondary" onclick={() => toast('Deploy 28 reached all regions')}>Add another</Button>
	<Button size="h-sm" variant="secondary" onclick={() => toast('Deploy 29 reached all regions')}>And a third</Button>
	<p class="text-sm text-muted">Four hosts, four corners: hover a pile to expand it.</p>
</div>
