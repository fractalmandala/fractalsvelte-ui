<script lang="ts">
	import EmptyState from '$lib/components/blocks/EmptyState.svelte';
	import Button from '$lib/components/actions/Button.svelte';
</script>

<EmptyState
	title="No messages yet"
	description="When you receive new messages or alerts, they will appear here."
>
	{#snippet actions()}
		<Button variant="themed" size="h-sm">Refresh Inbox</Button>
	{/snippet}
</EmptyState>
