<!-- @example Usage :: A bound text area inside a Field. -->
<script lang="ts">
	import { Field, Textarea } from '@fractaldesign/fractalsvelte-ui';

	let notes = $state('');
</script>

<div class="measure-md">
	<Field label="Release notes" hint="Markdown is supported.">
		<Textarea bind:value={notes} placeholder="What changed in this version?" />
	</Field>
</div>
