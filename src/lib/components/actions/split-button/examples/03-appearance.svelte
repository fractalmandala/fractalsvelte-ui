<!-- @example Appearance :: variant, size and shape apply to both halves. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Schedule for later', onSelect: () => {} },
		{ label: 'Save as draft', onSelect: () => {} }
	];
</script>

<div class="row wrap gap-md ycenter">
	<SplitButton variant="outline" size="sm" shape="mincurved" {items}>Publish</SplitButton>
	<SplitButton variant="themed" size="md" shape="modern" {items}>Publish</SplitButton>
	<SplitButton variant="soft" size="lg" shape="curved" {items}>Publish</SplitButton>
	<SplitButton variant="secondary" size="xs" shape="rect" {items}>Publish</SplitButton>
	<SplitButton variant="ghost" size="xl" shape="round" {items}>Publish</SplitButton>
</div>
