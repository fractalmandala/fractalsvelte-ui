<!-- @example Invalid, ref and children :: invalid marks the field; ref focuses the select; children supply the options. -->
<script lang="ts">
	import { Button, NativeSelect } from '@fractaldesign/fractalsvelte-ui';

	let plan = $state('');
	let select = $state<HTMLSelectElement | null>(null);
	let changes = $state(0);
	const invalid = $derived(plan === '');
</script>

<div class="box gap-sm measure-sm">
	<NativeSelect
		bind:value={plan}
		bind:ref={select}
		{invalid}
		placeholder="Choose a plan"
		aria-label="Plan"
		aria-describedby="plan-hint"
		onValueChange={() => changes++}
	>
		<option value="starter">Starter</option>
		<option value="team">Team</option>
		<option value="enterprise">Enterprise</option>
	</NativeSelect>
	<div class="row ycenter gap-sm">
		<Button size="sm" variant="secondary" onclick={() => select?.focus()}>Focus select</Button>
		<span id="plan-hint" class="text-sm text-muted">
			{invalid ? 'Pick a plan to continue.' : `${changes} changes. ${plan} is selected.`}
		</span>
	</div>
</div>
