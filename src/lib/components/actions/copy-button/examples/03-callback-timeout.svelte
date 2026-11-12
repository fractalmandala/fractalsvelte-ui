<!-- @example Callback and timeout :: onCopy reports the text, and timeout holds the confirmation longer. -->
<script lang="ts">
	import { CopyButton } from '@fractaldesign/fractalsvelte-ui';

	let status = $state('Nothing copied yet');
</script>

<div class="box gap-sm">
	<div class="row ycenter gap-sm">
		<code class="text-sm">a3f9c1e</code>
		<CopyButton
			text="a3f9c1e"
			label="Copy commit hash"
			timeout={4000}
			onCopy={(copiedText) => (status = `Copied ${copiedText} to the clipboard`)}
		/>
	</div>
	<p class="text-sm text-secondary">{status}</p>
</div>
