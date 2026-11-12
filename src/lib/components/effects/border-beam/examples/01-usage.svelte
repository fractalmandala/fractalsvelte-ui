<!-- @example Usage :: A feature card with a beam travelling around its border. -->
<script lang="ts">
	import { BorderBeam, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="relative overflow-hidden card box bg-surface border-subtle curved pad-lg gap-sm measure-sm">
	<BorderBeam />
	<p class="text-sm text-muted">Docs</p>
	<p class="card-title">Search that already knows the repo</p>
	<p class="text-body-sm text-secondary">Ask for the deploy script, the billing webhook, or last week's incident write-up — answers cite the file.</p>
	<Button variant="secondary" size="sm">Open the index</Button>
</div>
