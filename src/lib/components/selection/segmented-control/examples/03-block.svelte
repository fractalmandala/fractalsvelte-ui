<!-- @example Block :: block stretches the control to the width of its container, with equal segments. -->
<script lang="ts">
	import { SegmentedControl } from '@fractaldesign/fractalsvelte-ui';

	let billing = $state('monthly');
	const options = [
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly' },
		{ value: 'usage', label: 'Pay as you go' }
	];
</script>

<div class="box gap-sm measure-sm">
	<SegmentedControl {options} bind:value={billing} block label="Billing period" />
	<p class="text-sm text-muted">Billed {billing === 'yearly' ? 'once a year' : billing === 'usage' ? 'on usage' : 'every month'}</p>
</div>
