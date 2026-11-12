<!-- @example Usage :: A card that expands into a detail pane, morphing the shared cover. -->
<script lang="ts">
	import { SharedElement, morph } from '@fractaldesign/fractalsvelte-ui';

	const records = [
		{ id: 'holdsworth', title: 'Holdsworth', blurb: 'A quiet display face for the river museum, cut for glass and stone.' },
		{ id: 'fjord', title: 'Fjord Line', blurb: 'Timetables and cabin signage for a north-sea crossing.' },
		{ id: 'lumen', title: 'Lumen Press', blurb: 'The autumn catalogue, set in a new italic and printed on laid paper.' }
	];

	let open = $state<(typeof records)[number] | null>(null);
</script>

{#if open}
	<div class="measure-md">
		<SharedElement name="cover-{open.id}" class="box gap-sm pad-lg bg-panel rim shad-md">
			<p class="text-xs text-muted">From the catalogue</p>
			<h3 class="text-2xl weight-600">{open.title}</h3>
			<p class="text-sm text-secondary">{open.blurb}</p>
			<button class="button ghost" onclick={() => morph(() => { open = null; })}>Back to the grid</button>
		</SharedElement>
	</div>
{:else}
	<div class="grid-3 gap-md">
		{#each records as record (record.id)}
			<button class="bare" onclick={() => morph(() => { open = record; })}>
				<SharedElement name="cover-{record.id}" class="box gap-xs pad-md bg-panel rim shad-sm">
					<p class="text-lg weight-500">{record.title}</p>
					<p class="text-sm text-secondary">{record.blurb}</p>
				</SharedElement>
			</button>
		{/each}
	</div>
{/if}
