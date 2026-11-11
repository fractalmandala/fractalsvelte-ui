<script lang="ts">
	import { EmptyState, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<EmptyState
	title="No messages yet"
	description="When you receive new messages or alerts, they will appear here."
>
	{#snippet actions()}
		<Button variant="themed" size="h-sm">Refresh Inbox</Button>
	{/snippet}
</EmptyState>
