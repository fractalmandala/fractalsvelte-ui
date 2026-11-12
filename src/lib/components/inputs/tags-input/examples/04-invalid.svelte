<!-- @example Invalid :: A required list that is still empty. -->
<script lang="ts">
	import { Field, TagsInput } from '@fractaldesign/fractalsvelte-ui';

	let labels = $state<string[]>([]);
	const invalid = $derived(labels.length === 0);
</script>

<div class="measure-sm">
	<Field label="Product labels" error={invalid ? 'Add at least one label.' : undefined}>
		<TagsInput bind:value={labels} {invalid} placeholder="Add a label" />
	</Field>
</div>
