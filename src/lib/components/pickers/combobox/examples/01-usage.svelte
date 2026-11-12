<!-- @example Usage :: A searchable list of teammates, bound to a value and the field text. -->
<script lang="ts">
	import { Combobox } from '@fractaldesign/fractalsvelte-ui';

	let person = $state<string | null>('maya');
	let query = $state('Maya Chen');
	const people = [
		{ value: 'maya', label: 'Maya Chen', description: 'Design systems' },
		{ value: 'jonah', label: 'Jonah Adeyemi', description: 'Platform' },
		{ value: 'priya', label: 'Priya Natarajan', description: 'Infrastructure' },
		{ value: 'luca', label: 'Luca Moretti', description: 'Documentation' },
		{ value: 'hana', label: 'Hana Yoshida', description: 'Quality' }
	];
</script>

<div class="box gap-sm measure-xs">
	<Combobox options={people} bind:value={person} bind:inputValue={query} placeholder="Search the team" aria-label="Assignee" />
	<p class="text-sm text-muted">Assigning to {person ?? 'no one yet'}</p>
</div>
