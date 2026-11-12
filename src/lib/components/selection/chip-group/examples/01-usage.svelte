<!-- @example Usage :: A single-choice filter group bound to a value. -->
<script lang="ts">
	import { ChipGroup } from '@fractaldesign/fractalsvelte-ui';

	let region = $state<string | null>('eu-west');
	const options = [
		{ value: 'us-east', label: 'US East' },
		{ value: 'us-west', label: 'US West' },
		{ value: 'eu-west', label: 'EU West' },
		{ value: 'ap-south', label: 'Asia Pacific' }
	];
</script>

<div class="box gap-sm">
	<ChipGroup type="single" {options} bind:value={region} label="Region" />
	<p class="text-sm text-muted">Filtering deployments in {region ?? 'every region'}</p>
</div>
