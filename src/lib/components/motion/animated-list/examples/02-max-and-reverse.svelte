<!-- @example Max and reverse :: Newest first, keeping only the last three notices. -->
<script lang="ts">
	import { AnimatedList, Button } from '@fractaldesign/fractalsvelte-ui';

	const lines = [
		'Northwind approved the mark',
		'Fjord Line sent the cabin proofs',
		'Harbor & Co. booked a reprint',
		'Lumen Press asked for a second italic',
		'Oak & Iron collected the signage'
	];

	let seq = $state(lines.length);
	let notices = $state(lines.map((text, i) => ({ id: `m-${i + 1}`, text })));

	function push() {
		seq += 1;
		notices = [...notices, { id: `m-${seq}`, text: `Update ${seq}: the pallet has left Greenwich` }];
	}
</script>

<div class="box gap-md measure-md">
	<Button variant="secondary" size="sm" onclick={push}>New update</Button>
	<AnimatedList items={notices} key={(notice) => notice.id} max={3} reverse>
		{#snippet children(notice)}
			<div class="pad-md bg-panel rim">
				<p class="text-sm">{notice.text}</p>
			</div>
		{/snippet}
	</AnimatedList>
	<p class="text-xs text-muted">max 3, reverse. Older notices leave as new ones arrive.</p>
</div>
