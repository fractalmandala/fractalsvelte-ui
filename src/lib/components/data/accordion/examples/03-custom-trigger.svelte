<!-- @example Custom trigger and heading level :: a trigger snippet and headingLevel={4}; collapsible allows the open item to close. -->
<script lang="ts">
	import { Accordion, AccordionItem } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>('changelog');
</script>

<Accordion bind:value type="single" variant="flush" collapsible headingLevel={4}>
	<AccordionItem value="changelog">
		{#snippet trigger()}
			<span class="box">
				<span class="weight-600">Changelog</span>
				<span class="text-sm text-muted">Released 12 November 2026</span>
			</span>
		{/snippet}
		<ul class="box gap-xs text-sm text-secondary">
			<li>Sticky headers now stay put inside a height-capped table.</li>
			<li>Data grids can expand a detail row under each record.</li>
			<li>The filter field remembers the query when you change page size.</li>
		</ul>
	</AccordionItem>
	<AccordionItem value="security" title="Security notes">
		<p class="text-sm text-secondary">Session tokens rotate every twelve hours. API keys are shown once at creation and can be revoked from the team page.</p>
	</AccordionItem>
</Accordion>
