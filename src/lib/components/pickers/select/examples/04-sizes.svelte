<!-- @example Sizes :: Five sizes on the control ladder, matching buttons and inputs of the same size. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
	const plans = [
		{ value: 'hobby', label: 'Hobby' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'team', label: 'Team' },
		{ value: 'enterprise', label: 'Enterprise' }
	];
</script>

<div class="box gap-sm measure-xs">
	{#each sizes as size (size)}
		<Select options={plans} value="pro" {size} aria-label={`Plan (${size})`} />
	{/each}
</div>
