<!-- @example Usage :: A four-column studio dashboard with spanning tiles. -->
<script lang="ts">
	import { BentoGrid, BentoItem } from '@fractaldesign/fractalsvelte-ui';
</script>

<BentoGrid columns={4} gap="var(--space-md)" rowHeight="7rem">
	<BentoItem colSpan={2} rowSpan={2} featured>
		<span class="text-sm text-muted">Monthly recurring revenue</span>
		<span class="text-lg weight-500">$184,200</span>
		<span class="text-sm text-secondary">+8.4% from last month, 42 active workspaces.</span>
	</BentoItem>
	<BentoItem>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm text-muted">Deploys today</span>
			<span class="text-md weight-500 tabular-nums">18</span>
		</div>
	</BentoItem>
	<BentoItem>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm text-muted">Open incidents</span>
			<span class="text-md weight-500 tabular-nums">2</span>
		</div>
	</BentoItem>
	<BentoItem colSpan={2}>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm weight-500">Next publish</span>
			<span class="text-sm text-secondary">Northwind design system 2.4 — Friday 16:00 IST.</span>
		</div>
	</BentoItem>
	<BentoItem colSpan={2} rowSpan={1}>
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel hfull">
			<span class="text-sm weight-500">Review queue</span>
			<span class="text-sm text-muted">6 pull requests waiting on design sign-off.</span>
		</div>
	</BentoItem>
</BentoGrid>
