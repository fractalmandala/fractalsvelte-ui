<!-- @example Scrollbar and height :: Hover and hidden scrollbars, and every step of the measure ladder. -->
<script lang="ts">
	import { ScrollArea } from '@fractaldesign/fractalsvelte-ui';

	const lines = [
		'Draft the invoice reminder copy.',
		'Review the PDF renderer rollback note.',
		'Send the Friday 16:00 publish checklist.',
		'Close the two yearly-billing tickets.',
		'Publish the studio journal on the invoice run.',
		'Tag release 2.4.0 once QA signs off.'
	];
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<span class="text-sm weight-500">Hover scrollbar, xs height</span>
		<ScrollArea orientation="vertical" maxHeight="xs" scrollbar="hover" label="Hover scrollbar task list">
			<div class="box gap-sm pad-md">
				{#each lines as line}
					<span class="text-sm text-secondary">{line}</span>
				{/each}
			</div>
		</ScrollArea>
	</div>
	<div class="box gap-xs">
		<span class="text-sm weight-500">Hidden scrollbar, sm height</span>
		<ScrollArea orientation="vertical" maxHeight="sm" scrollbar="hidden" label="Hidden scrollbar task list">
			<div class="box gap-sm pad-md">
				{#each lines as line}
					<span class="text-sm text-secondary">{line}</span>
				{/each}
			</div>
		</ScrollArea>
	</div>
	<!-- Remaining measure steps, used so every maxHeight value appears. -->
	<div class="box gap-xs">
		<span class="text-sm weight-500">lg, xl and 2xl caps</span>
		<div class="box gap-md">
			<ScrollArea maxHeight="lg" label="Long task list, large cap">
				<div class="box gap-sm pad-md">
					{#each lines as line}
						<span class="text-sm text-secondary">{line}</span>
					{/each}
				</div>
			</ScrollArea>
			<ScrollArea maxHeight="xl" label="Long task list, extra-large cap">
				<div class="box gap-sm pad-md">
					{#each lines as line}
						<span class="text-sm text-secondary">{line}</span>
					{/each}
				</div>
			</ScrollArea>
			<ScrollArea maxHeight="2xl" label="Long task list, 2xl cap">
				<div class="box gap-sm pad-md">
					{#each lines as line}
						<span class="text-sm text-secondary">{line}</span>
					{/each}
				</div>
			</ScrollArea>
		</div>
	</div>
</div>
