<!-- @example Usage :: Launching a three-step onboarding spotlight over controls, with its own card surface, corner, inset and type scales, and a line reporting where the tour stands. -->
<script lang="ts">
	import { Button, Tour, type TourStep } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let current = $state(0);
	let readout = $state('Tour has not run yet');

	const steps: TourStep[] = [
		{
			target: '#tour-compose',
			title: 'Create quickly',
			description: 'Start a new draft here at any time.',
			placement: 'bottom'
		},
		{
			target: '#tour-publish',
			title: 'Ship when ready',
			description: 'Review diagnostics and publish live updates.',
			placement: 'bottom'
		},
		{
			title: 'All set',
			description: 'You are ready to customize every token and component.'
		}
	];
</script>

<div class="row wrap ycenter gap-sm">
	<Button id="tour-compose" variant="outline">New draft</Button>
	<Button id="tour-publish" variant="secondary">Publish</Button>
	<Button variant="themed" onclick={() => { current = 0; open = true; }}>Start tour</Button>
</div>

<p class="text-sm text-secondary mt-sm">{readout}</p>

<Tour
	{steps}
	bind:open
	bind:current
	surface="elevated"
	shape="curved"
	textSize="text-bs"
	childTextSize="text-sm"
	metaTextSize="text-sm"
	childTextColor="text-secondary"
	textColor="text-muted"
	onOpenChange={(next) => (readout = next ? 'Tour opened at step 1' : 'Tour closed')}
	onCurrentChange={(step) => (readout = `Showing step ${step + 1} of ${steps.length}`)}
	onComplete={() => (readout = 'Tour finished')}
	onSkip={() => (readout = 'Tour skipped')}
	closeButtonProps={{ size: 'h-sm' }}
	skipButtonProps={{ variant: 'outline' }}
	backButtonProps={{ variant: 'secondary' }}
	nextButtonProps={{ size: 'h-md' }}
/>
