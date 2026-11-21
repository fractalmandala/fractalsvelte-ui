<!-- @example Widths and type :: Every width on the measure ladder, with the title, the description and the body on their own type scales. -->
<script lang="ts">
	import { Button, Dialog } from '@fractaldesign/fractalsvelte-ui';
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

<Dialog
	bind:open
	{width}
	title="Release notes — v4.2"
	description="Shipped on 12 November."
	gap="gap-sm"
	textSize="text-lg"
	childTextSize="text-sm"
	bodyTextSize="text-md"
	childTextColor="text-secondary"
>
	<p>Faster cold starts, a new audit log, and per-branch environment variables.</p>
</Dialog>
