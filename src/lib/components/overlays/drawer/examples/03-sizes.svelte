<!-- @example Widths :: Every width on the measure ladder — width for a side drawer, height for a top or bottom one. -->
<script lang="ts">
	import { Button, Drawer } from '@fractaldesign/fractalsvelte-ui';
	import type {  Measure  } from '@fractaldesign/fractalsvelte-ui';

	const widths: Measure[] = ['measure-xs', 'measure-sm', 'measure-md', 'measure-lg', 'measure-xl', 'measure-2xl', 'measure-3xl', 'measure-4xl', 'measure-full'];
	let width = $state<Measure>('measure-md');
	let open = $state(false);
</script>

<div class="row wrap gap-sm">
	{#each widths as value (value)}
		<Button
			variant="outline"
			onclick={() => {
				width = value;
				open = true;
			}}>{value}</Button
		>
	{/each}
</div>

<Drawer bind:open {width} title="Release notes — v4.2" description="The width of a right-hand drawer, on the measure ladder.">
	<p>Faster cold starts, a new audit log, and per-branch environment variables.</p>
</Drawer>
