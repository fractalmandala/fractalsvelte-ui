<!-- @example Usage :: Toggling and dragging a non-modal color inspector panel. -->
<script lang="ts">
	import { Button, FloatingPanel, Switch } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let snap = $state(true);
</script>

<Button variant="outline" onclick={() => (open = !open)}>
	{open ? 'Hide inspector' : 'Open inspector'}
</Button>

<FloatingPanel bind:open title="Inspector" pinnable width="20rem" surface="glass">
	<div class="column gap-sm">
		<p class="text-sm text-secondary">Drag the title bar to reposition without blocking the canvas.</p>
		<Switch bind:checked={snap} label="Snap to grid" />
	</div>
</FloatingPanel>
