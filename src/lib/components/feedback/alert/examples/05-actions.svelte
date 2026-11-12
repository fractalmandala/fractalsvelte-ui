<!-- @example Actions :: Buttons beneath the message, for the next step the reader is likely to take. -->
<script lang="ts">
	import { Alert, Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<Alert tone="warning" title="Your trial ends in 3 days">
	Add a payment method to keep your workspace, history and integrations.
	{#snippet actions()}
		<Button size="sm" variant="primary">Add payment method</Button>
		<Button size="sm" variant="ghost">Remind me later</Button>
	{/snippet}
</Alert>
