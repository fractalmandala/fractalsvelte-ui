<!-- @example Keyed swaps :: mode="sync" crosses the two panes; mode="wait" finishes the exit first. -->
<script lang="ts">
	import { Button, Presence } from '@fractaldesign/fractalsvelte-ui';

	const stories = [
		{ key: 'leader', title: 'Leader', body: 'A narrow win for the typesetters\' chapel.' },
		{ key: 'letter', title: 'Letter from Rome', body: 'The later editions held the piazza late into the evening.' },
		{ key: 'obit', title: 'Obituary', body: 'The compositor who taught a generation to see the line.' }
	] as const;

	let index = $state(0);
	let mode = $state<'sync' | 'wait'>('sync');
	let finished = $state(0);
	const story = $derived(stories[index]);
</script>

<div class="box gap-md measure-sm">
	<div class="row wrap gap-sm">
		<Button variant={mode === 'sync' ? 'primary' : 'ghost'} size="sm" onclick={() => (mode = 'sync')}>sync</Button>
		<Button variant={mode === 'wait' ? 'primary' : 'ghost'} size="sm" onclick={() => (mode = 'wait')}>wait</Button>
	</div>
	<div class="row wrap gap-sm">
		{#each stories as item, i}
			<Button variant={index === i ? 'secondary' : 'ghost'} size="sm" onclick={() => (index = i)}>{item.title}</Button>
		{/each}
	</div>
	<Presence show={true} key={story.key} {mode} enter="fly-up" exit="fly-down" onExitComplete={() => (finished += 1)}>
		<div class="card rim shad-md pad-lg">
			<p class="text-sm text-muted">{story.title}</p>
			<p class="weight-500">{story.body}</p>
			<p class="text-sm text-muted">Exits completed: {finished}</p>
		</div>
	</Presence>
</div>
