<!-- @example Placements and delays :: Every placement, a glass surface with its own type scale, a slower open delay and a snippet for the hint itself. -->
<script lang="ts">
	import { Button, Tooltip, type Placement } from '@fractaldesign/fractalsvelte-ui';

	const placements: Placement[] = [
		'top',
		'top-start',
		'top-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'left',
		'left-start',
		'left-end',
		'right',
		'right-start',
		'right-end'
	];
</script>

<div class="row wrap gap-sm xcenter">
	{#each placements as placement (placement)}
		<Tooltip {placement} surface="glass" textSize="text-bs" delay={500} closeDelay={200}>
			{#snippet trigger({ props })}
				<Button variant="outline" size="h-sm" {...props}>{placement}</Button>
			{/snippet}
			{#snippet content()}
				Anchored <span class="font-mono">{placement}</span>
			{/snippet}
		</Tooltip>
	{/each}
</div>
