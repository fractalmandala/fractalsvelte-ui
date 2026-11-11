<script lang="ts">
	import { ContextMenu } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ id: 'copy', label: 'Copy' },
		{ id: 'paste', label: 'Paste' },
		{ id: 'delete', label: 'Delete' }
	];
</script>

<ContextMenu {items}>
	<div>Right-click here</div>
</ContextMenu>
