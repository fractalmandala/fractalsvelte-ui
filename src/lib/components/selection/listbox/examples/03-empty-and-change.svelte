<!-- @example Empty list and onValueChange :: emptyText speaks when there is nothing to choose, and onValueChange reports the pick. -->
<script lang="ts">
	import { Listbox, type ListboxOption } from '@fractaldesign/fractalsvelte-ui';

	let members = $state<ListboxOption[]>([]);
	let chosen = $state('');
	let log = $state('Nothing chosen yet');

	const invitees: ListboxOption[] = [
		{ value: 'ada', label: 'Ada Lovelace', description: 'Owner' },
		{ value: 'grace', label: 'Grace Hopper', description: 'Maintainer' }
	];
</script>

<div class="box gap-sm">
	<div class="row wrap gap-lg">
		<div class="measure-xs">
			<Listbox options={invitees} emptyText="No members yet" onValueChange={(next) => (log = `Chose ${next}`)} label="Assign to a member" />
		</div>
		<div class="measure-xs">
			<Listbox options={members} emptyText="Invite a teammate first, then assign the task." label="Assignee" />
		</div>
	</div>
	<p class="text-sm text-secondary">{log}</p>
</div>
