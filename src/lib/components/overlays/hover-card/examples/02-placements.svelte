<!-- @example Placements and delays :: All eight placements, a solid surface, and a controlled card with slower delays. -->
<script lang="ts">
	import { HoverCard, type Placement } from '@fractaldesign/fractalsvelte-ui';

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

	let open = $state(false);
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm">
		{#each placements as placement (placement)}
			<HoverCard {placement} surface="solid" openDelay={200} closeDelay={160}>
				{#snippet trigger({ props })}
					<a href="https://northwind.dev/projects/harbour" class="text-theme text-sm" {...props}>{placement}</a>
				{/snippet}
				<p class="text-sm text-secondary">Preview of Harbour invoices, anchored {placement}.</p>
			</HoverCard>
		{/each}
	</div>

	<HoverCard bind:open placement="right" openDelay={0} closeDelay={400} onOpenChange={(next) => (open = next)}>
		{#snippet trigger({ props })}
			<a href="https://northwind.dev/projects/harbour" class="text-theme" {...props}>Harbour invoices</a>
		{/snippet}
		<div class="box gap-xs">
			<p class="weight-600 text-primary">Harbour invoices</p>
			<p class="text-sm text-secondary">
				{open ? 'Preview is open — move away to close.' : 'Preview is closed.'}
			</p>
		</div>
	</HoverCard>
</div>
