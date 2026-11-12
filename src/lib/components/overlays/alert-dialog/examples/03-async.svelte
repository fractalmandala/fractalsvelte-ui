<!-- @example Async confirm :: onConfirm may return a promise; the action stays loading until it settles. Returning false keeps the dialog open. -->
<script lang="ts">
	import { AlertDialog, Button } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let log = $state('No transfer yet');

	async function transfer(): Promise<boolean> {
		log = 'Contacting the ledger…';
		await new Promise((resolve) => setTimeout(resolve, 900));
		log = '£240 sent to Ada Lovelace.';
		return true;
	}
</script>

<div class="row wrap gap-sm ycenter">
	<Button variant="secondary" onclick={() => (open = true)}>Send payment</Button>
	<span class="text-sm text-muted">{log}</span>
</div>

<AlertDialog
	bind:open
	tone="success"
	title="Send £240 to Ada Lovelace?"
	description="The payment leaves your GBP account today and usually arrives instantly."
	confirmLabel="Send £240"
	cancelLabel="Not now"
	onConfirm={transfer}
	onCancel={() => (log = 'Transfer cancelled')}
	onOpenChange={(next) => {
		if (next) log = 'Review the transfer';
	}}
/>
