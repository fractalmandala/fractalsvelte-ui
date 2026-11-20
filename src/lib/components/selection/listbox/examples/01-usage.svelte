<!-- @example Usage :: Grouped multi-select role assignment list. -->
<script lang="ts">
	import { Listbox, type ListboxOption } from '@fractaldesign/fractalsvelte-ui';

	const options: ListboxOption[] = [
		{ value: 'admin', label: 'Administrator', description: 'Full billing and workspace access', group: 'Core' },
		{ value: 'editor', label: 'Editor', description: 'Create and publish content', group: 'Core' },
		{ value: 'viewer', label: 'Viewer', description: 'Read-only access across projects', group: 'External' },
		{ value: 'auditor', label: 'Auditor', description: 'Compliance logs only', group: 'External', disabled: true }
	];

	let selected = $state<string[]>(['editor']);
</script>

<div class="measure-xs wfull">
	<Listbox {options} bind:value={selected} multiple label="Assign roles" />
</div>
