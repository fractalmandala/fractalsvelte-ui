<!-- @example Position and pile :: The host takes a viewport position, a visible cap, a duration and an expand flag. -->
<script lang="ts">
	import { Button, toast } from '@fractaldesign/fractalsvelte-ui';
</script>

<!--
	Mount one Toaster near the root, with the position and pile props you want:

	<Toaster position="top" />
	<Toaster position="top-start" />
	<Toaster position="top-end" max={3} duration={4000} expand={false} />
	<Toaster position="bottom" />
	<Toaster position="bottom-start" />
	<Toaster position="bottom-end" expand={true} />
-->

<div class="row wrap gap-sm">
	<Button size="sm" onclick={() => toast('Deploy 27 reached all regions')}>Add a toast</Button>
	<Button size="sm" variant="secondary" onclick={() => toast('Deploy 28 reached all regions')}>Add another</Button>
	<Button size="sm" variant="secondary" onclick={() => toast('Deploy 29 reached all regions')}>And a third</Button>
	<p class="text-sm text-muted">
		Hover the pile to expand it. The usage example mounts the host at top-end.
	</p>
</div>
