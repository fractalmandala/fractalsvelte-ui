<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { NativeSelect } from '@fractaldesign/fractalsvelte-ui';

	const options = [
		{ value: 'us-east-1', label: 'N. Virginia' },
		{ value: 'eu-west-1', label: 'Ireland' },
		{ value: 'ap-south-1', label: 'Mumbai' }
	];
</script>

<div class="box gap-sm measure-xs">
	<NativeSelect size="lg" textSize="xs" value="eu-west-1" {options} aria-label="Extra-small type" />
	<NativeSelect size="lg" textSize="sm" value="eu-west-1" {options} aria-label="Small type" />
	<NativeSelect size="lg" textSize="md" value="eu-west-1" {options} aria-label="Medium type" />
	<NativeSelect size="lg" textSize="lg" value="eu-west-1" {options} aria-label="Large type" />
	<NativeSelect size="lg" textSize="xl" value="eu-west-1" {options} aria-label="Extra-large type" />
</div>
