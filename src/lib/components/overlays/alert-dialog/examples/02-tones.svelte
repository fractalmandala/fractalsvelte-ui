<!-- @example Tones :: The confirm action takes its colour from tone — from a quiet confirm to a destructive one. -->
<script lang="ts">
	import { AlertDialog, Button } from '@fractaldesign/fractalsvelte-ui';

	const tones = [
		{
			tone: 'neutral' as const,
			confirmLabel: 'Switch branch',
			title: 'Switch to release/4.2?',
			description: 'Uncommitted changes on main will be stashed.'
		},
		{
			tone: 'info' as const,
			confirmLabel: 'Send digest',
			title: 'Send the weekly digest now?',
			description: 'It usually goes out Monday at 9:00. This sends it to all 48 subscribers immediately.'
		},
		{
			tone: 'success' as const,
			confirmLabel: 'Publish',
			title: 'Publish the changelog?',
			description: 'The notes for v4.2 will be visible on the blog and in the app.'
		},
		{
			tone: 'warning' as const,
			confirmLabel: 'Revoke key',
			title: 'Revoke sk_live_…4f2a?',
			description: 'Requests signed with this key will fail immediately. There is no grace period.'
		},
		{
			tone: 'danger' as const,
			confirmLabel: 'Delete project',
			title: 'Delete “Harbour invoices”?',
			description: 'This removes the project, its files and its deploy history. It cannot be undone.'
		}
	];
</script>

<div class="row wrap gap-sm">
	{#each tones as t (t.tone)}
		<AlertDialog tone={t.tone} title={t.title} description={t.description} confirmLabel={t.confirmLabel}>
			{#snippet trigger({ props })}
				<Button variant="outline" {...props}>{t.tone}</Button>
			{/snippet}
		</AlertDialog>
	{/each}
</div>
