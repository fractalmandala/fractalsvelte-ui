<!-- @example Frame, width and actions :: A hairline frame, a narrower text block with its own ink, a pair of next-step buttons, and the inset, gap and alignment of the dashed one. -->
<script lang="ts">
	import { EmptyState, Button } from '@fractaldesign/fractalsvelte-ui';
	import { luSearchX, luUsers } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-lg">
	<EmptyState
		icon={luSearchX}
		title="No people match “Northwind”"
		description="Try a shorter name, or clear the role filter to search the whole workspace."
		frame="none"
	/>
	<EmptyState
		icon={luUsers}
		title="No members in this project"
		description="Invite a teammate to share deploys, logs and on-call rotations."
		frame="bordered"
		measure="measure-md"
		pad="pad-xl"
		gap="gap-md"
		textColor="text-muted"
		childTextColor="text-secondary"
	>
		{#snippet actions()}
			<Button size="h-sm">Invite member</Button>
			<Button size="h-sm" variant="ghost">Copy invite link</Button>
		{/snippet}
	</EmptyState>
	<EmptyState
		icon={luUsers}
		title="Waiting for the first response"
		description="Forms published to this board have not received a submission."
		frame="dashed"
		alignContent="xcenter"
	/>
</div>
