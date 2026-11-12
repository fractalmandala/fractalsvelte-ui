<!-- @example Imperative confirm :: Mount Confirmer once and call confirm(); it returns a promise that resolves to the choice. -->
<script lang="ts">
	import { Button, Confirmer, confirm } from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No changes yet');

	async function archive() {
		const ok = await confirm({
			title: 'Archive “Harbour invoices”?',
			description: 'The project leaves the sidebar. You can restore it from Archives for 90 days.',
			tone: 'warning',
			confirmLabel: 'Archive project',
			cancelLabel: 'Keep in sidebar'
		});
		log = ok ? 'Project archived.' : 'Kept in the sidebar.';
	}
</script>

<div class="row wrap gap-sm ycenter">
	<Button variant="outline" onclick={archive}>Archive project</Button>
	<span class="text-sm text-muted">{log}</span>
</div>

<Confirmer />
