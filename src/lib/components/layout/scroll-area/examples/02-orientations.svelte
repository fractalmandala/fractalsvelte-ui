<!-- @example Orientations :: Horizontal rails and a region that scrolls on both axes. -->
<script lang="ts">
	import { ScrollArea } from '@fractaldesign/fractalsvelte-ui';

	const films = ['Lobby', 'Workshop', 'Archive', 'Garden', 'Stair', 'Desk', 'Mezzanine', 'Courtyard'];
	const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
	const cols = ['Design', 'Review', 'Build', 'QA', 'Ship', 'Retro'];
</script>

<div class="box gap-lg">
	<ScrollArea orientation="horizontal" scrollbar="auto" label="Project stills">
		<div class="row gap-md pad-md">
			{#each films as film}
				<div class="box gap-xs pad-md border-subtle radius-md bg-panel shrink-0 measure-xs">
					<span class="text-sm weight-500">{film}</span>
					<span class="text-sm text-muted">Studio still</span>
				</div>
			{/each}
		</div>
	</ScrollArea>

	<ScrollArea orientation="both" maxHeight="sm" scrollbar="auto" label="Week plan">
		<div class="box pad-md">
			<table class="text-sm">
				<thead>
					<tr>
						<th class="pad-sm text-muted weight-500">Day</th>
						{#each cols as col}
							<th class="pad-sm text-muted weight-500">{col}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as row, i}
						<tr>
							<td class="pad-sm weight-500">{row}</td>
							{#each cols as col, j}
								<td class="pad-sm text-secondary">{i === 2 && j === 4 ? 'Northwind 2.4' : '—'}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</ScrollArea>
</div>
