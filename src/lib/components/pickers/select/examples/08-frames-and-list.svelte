<!-- @example Frames and list look :: outline, ghost and secondary frames, each opening a list on its own surface with quieter secondary text. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	const plans = [
		{ value: 'hobby', label: 'Hobby', description: 'One project, community support' },
		{ value: 'pro', label: 'Pro', description: 'Unlimited projects, email support' },
		{ value: 'team', label: 'Team', description: 'Seats, SSO, priority support' }
	];
</script>

<div class="box gap-sm measure-xs">
	{#each ['outline', 'ghost', 'secondary'] as const as variant (variant)}
		<Select
			{variant}
			options={plans}
			value="pro"
			surface="paneled"
			childTextSize="text-sm"
			childTextColor="text-secondary"
			placeholder={`Plan — ${variant}`}
			aria-label={`Plan, ${variant} frame`}
		/>
	{/each}
</div>
