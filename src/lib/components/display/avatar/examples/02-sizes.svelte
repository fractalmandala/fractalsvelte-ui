<!-- @example Sizes :: The five sizes of the shared size ladder, from xs to xl. -->
<script lang="ts">
	import { Avatar } from '@fractaldesign/fractalsvelte-ui';

	const people = [
		{ name: 'Maya Chen', size: 'h-xs' },
		{ name: 'Omar Haddad', size: 'h-sm' },
		{ name: 'Priya Shah', size: 'h-md' },
		{ name: 'Jonas Berg', size: 'h-lg' },
		{ name: 'Elena Rossi', size: 'h-xl' }
	] as const;
</script>

<div class="row ycenter gap-bs">
	{#each people as person (person.name)}
		<div class="box xcenter gap-xs">
			<Avatar name={person.name} size={person.size} />
			<span class="text-xs text-muted">{person.size}</span>
		</div>
	{/each}
</div>
