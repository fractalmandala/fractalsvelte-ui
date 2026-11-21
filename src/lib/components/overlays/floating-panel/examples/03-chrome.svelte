<!-- @example Header actions and footer :: A score editor with its own header button and title scale, a footer action row, a collapsible body on a wider inset and no close cross. -->
<script lang="ts">
	import { Button, FloatingPanel, Input } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let minimized = $state(false);
	let saved = $state('No changes yet');
	let tempo = $state('96');
</script>

<div class="row gap-sm ycenter">
	<Button variant="themed" onclick={() => (open = !open)}>Review score</Button>
	<span class="text-sm text-muted">{saved}</span>
</div>

<FloatingPanel
	bind:open
	bind:minimized
	title="Score editor"
	closable={false}
	shape="curved"
	textSize="text-md"
	width="20rem"
	x={80}
	y={140}
>
	{#snippet headerActions()}
		<Button variant="ghost" size="h-sm" onclick={() => (tempo = '96')}>Reset tempo</Button>
	{/snippet}
	<div class="column gap-sm">
		<p class="text-sm text-secondary">Second movement, rehearsal mark C. The minus button in the header folds this body away.</p>
		<label class="column gap-xs">
			<span class="text-xs text-muted">Tempo (bpm)</span>
			<Input bind:value={tempo} placeholder="96" />
		</label>
	</div>
	{#snippet footer()}
		<Button variant="ghost" size="h-sm" onclick={() => (open = false)}>Discard</Button>
		<Button
			variant="themed"
			size="h-sm"
			onclick={() => {
				saved = `Saved at ${tempo} bpm`;
				open = false;
			}}
		>
			Save
		</Button>
	{/snippet}
</FloatingPanel>
