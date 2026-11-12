<!-- @example Sizes :: Five sizes on the measure ladder — width for a side drawer, height for a top or bottom one. -->
<script lang="ts">
	import { Button, Drawer, type DialogSize } from '@fractaldesign/fractalsvelte-ui';

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

<Drawer bind:open {size} title="Release notes — v4.2" description="The width of a right-hand drawer, on the measure ladder.">
	<p>Faster cold starts, a new audit log, and per-branch environment variables.</p>
</Drawer>
