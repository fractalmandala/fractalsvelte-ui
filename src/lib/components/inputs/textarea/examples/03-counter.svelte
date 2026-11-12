<!-- @example Counter :: maxlength with a live counter; onValueChange reports edits. -->
<script lang="ts">
	import { Textarea } from '@fractaldesign/fractalsvelte-ui';

	let bio = $state('Designer and occasional typographer.');
	let edits = $state(0);
</script>

<div class="measure-md box gap-sm">
	<Textarea
		bind:value={bio}
		counter
		maxlength={80}
		rows={3}
		aria-label="Bio"
		onValueChange={() => edits++}
	/>
	<p class="text-sm text-muted tabular-nums">{edits} edits</p>
</div>
