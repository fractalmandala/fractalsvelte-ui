<!-- @example Tones :: Success, danger, warning, info, a loading toast and a quiet neutral one. -->
<script lang="ts">
	import { Button, toast } from '@fractaldesign/fractalsvelte-ui';

	const tones = ['success', 'danger', 'warning', 'info', 'neutral'] as const;

	const samples: Record<(typeof tones)[number], string> = {
		success: 'Domain verified',
		danger: 'Payment failed for the card ending in 4242',
		warning: "You have used 91% of this month's build minutes",
		info: 'eu-west-3 is accepting deployments from today',
		neutral: 'Changelog edits are stored locally until you publish'
	};
</script>

<div class="row wrap gap-sm">
	{#each tones as tone (tone)}
		<Button size="h-sm" variant="secondary" onclick={() => toast(samples[tone], { tone })}>{tone}</Button>
	{/each}
	<Button size="h-sm" variant="secondary" onclick={() => toast.loading('Publishing v2.8.1…')}>loading</Button>
</div>
