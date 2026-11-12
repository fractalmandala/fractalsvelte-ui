<!-- @example Usage :: A contained single accordion — one item open at a time, closable. -->
<script lang="ts">
	import { Accordion, AccordionItem } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>('billing');
</script>

<Accordion bind:value>
	<AccordionItem value="billing" title="How are invoices issued?">
		<p class="text-sm text-secondary">Invoices go out on the first working day of the month, in USD, with a net-30 term. You can download a PDF from the billing page the moment it is issued.</p>
	</AccordionItem>
	<AccordionItem value="seats" title="Can I add seats mid-cycle?">
		<p class="text-sm text-secondary">Yes. New seats are prorated to the next invoice. Removing a seat takes effect at the end of the current period, so no one is cut off mid-month.</p>
	</AccordionItem>
	<AccordionItem value="sso" title="Do you support SSO?">
		<p class="text-sm text-secondary">SAML and OIDC are available on the Team plan. Send us the metadata URL and we will have a connection ready within a day.</p>
	</AccordionItem>
</Accordion>
