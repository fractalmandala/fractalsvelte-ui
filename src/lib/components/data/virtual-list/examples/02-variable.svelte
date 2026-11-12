<!-- @example Variable height :: itemHeight is an estimator; rendered rows are measured. height is a CSS length. -->
<script lang="ts">
	import { VirtualList } from '@fractaldesign/fractalsvelte-ui';

	const notes = [
		'Rotate the billing API key after the invoice run.',
		'The search reindex of the last hour finished in twelve minutes and the p99 dropped back under 200ms.',
		'Confirm the JWKS endpoint before rolling back an auth deploy.',
		'Pause the noisy webhook rather than dropping the queue — deliveries retry for 24 hours.',
		'Shed the preview transcode profile if the GPU pool saturates, then restore it once the backlog drains.',
		'Backfill late analytics events from the overflow topic with the dated job, never a full replay.'
	];
	const authors = ['Ines', 'Kenji', 'Amara', 'Lukas', 'Nina', 'Owen'];

	const items = Array.from({ length: 2000 }, (_, index) => ({
		id: `note-${index + 1}`,
		author: authors[index % authors.length],
		body: notes[index % notes.length]
	}));

	function itemHeight(index: number, item: (typeof items)[number]): number {
		const lines = Math.ceil(item.body.length / 48);
		return 52 + lines * 20;
	}
</script>

<VirtualList {items} {itemHeight} height="20rem" overscan={6} label="Team notes">
	{#snippet children(item)}
		<div class="box gap-xs pad-sm">
			<p class="text-sm weight-600">{item.author}</p>
			<p class="text-sm text-secondary">{item.body}</p>
		</div>
	{/snippet}
</VirtualList>
