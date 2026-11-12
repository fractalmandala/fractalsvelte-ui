<!-- @example Placements :: All eight placements, with an offset and a solid surface. -->
<script lang="ts">
	import { Button, Popover, type Placement } from '@fractaldesign/fractalsvelte-ui';

	const placements: Placement[] = [
		'top',
		'top-start',
		'top-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'left',
		'right'
	];
</script>

<div class="row wrap gap-sm xcenter">
	{#each placements as placement (placement)}
		<Popover {placement} offset="var(--space-md)" surface="solid">
			{#snippet target({ props })}
				<Button variant="outline" size="sm" {...props}>{placement}</Button>
			{/snippet}
			<p class="text-sm text-secondary">Anchored to the {placement} of the button.</p>
		</Popover>
	{/each}
</div>
