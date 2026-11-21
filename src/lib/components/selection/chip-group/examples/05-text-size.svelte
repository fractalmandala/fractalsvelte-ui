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
	<ChipGroup  size="h-lg" textSize="text-xs" {options} value="eu-west" label="Extra-small type" />
	<ChipGroup  size="h-lg" textSize="text-sm" {options} value="eu-west" label="Small type" />
	<ChipGroup  size="h-lg" textSize="text-sm" {options} value="eu-west" label="Small type" />
	<ChipGroup gap="gap-md" size="h-lg" textSize="text-md" {options} value="eu-west" label="Medium type" />
	<ChipGroup  size="h-lg" textSize="text-lg" {options} value="eu-west" label="Large type" />
	<ChipGroup  size="h-lg" textSize="text-xl" {options} value="eu-west" label="Extra-large type" />
</div>
