<script lang="ts">
	import {
		ContextMenu,
		ContextMenuTrigger,
		ContextMenuContent,
		ContextMenuItem,
		ContextMenuSeparator,
		ContextMenuLabel,
		ContextMenuShortcut
	} from 'fractalsvelte/components';

	let lastAction = $state('—');

	function act(label: string) {
		lastAction = label;
	}
</script>

<div class="row gap-s ycenter">
	<ContextMenu>
		<ContextMenuTrigger>
			<div class="card pad-m" style="min-width: 14rem">Right-click me</div>
		</ContextMenuTrigger>
		<ContextMenuContent>
			<ContextMenuLabel>Canvas</ContextMenuLabel>
			<ContextMenuItem onSelect={() => act('Rename')}>
				Rename<ContextMenuShortcut>⌘R</ContextMenuShortcut>
			</ContextMenuItem>
			<ContextMenuItem onSelect={() => act('Duplicate')}>
				Duplicate<ContextMenuShortcut>⌘D</ContextMenuShortcut>
			</ContextMenuItem>
			<ContextMenuSeparator />
			<ContextMenuItem tone="destructive" onSelect={() => act('Delete')}>Delete</ContextMenuItem>
		</ContextMenuContent>
	</ContextMenu>
	<span class="text-muted text-sm">Last action: {lastAction}</span>
</div>
