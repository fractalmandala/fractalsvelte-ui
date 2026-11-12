<!-- @example Usage :: A drop zone for a job application, listing each file as it arrives. -->
<script lang="ts">
	import { Field, FileDrop } from '@fractaldesign/fractalsvelte-ui';

	let files = $state<File[]>([]);
</script>

<div class="measure-sm box gap-sm">
	<Field label="Supporting documents" hint="Drop a portfolio, a CV, or both.">
		<FileDrop bind:files />
	</Field>
	<p class="text-sm text-muted tabular-nums">{files.length ? `${files.length} file${files.length === 1 ? '' : 's'} attached.` : 'No files yet.'}</p>
</div>
