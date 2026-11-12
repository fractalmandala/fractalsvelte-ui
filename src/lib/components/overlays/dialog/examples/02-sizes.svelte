<!-- @example Sizes :: Five widths on the measure ladder; full fills the viewport less a margin. -->
<script lang="ts">
	import { Button, Dialog, type DialogSize } from '@fractaldesign/fractalsvelte-ui';

	const sizes: DialogSize[] = ['sm', 'md', 'lg', 'xl', 'full'];
	let size = $state<DialogSize>('md');
	let open = $state(false);
</script>

<div class="row wrap gap-sm">
	{#each sizes as s (s)}
		<Button
			variant="outline"
			onclick={() => {
				size = s;
				open = true;
			}}>{s}</Button
		>
	{/each}
</div>

<Dialog bind:open {size} title="Release notes — v4.2" description="Shipped on 12 November.">
	<p>Faster cold starts, a new audit log, and per-branch environment variables.</p>
</Dialog>
