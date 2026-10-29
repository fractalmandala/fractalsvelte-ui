<script lang="ts">
	import { CommandPalette, Button } from '$lib/styler';

	const groups = [
		{
			category: 'Actions',
			items: [
				{ id: 'new', label: 'New file' },
				{ id: 'open', label: 'Open file' }
			]
		}
	];
</script>

<CommandPalette {groups}>
	{#snippet trigger({ open })}<Button onclick={open}>Open commands</Button>{/snippet}
</CommandPalette>
