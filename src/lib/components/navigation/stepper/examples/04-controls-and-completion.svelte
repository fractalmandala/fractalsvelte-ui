<!-- @example Built-in controls :: showControls walks the trail, and finishing replaces it with a completed panel that reports the moment it finished. -->
<script lang="ts">
	import { Stepper } from '@fractaldesign/fractalsvelte-ui';

	const steps = [
		{ value: 'workspace', label: 'Workspace', description: 'Name and region' },
		{ value: 'members', label: 'Members', description: 'Invite the first three' },
		{ value: 'billing', label: 'Billing', description: 'Card on file' }
	];

	let value = $state<string | null>('members');
	let finishedAt = $state('');
</script>

<div class="box gap-md measure-sm">
	<Stepper
		backButtonProps={{ variant: 'ghost' }}
		nextButtonProps={{ variant: 'primary', shape: 'round' }}
		{steps}
		bind:value
		showControls
		label="Workspace setup"
		onComplete={() => (finishedAt = `Setup finished at ${new Date().toLocaleTimeString()}`)}
	>
		{#snippet completedContent()}
			<p class="text-sm text-success">{finishedAt} — the workspace is ready.</p>
		{/snippet}
	</Stepper>
</div>
