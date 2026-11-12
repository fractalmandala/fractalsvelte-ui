<!-- @example Glass, non-modal and locked :: A glass surface, a non-modal sheet that leaves the page interactive, and a drawer that only its own buttons can close. -->
<script lang="ts">
	import { Button, Drawer } from '@fractaldesign/fractalsvelte-ui';

	let log = $state('No inspection yet');
</script>

<div class="row wrap gap-sm">
	<Drawer
		surface="glass"
		modal={false}
		title="Inspector"
		description="The page behind stays interactive."
		onOpenChange={(next) => (log = next ? 'Inspector open' : 'Inspector closed')}
	>
		{#snippet trigger({ props })}
			<Button variant="outline" {...props}>Glass, non-modal</Button>
		{/snippet}
		<p class="text-sm text-muted">{log}. Click around the page — it still responds.</p>
	</Drawer>

	<Drawer dismissible={false} closeButton={false}>
		{#snippet trigger({ props })}
			<Button variant="secondary" {...props}>Locked drawer</Button>
		{/snippet}
		{#snippet title()}Apply <span class="font-mono">status:open</span> and <span class="font-mono">assignee:me</span>?{/snippet}
		{#snippet description()}The current list of 128 issues will be replaced.{/snippet}
		<p>This drawer cannot be dismissed with Esc or a click outside.</p>
		{#snippet footer({ close })}
			<Button variant="ghost" onclick={close}>Keep current filters</Button>
			<Button onclick={close}>Apply filters</Button>
		{/snippet}
	</Drawer>
</div>
