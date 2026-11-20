<!-- @example Usage :: Capturing and clearing a handwritten signature. -->
<script lang="ts">
	import { SignaturePad } from '@fractaldesign/fractalsvelte-ui';

	let paths = $state<string[]>([]);
</script>

<div class="column gap-sm measure-sm wfull">
	<SignaturePad bind:paths label="Applicant signature" />
	<p class="text-xs text-muted tabular-nums">{paths.length} stroke(s) recorded</p>
</div>
