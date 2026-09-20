<script lang="ts">
	import {
		ContextMenu,
		ContextMenuTrigger,
		ContextMenuContent,
		ContextMenuItem
	} from 'fractalsvelte/components';

	let lastAction = $state('—');

	function act(label: string) {
		lastAction = label;
	}
</script>

<div class="row gap-s ycenter">
	<ContextMenu>
		<ContextMenuTrigger>
			<div class="card pad-m" style="min-width: 14rem">Photo.jpg</div>
		</ContextMenuTrigger>
		<ContextMenuContent>
			<ContextMenuItem onSelect={() => act('Download')}>Download</ContextMenuItem>
			<ContextMenuItem onSelect={() => act('Share')}>Share…</ContextMenuItem>
			<ContextMenuItem disabled>Get info</ContextMenuItem>
		</ContextMenuContent>
	</ContextMenu>
	<span class="text-muted text-sm">Last action: {lastAction}</span>
</div>
