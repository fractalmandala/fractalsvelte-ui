<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Squash and merge', onSelect: () => {} },
		{ label: 'Rebase and merge', onSelect: () => {} }
	];
</script>

<div class="row wrap gap-sm ycenter">
	<SplitButton size="lg" textSize="xs" {items}>Extra-small type</SplitButton>
	<SplitButton size="lg" textSize="sm" {items}>Small type</SplitButton>
	<SplitButton size="lg" textSize="md" {items}>Medium type</SplitButton>
	<SplitButton size="lg" textSize="lg" {items}>Large type</SplitButton>
	<SplitButton size="lg" textSize="xl" {items}>Extra-large type</SplitButton>
</div>
