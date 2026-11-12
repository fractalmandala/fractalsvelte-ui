<!-- @example Usage :: A select with a few options and a bound value. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	let region = $state<string | null>('eu-west-1');
	const regions = [
		{ value: 'us-east-1', label: 'US East (N. Virginia)' },
		{ value: 'us-west-2', label: 'US West (Oregon)' },
		{ value: 'eu-west-1', label: 'Europe (Ireland)' },
		{ value: 'eu-central-1', label: 'Europe (Frankfurt)' },
		{ value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' }
	];
</script>

<div class="box gap-sm measure-xs">
	<Select options={regions} bind:value={region} placeholder="Choose a region" aria-label="Region" />
	<p class="text-sm text-muted">Deploying to <span class="font-mono text-secondary">{region ?? 'nowhere yet'}</span></p>
</div>
