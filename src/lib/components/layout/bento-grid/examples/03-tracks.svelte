<!-- @example Tracks :: A tighter gap and shorter rows, with mixed column and row spans. -->
<script lang="ts">
	import { BentoGrid, BentoItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<BentoGrid columns={6} gap="var(--space-sm)" rowHeight="5rem">
	<BentoItem colSpan={3} rowSpan={2}>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm weight-500">Capacity</span>
			<span class="text-sm text-secondary">12 of 16 seats in use on the Studio plan this cycle.</span>
		</div>
	</BentoItem>
	<BentoItem colSpan={3} rowSpan={1}>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm weight-500">Storage</span>
			<span class="text-sm text-muted">84 GB of 250 GB.</span>
		</div>
	</BentoItem>
	<BentoItem colSpan={3}>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm weight-500">Build minutes</span>
			<span class="text-sm text-muted">1,204 of 3,000.</span>
		</div>
	</BentoItem>
</BentoGrid>
