<!-- @example Usage :: Launching a three-step onboarding spotlight over controls. -->
<script lang="ts">
	import { Button, Tour, type TourStep } from '@fractaldesign/fractalsvelte-ui';

	let open = $state(false);
	let current = $state(0);

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

<Tour {steps} bind:open bind:current />
