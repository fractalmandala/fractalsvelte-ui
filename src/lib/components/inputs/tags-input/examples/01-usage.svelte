<!-- @example Usage :: Topics on a catalogue record, added with Enter or a comma. -->
<script lang="ts">
	import { Field, TagsInput } from '@fractaldesign/fractalsvelte-ui';

	let topics = $state(['Letterpress', 'Paper goods']);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Topics" hint="Type a topic and press Enter or comma.">
		<TagsInput bind:value={topics} placeholder="Add a topic" />
	</Field>
	<p class="text-sm text-muted tabular-nums">{topics.length} topics.</p>
</div>
