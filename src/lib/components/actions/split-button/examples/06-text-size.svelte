<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Squash and merge', onSelect: () => {} },
		{ label: 'Rebase and merge', onSelect: () => {} }
	];
</script>

<div class="row wrap gap-sm ycenter">
	<SplitButton size="h-lg" textSize="text-xs" {items}>Extra-small type</SplitButton>
	<SplitButton size="h-lg" textSize="text-sm" {items}>Small type</SplitButton>
	<SplitButton size="h-lg" textSize="text-md" {items}>Medium type</SplitButton>
	<SplitButton size="h-lg" textSize="text-lg" {items}>Large type</SplitButton>
	<SplitButton size="h-lg" textSize="text-xl" {items}>Extra-large type</SplitButton>
	<SplitButton size="h-lg" textSize="text-bs" {items}>Base type</SplitButton>
	<SplitButton size="h-lg" textSize="text-2xl" {items}>2× type</SplitButton>
	<SplitButton size="h-lg" textSize="text-3xl" {items}>3× type</SplitButton>
</div>
