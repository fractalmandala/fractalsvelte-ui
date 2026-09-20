<script>
	import {
		ContextMenu,
		ContextMenuTrigger,
		ContextMenuContent,
		ContextMenuCheckboxItem,
		ContextMenuRadioGroup,
		ContextMenuRadioItem,
		ContextMenuSeparator
	} from 'fractalsvelte/components';

	let snap = $state(true);
	let grid = $state('md');
</script>

<ContextMenu>
	<ContextMenuTrigger>
		<div class="card pad-m" style="min-width: 14rem">View settings</div>
	</ContextMenuTrigger>
	<ContextMenuContent>
		<ContextMenuCheckboxItem checked={snap} onCheckedChange={(v) => (snap = v)}>
			Snap to grid
		</ContextMenuCheckboxItem>
		<ContextMenuSeparator />
		<ContextMenuRadioGroup value={grid} onValueChange={(v) => (grid = v)}>
			<ContextMenuRadioItem value="sm">Small grid</ContextMenuRadioItem>
			<ContextMenuRadioItem value="md">Medium grid</ContextMenuRadioItem>
			<ContextMenuRadioItem value="lg">Large grid</ContextMenuRadioItem>
		</ContextMenuRadioGroup>
	</ContextMenuContent>
</ContextMenu>
