<!-- @example Commit and cancel :: submitMode decides what commits the draft, and onCommit or onCancel reports which happened. -->
<script lang="ts">
	import { Editable } from '@fractaldesign/fractalsvelte-ui';

	let project = $state('Northwind migration');
	let owner = $state('Ada Lovelace');
	let code = $state('NW-114');
	let log = $state('Nothing changed yet');
</script>

<div class="box gap-lg measure-sm">
	<Editable
		bind:value={project}
		size="h-md"
		submitMode="enter"
		activationMode="click"
		onCommit={(value) => (log = `Project set to “${value}”`)}
		aria-label="Project name, commits on Enter"
	/>
	<Editable
		bind:value={owner}
		size="h-lg"
		submitMode="blur"
		onCommit={(value) => (log = `Owner set to “${value}”`)}
		aria-label="Owner, commits on blur"
	/>
	<Editable
		bind:value={code}
		size="h-xl"
		gap="gap-sm"
		submitMode="both"
		withControls
		saveButtonProps={{ variant: 'themed' }}
		cancelButtonProps={{ variant: 'danger' }}
		editButtonProps={{ size: 'h-md' }}
		onCommit={(value) => (log = `Issue set to “${value}”`)}
		onCancel={() => (log = 'Edit cancelled, value unchanged')}
		aria-label="Issue code with confirm and cancel buttons"
	/>
	<p class="text-sm text-secondary" aria-live="polite">{log}</p>
</div>
