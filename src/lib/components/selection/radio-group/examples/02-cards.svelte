<!-- @example Cards :: The card variant, each option a selectable bordered card with a title and description. -->
<script lang="ts">
	import { RadioGroup, Radio } from '@fractaldesign/fractalsvelte-ui';

	let plan = $state('pro');
</script>

<RadioGroup bind:value={plan} variant="card" aria-label="Choose a plan" class="measure-md">
	<Radio value="starter" label="Starter" description="For side projects. 3 projects, community support." />
	<Radio value="pro" label="Pro" description="For growing teams. Unlimited projects, priority support." />
	<Radio value="scale" label="Scale" description="For production workloads. SSO, audit logs and a 99.99% SLA." />
</RadioGroup>
