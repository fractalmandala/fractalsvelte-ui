<!-- @example Variants and type :: variant covers separated, contained and flush; type covers single and multiple; collapsible={false} keeps one item open. -->
<script lang="ts">
	import { Accordion, AccordionItem } from '@fractaldesign/fractalsvelte-ui';

	const variants = ['separated', 'contained', 'flush'] as const;
	let variant = $state<(typeof variants)[number]>('separated');
	let multiple = $state(false);
	let value = $state<string | string[] | null>('uptime');

	function onValueChange(next: string | string[] | null) {
		value = next;
	}
</script>

<div class="box gap-lg">
	<div class="row wrap gap-sm">
		{#each variants as item (item)}
			<button type="button" class={['button ghost modern h-bs text-sm', variant === item && 'soft']} onclick={() => (variant = item)}>
				{item}
			</button>
		{/each}
		<button type="button" class={['button ghost modern h-bs text-sm', multiple && 'soft']} onclick={() => { multiple = !multiple; value = multiple ? ['uptime'] : 'uptime'; }}>
			{multiple ? 'multiple' : 'single'}
		</button>
	</div>
	<Accordion
		type={multiple ? 'multiple' : 'single'}
		{variant}
		bind:value
		{onValueChange}
		collapsible={false}
		headingLevel={2}
	>
		<AccordionItem value="uptime" title="Uptime">
			<p class="text-sm text-secondary">We publish a 99.95% monthly target on the status page. Credits apply automatically when a month falls short.</p>
		</AccordionItem>
		<AccordionItem value="regions" title="Regions">
			<p class="text-sm text-secondary">Workloads run in us-east-1, eu-west-2 and ap-south-1. Data stays in the region you pick at project creation.</p>
		</AccordionItem>
		<AccordionItem value="maintenance" title="Maintenance" disabled>
			<p class="text-sm text-secondary">Scheduled maintenance is announced a week ahead and never starts during a region's business hours.</p>
		</AccordionItem>
	</Accordion>
</div>
