<!-- @example Placement and pinning :: The panel opens at a chosen offset, reports each open and close, and pinning freezes the header so it can no longer be dragged. -->
<script lang="ts">
	import { Button, FloatingPanel, Switch } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let pinned = $state(false);
	let x = $state(320);
	let y = $state(96);
	let lastChange = $state('not opened since load');

	function toggle() {
		open = !open;
	}
</script>

<div class="row gap-sm ycenter">
	<Button variant="outline" onclick={toggle}>{open ? 'Hide canvas notes' : 'Open canvas notes'}</Button>
	<span class="text-sm text-muted tabular-nums">x {x} · y {y} · last change: {lastChange}</span>
</div>

<FloatingPanel
	bind:open
	bind:x
	bind:y
	bind:pinned
	pinnable
	title="Canvas notes"
	shape="rect"
	width="18rem"
	pinButtonProps={{ variant: 'themed' }}
	minimizeButtonProps={{ size: 'h-md' }}
	closeButtonProps={{ variant: 'secondary' }}
	onOpenChange={(next) => (lastChange = next ? 'opened' : 'closed')}
>
	<div class="column gap-sm">
		<p class="text-sm text-secondary">Drag the header bar to move the panel; both offsets are bound and shown above.</p>
		<Switch bind:checked={pinned} label="Pin in place" />
	</div>
</FloatingPanel>
