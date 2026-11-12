<!-- @example Status :: Presence dots for online, away, busy and offline. -->
<script lang="ts">
	import { Avatar } from '@fractaldesign/fractalsvelte-ui';

	const team = [
		{ name: 'Maya Chen', status: 'online' },
		{ name: 'Omar Haddad', status: 'away' },
		{ name: 'Priya Shah', status: 'busy' },
		{ name: 'Jonas Berg', status: 'offline' }
	] as const;
</script>

<div class="row wrap gap-lg">
	{#each team as person (person.name)}
		<div class="row ycenter gap-sm">
			<Avatar name={person.name} status={person.status} />
			<div class="box">
				<span class="text-sm weight-500">{person.name}</span>
				<span class="text-xs text-muted">{person.status}</span>
			</div>
		</div>
	{/each}
</div>
