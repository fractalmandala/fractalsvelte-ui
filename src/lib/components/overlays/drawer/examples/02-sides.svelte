<!-- @example Sides :: Dock the sheet to the left, right, top or bottom edge. The bottom edge has a drag-to-dismiss handle. -->
<script lang="ts">
	import { Button, Drawer } from '@fractaldesign/fractalsvelte-ui';

	const sides = [
		{ side: 'left' as const, label: 'Left — filters' },
		{ side: 'right' as const, label: 'Right — details' },
		{ side: 'top' as const, label: 'Top — status' },
		{ side: 'bottom' as const, label: 'Bottom — compose' }
	];
</script>

<div class="row wrap gap-sm">
	{#each sides as s (s.side)}
		<Drawer side={s.side} title={s.label} description="The sheet slides in from this edge.">
			{#snippet trigger({ props })}
				<Button variant="outline" {...props}>{s.side}</Button>
			{/snippet}
			<p>
				{#if s.side === 'bottom'}
					Drag the handle down to close, or use Esc.
				{:else}
					Use Esc or the close button when you are done.
				{/if}
			</p>
		</Drawer>
	{/each}
</div>
