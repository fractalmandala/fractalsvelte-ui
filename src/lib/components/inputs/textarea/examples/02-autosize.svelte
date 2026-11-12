<!-- @example Autosize :: Grows from rows to maxRows lines, then scrolls. -->
<script lang="ts">
	import { Textarea } from '@fractaldesign/fractalsvelte-ui';

	let message = $state('Hi team, quick update on the migration.\nStaging is green and we are on track for Thursday.');
</script>

<div class="measure-md">
	<Textarea autosize rows={2} maxRows={6} bind:value={message} aria-label="Message" />
</div>
