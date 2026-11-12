<!-- @example Multiple :: Any number of items can be on; onValueChange reports the array. -->
<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '@fractaldesign/fractalsvelte-ui';
	import { luBold, luItalic, luUnderline } from '@fractaldesign/icons/lucide';

	let marks = $state<string | string[]>(['bold']);
	let last = $state('bold');
</script>

<div class="box gap-sm">
	<ToggleGroup
		type="multiple"
		label="Text formatting"
		bind:value={marks}
		onValueChange={(next) => (last = Array.isArray(next) ? next.join(', ') || 'none' : next)}
	>
		<ToggleGroupItem value="bold" icon={luBold} aria-label="Bold" />
		<ToggleGroupItem value="italic" icon={luItalic} aria-label="Italic" />
		<ToggleGroupItem value="underline" icon={luUnderline} aria-label="Underline" />
	</ToggleGroup>
	<p class="text-sm text-secondary">Active marks: {last}</p>
</div>
