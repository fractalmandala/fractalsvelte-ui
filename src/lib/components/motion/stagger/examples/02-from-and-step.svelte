<!-- @example Origin and step :: The same row, staggered from the first child, the last, or the centre. -->
<script lang="ts">
	import { Button, Stagger } from '@fractaldesign/fractalsvelte-ui';

	const origins = ['first', 'last', 'center'] as const;
	let from = $state<(typeof origins)[number]>('first');
	let version = $state(0);
	const desks = ['News', 'Comment', 'Arts', 'Sport', 'Money'];
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm ycenter">
		{#each origins as origin}
			<Button variant={from === origin ? 'primary' : 'ghost'} size="sm" onclick={() => (from = origin)}>{origin}</Button>
		{/each}
		<Button variant="secondary" size="sm" onclick={() => (version += 1)}>Replay</Button>
	</div>
	{#key `${from}-${version}`}
		<Stagger {from} step={80} enter="scale" class="row wrap gap-sm">
			{#each desks as desk}
				<div class="card rim shad-sm pad-sm">
					<span class="text-sm weight-500">{desk}</span>
				</div>
			{/each}
		</Stagger>
	{/key}
</div>
