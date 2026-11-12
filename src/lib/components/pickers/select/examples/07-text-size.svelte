<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	const regions = [
		{ value: 'us-east-1', label: 'US East (N. Virginia)' },
		{ value: 'eu-west-1', label: 'Europe (Ireland)' },
		{ value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' }
	];
</script>

<div class="box gap-sm measure-xs">
	<Select size="lg" textSize="xs" options={regions} value="eu-west-1" aria-label="Extra-small type" />
	<Select size="lg" textSize="sm" options={regions} value="eu-west-1" aria-label="Small type" />
	<Select size="lg" textSize="md" options={regions} value="eu-west-1" aria-label="Medium type" />
	<Select size="lg" textSize="lg" options={regions} value="eu-west-1" aria-label="Large type" />
	<Select size="lg" textSize="xl" options={regions} value="eu-west-1" aria-label="Extra-large type" />
</div>
