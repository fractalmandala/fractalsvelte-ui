<script lang="ts">
	import { AlertDialog, Button } from '$lib/styler';
</script>

<AlertDialog
	title="Delete project?"
	description="This permanently deletes the Atlas project, its 24 files and all comments."
	confirmText="Delete project"
>
	{#snippet trigger({ open })}<Button onclick={open}>Delete project</Button>{/snippet}
	<p class="text-secondary">Team members lose access immediately. Export anything you need first; this cannot be undone.</p>
</AlertDialog>
