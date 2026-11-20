<!-- @example Appearance :: variant, size and shape apply to both halves. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Schedule for later', onSelect: () => {} },
		{ label: 'Save as draft', onSelect: () => {} }
	];
</script>

<div class="row wrap gap-md ycenter">
	<SplitButton variant="outline" size="h-sm" shape="mincurved" {items}>Publish</SplitButton>
	<SplitButton variant="themed" size="h-md" shape="modern" {items}>Publish</SplitButton>
	<SplitButton variant="secondary" size="h-lg" shape="curved" {items}>Publish</SplitButton>
	<SplitButton variant="secondary" size="h-xs" shape="rect" {items}>Publish</SplitButton>
	<SplitButton variant="ghost" size="h-xl" shape="round" {items}>Publish</SplitButton>
	<SplitButton variant="outline" size="h-bs" shape="mincurved" {items}>Publish</SplitButton>
	<SplitButton variant="themed" size="h-2xl" shape="modern" {items}>Publish</SplitButton>
	<SplitButton variant="secondary" size="h-3xl" shape="curved" {items}>Publish</SplitButton>
</div>
