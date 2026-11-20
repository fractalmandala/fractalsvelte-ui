<!-- @example Tones :: Success, danger, warning, info, loading and a quiet neutral toast. -->
<script lang="ts">
	import { Button, toast } from '@fractaldesign/fractalsvelte-ui';

	const tones = ['success', 'danger', 'warning', 'info', 'loading', 'neutral'] as const;

	const samples: Record<(typeof tones)[number], string> = {
		success: 'Domain verified',
		danger: 'Payment failed for the card ending in 4242',
		warning: "You have used 91% of this month's build minutes",
		info: 'eu-west-3 is accepting deployments from today',
		loading: 'Publishing v2.8.1…',
		neutral: 'Changelog edits are stored locally until you publish'
	};
</script>

<div class="row wrap gap-sm">
	{#each tones as tone (tone)}
		<Button size="h-sm" variant="secondary" onclick={() => toast(samples[tone], { tone })}>{tone}</Button>
	{/each}
</div>
