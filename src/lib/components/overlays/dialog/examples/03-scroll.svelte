<!-- @example Scroll behaviour :: inside scrolls the body between a fixed header and footer; outside scrolls the whole panel like a page. -->
<script lang="ts">
	import { Button, Dialog } from '@fractaldesign/fractalsvelte-ui';

	const sections = [
		['Your account', 'You are responsible for the activity on your account and for keeping your credentials secure.'],
		['Acceptable use', 'Do not use the service to send spam, to probe other networks, or to host content you do not have rights to.'],
		['Billing', 'Plans renew monthly. Usage above the included quota is billed at the end of each cycle.'],
		['Data retention', 'Deleted projects are kept for 30 days and can be restored from the dashboard during that time.'],
		['Termination', 'You may close your account at any time. We may suspend accounts that breach these terms.'],
		['Changes', 'We will give you 30 days notice of material changes to these terms by email.']
	];
</script>

{#snippet terms()}
	<div class="box gap-bs">
		{#each [...sections, ...sections] as [heading, body], i (i)}
			<section class="box gap-xs">
				<h3 class="text-md weight-600 text-primary">{heading}</h3>
				<p>{body}</p>
			</section>
		{/each}
	</div>
{/snippet}

<div class="row wrap gap-sm">
	<Dialog title="Terms of service" scrollBehavior="inside">
		{#snippet trigger({ props })}
			<Button variant="outline" {...props}>Scroll inside</Button>
		{/snippet}
		{@render terms()}
		{#snippet footer({ close })}
			<Button onclick={close}>Accept</Button>
		{/snippet}
	</Dialog>
	<Dialog title="Terms of service" scrollBehavior="outside" size="lg">
		{#snippet trigger({ props })}
			<Button variant="outline" {...props}>Scroll outside</Button>
		{/snippet}
		{@render terms()}
		{#snippet footer({ close })}
			<Button onclick={close}>Accept</Button>
		{/snippet}
	</Dialog>
</div>
