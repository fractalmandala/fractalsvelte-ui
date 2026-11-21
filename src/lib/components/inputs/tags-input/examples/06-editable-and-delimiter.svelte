<!-- @example Editable tags and a custom delimiter :: Double-click a tag to rename it, and split drafted tags on a semicolon. -->
<script lang="ts">
	import { Field, TagsInput } from '@fractaldesign/fractalsvelte-ui';

	let venues = $state(['Barbican Hall', 'Wigmore Hall']);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Venues" hint="Type “Barbican Hall; Wigmore Hall” to add both, then double-click a tag to rename it.">
		<TagsInput bind:value={venues} editable delimiter=";" placeholder="Add a venue" />
	</Field>
	<p class="text-sm text-muted tabular-nums">{venues.length} venues.</p>
</div>
