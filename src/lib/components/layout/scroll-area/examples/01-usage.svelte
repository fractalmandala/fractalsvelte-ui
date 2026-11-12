<!-- @example Usage :: A vertical changelog with a thin scrollbar and edge fades. -->
<script lang="ts">
	import { ScrollArea } from '@fractaldesign/fractalsvelte-ui';

	const entries = [
		{ version: '2.4.0', note: 'Invoice statuses, reminders at 7, 14 and 21 days, and a rewritten PDF renderer.' },
		{ version: '2.3.2', note: 'Fixed the yearly billing flag that left two workspaces on the monthly plan.' },
		{ version: '2.3.1', note: 'Quieter danger colour in dark mode; chroma now follows the theme token.' },
		{ version: '2.3.0', note: 'Onboarding starts with a sample invoice and a three-step checklist.' },
		{ version: '2.2.0', note: 'Workspace roles: commenter, editor and admin, with a seat cap on the Team plan.' },
		{ version: '2.1.0', note: 'Export a run as CSV. Dates stay in Asia/Calcutta, amounts stay tabular.' },
		{ version: '2.0.0', note: 'The first Studio release: invoices, clients and a shared audit log.' }
	];
</script>

<ScrollArea orientation="vertical" maxHeight="md" scrollbar="auto" label="Changelog">
	<div class="box gap-bs pad-md">
		{#each entries as entry}
			<div class="box gap-xs">
				<span class="text-sm weight-500 font-mono">{entry.version}</span>
				<span class="text-sm text-secondary">{entry.note}</span>
			</div>
		{/each}
	</div>
</ScrollArea>
