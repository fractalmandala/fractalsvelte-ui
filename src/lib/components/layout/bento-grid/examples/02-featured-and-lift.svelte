<!-- @example Featured and lift :: A featured tile sits raised; neighbouring tiles lift on hover. -->
<script lang="ts">
	import { BentoGrid, BentoItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<BentoGrid columns={3} rowHeight="8rem">
	<BentoItem colSpan={2} rowSpan={2} featured lift>
		<span class="text-sm text-muted">Studio journal</span>
		<span class="text-md weight-500">How we redesigned the invoice run</span>
		<span class="text-sm text-secondary">A three-week pass on statuses, reminders and the PDF, written up for the team.</span>
	</BentoItem>
	<BentoItem lift>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm text-muted">Reading time</span>
			<span class="text-sm weight-500">8 min</span>
		</div>
	</BentoItem>
	<BentoItem lift>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm text-muted">Published</span>
			<span class="text-sm weight-500">12 Nov 2026</span>
		</div>
	</BentoItem>
</BentoGrid>
