<!-- @example Controlled, glass and locked :: bind:open with onOpenChange, snippet title and description, a glass surface, and a dialog that only its own buttons can close. -->
<script lang="ts">
	import { Button, Dialog } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let log = $state<string[]>([]);
</script>

<div class="row wrap gap-sm ycenter">
	<Button variant="secondary" onclick={() => (open = true)}>Rotate API key</Button>
	<span class="text-sm text-muted">{log.at(-1) ?? 'No changes yet'}</span>
</div>

<Dialog
	bind:open
	surface="glass"
	size="sm"
	dismissible={false}
	closeButton={false}
	onOpenChange={(next) => (log = [...log, next ? 'Opened' : 'Closed'])}
>
	{#snippet title()}Rotate <span class="font-mono">sk_live_…4f2a</span>?{/snippet}
	{#snippet description()}Requests signed with the old key keep working for <strong>24 hours</strong>.{/snippet}
	{#snippet footer({ close })}
		<Button variant="ghost" onclick={close}>Keep current key</Button>
		<Button variant="themed" onclick={close}>Rotate key</Button>
	{/snippet}
</Dialog>
