<!-- @example Usage :: A vertical group of radios bound to one value. -->
<script lang="ts">
	import { RadioGroup, Radio } from '@fractaldesign/fractalsvelte-ui';

	let plan = $state('team');
</script>

<RadioGroup value="a" textSize="text-sm" aria-label="Smaller type">
	<Radio value="a" label="Alpha" />
	<Radio value="b" label="Beta" />
</RadioGroup>
<RadioGroup bind:value={plan} variant="default" aria-label="Billing plan">
	<Radio value="solo" label="Solo" />
	<Radio value="team" label="Team" />
	<Radio value="enterprise" label="Enterprise" />
</RadioGroup>
<p class="text-sm text-muted">Selected plan: {plan}</p>
