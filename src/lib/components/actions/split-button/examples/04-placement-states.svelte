<!-- @example Placement and states :: The menu can open above or below, from either edge; loading and disabled are supported. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Export as PDF', onSelect: () => {} },
		{ label: 'Export as Markdown', onSelect: () => {} }
	];
</script>

<div class="row wrap gap-md ycenter">
	<SplitButton variant="outline" placement="bottom-start" {items}>Bottom start</SplitButton>
	<SplitButton variant="outline" placement="bottom-end" {items}>Bottom end</SplitButton>
	<SplitButton variant="outline" placement="top-start" {items}>Top start</SplitButton>
	<SplitButton variant="outline" placement="top-end" {items}>Top end</SplitButton>
	<SplitButton variant="secondary" loading {items}>Exporting</SplitButton>
	<SplitButton variant="secondary" disabled {items}>Unavailable</SplitButton>
</div>
