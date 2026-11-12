<!-- @example Usage :: A notifications feed you can add to and dismiss from. -->
<script lang="ts">
	import { AnimatedList, Button } from '@fractaldesign/fractalsvelte-ui';

	const incoming = [
		'Invoice INV-2048 was paid',
		'The autumn catalogue went to press',
		'A proof is waiting on the Vandercook',
		'Deploys are healthy across eu-west-1',
		'Two seats left on Friday\'s tasting'
	];

	let seq = $state(0);
	let notices = $state([
		{ id: 'n-1', text: 'Welcome back to the workshop' },
		{ id: 'n-2', text: 'Invoice INV-2041 is due 18 Nov' }
	]);

	function push() {
		const text = incoming[seq % incoming.length] ?? 'A new notice';
		seq += 1;
		notices = [...notices, { id: `n-${seq + 2}`, text }];
	}

	function dismiss(id: string) {
		notices = notices.filter((notice) => notice.id !== id);
	}
</script>

<div class="box gap-md measure-md">
	<Button variant="secondary" size="sm" onclick={push}>New notice</Button>
	<AnimatedList items={notices} key={(notice) => notice.id}>
		{#snippet children(notice)}
			<div class="row ycenter xbetween gap-sm pad-md bg-panel rim">
				<p class="text-sm">{notice.text}</p>
				<Button variant="ghost" size="sm" onclick={() => dismiss(notice.id)}>Dismiss</Button>
			</div>
		{/snippet}
	</AnimatedList>
</div>
