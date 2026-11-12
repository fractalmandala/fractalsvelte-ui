<!-- @example Types :: Success, error, warning, info, loading and a quiet neutral toast. -->
<script lang="ts">
	import { Button, toast } from '@fractaldesign/fractalsvelte-ui';

	const types = ['success', 'error', 'warning', 'info', 'loading', 'neutral'] as const;

	const samples: Record<(typeof types)[number], string> = {
		success: 'Domain verified',
		error: 'Payment failed for the card ending in 4242',
		warning: "You have used 91% of this month's build minutes",
		info: 'eu-west-3 is accepting deployments from today',
		loading: 'Publishing v2.8.1…',
		neutral: 'Changelog edits are stored locally until you publish'
	};
</script>

<div class="row wrap gap-sm">
	{#each types as type (type)}
		<Button size="sm" variant="secondary" onclick={() => toast(samples[type], { type })}>{type}</Button>
	{/each}
</div>
