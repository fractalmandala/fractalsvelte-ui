<!-- @example Usage :: A three-step checkout, bound to the current step. -->
<script lang="ts">
	import { Stepper, Button } from '@fractaldesign/fractalsvelte-ui';

	const steps = [
		{ value: 'address', label: 'Address', description: 'Delivery and billing' },
		{ value: 'shipping', label: 'Shipping', description: 'Arrives Thursday' },
		{ value: 'payment', label: 'Payment', description: 'Card or account' }
	];

	let value = $state<string | null>('shipping');
	const index = $derived(steps.findIndex((step) => step.value === value));
</script>

<div class="box gap-lg">
	<Stepper {steps} bind:value onValueChange={() => {}} label="Checkout" orientation="horizontal" linear clickable />
	<div class="row gap-sm">
		<Button variant="ghost" disabled={index <= 0} onclick={() => (value = steps[index - 1]?.value ?? value)}>
			Back
		</Button>
		<Button disabled={index >= steps.length - 1} onclick={() => (value = steps[index + 1]?.value ?? value)}>
			Continue
		</Button>
	</div>
</div>
