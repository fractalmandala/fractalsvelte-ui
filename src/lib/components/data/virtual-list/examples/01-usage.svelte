<!-- @example Usage :: Ten thousand audit events, a fixed row height, and scrollToIndex to jump into the list. -->
<script lang="ts">
	import { Button, VirtualList, type VirtualListHandle } from '@fractaldesign/fractalsvelte-ui';

	const actors = ['Ines Duarte', 'Kenji Mori', 'Amara Okafor', 'Lukas Berg', 'Nina Varela'];
	const events = ['deploy.ready', 'secret.rotated', 'alert.acked', 'branch.merged', 'token.revoked', 'invite.sent'];
	const targets = ['api-gateway', 'auth', 'billing', 'search', 'media', 'ledger'];

	const items = Array.from({ length: 10000 }, (_, index) => ({
		id: index + 1,
		event: events[index % events.length],
		actor: actors[index % actors.length],
		target: targets[index % targets.length]
	}));

	let list = $state<VirtualListHandle | undefined>();
</script>

<div class="box gap-sm">
	<div class="row wrap gap-sm ycenter">
		<Button variant="outline" size="sm" onclick={() => list?.scrollToIndex(0, { align: 'start' })}>Top</Button>
		<Button variant="outline" size="sm" onclick={() => list?.scrollToIndex(4999, { align: 'center' })}>Row 5,000</Button>
		<Button variant="outline" size="sm" onclick={() => list?.scrollToIndex(items.length - 1, { align: 'end' })}>Bottom</Button>
	</div>
	<VirtualList bind:this={list} {items} itemHeight={40} height={320} overscan={4} label="Audit events">
		{#snippet children(item, index)}
			<span class="text-sm text-muted tabular-nums shrink-0">{String(index + 1).padStart(5, '0')}</span>
			<span class="text-sm font-mono">{item.event}</span>
			<span class="text-sm text-secondary grow truncate">{item.actor} · {item.target}</span>
		{/snippet}
	</VirtualList>
</div>
