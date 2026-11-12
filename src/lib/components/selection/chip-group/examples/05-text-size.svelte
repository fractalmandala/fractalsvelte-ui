<!-- @example Text size :: The text scale can be set independently of the chip height. -->
<script lang="ts">
	import { ChipGroup } from '@fractaldesign/fractalsvelte-ui';

	const options = [
		{ value: 'us-east', label: 'US East' },
		{ value: 'eu-west', label: 'EU West' },
		{ value: 'ap-south', label: 'Asia Pacific' }
	];
</script>

<div class="box gap-sm">
	<ChipGroup type="single" size="lg" textSize="xs" {options} value="eu-west" label="Extra-small type" />
	<ChipGroup type="single" size="lg" textSize="sm" {options} value="eu-west" label="Small type" />
	<ChipGroup type="single" size="lg" textSize="md" {options} value="eu-west" label="Medium type" />
	<ChipGroup type="single" size="lg" textSize="lg" {options} value="eu-west" label="Large type" />
	<ChipGroup type="single" size="lg" textSize="xl" {options} value="eu-west" label="Extra-large type" />
</div>
