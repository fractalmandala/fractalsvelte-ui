<!-- @example Menu items :: Icons, disabled rows and a danger row, with a custom menuLabel. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';
	import { luArchive, luCopyPlus, luPencil, luTrash2 } from '@fractaldesign/icons/lucide';
	import { luSave } from '@fractaldesign/icons/lucide';

	let message = $state('Nothing saved yet');
</script>

<div class="box gap-sm">
	<SplitButton
		variant="secondary"
		icon={luSave}
		menuLabel="More ways to save"
		onclick={() => (message = 'Saved to drafts')}
		items={[
			{ label: 'Save as copy', icon: luCopyPlus, onSelect: () => (message = 'Saved as a copy') },
			{ label: 'Rename', icon: luPencil, onSelect: () => (message = 'Renaming…') },
			{ label: 'Archive', icon: luArchive, disabled: true, onSelect: () => (message = 'Archived') },
			{ label: 'Delete draft', icon: luTrash2, danger: true, onSelect: () => (message = 'Draft deleted') }
		]}
	>
		Save
	</SplitButton>
	<p class="text-sm text-secondary" aria-live="polite">{message}</p>
</div>
