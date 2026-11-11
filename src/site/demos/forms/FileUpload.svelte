<script lang="ts">
	import { FileUpload } from '@fractaldesign/fractalsvelte-ui';

	let uploadedFiles = $state<File[]>([]);
</script>

<FileUpload
	bind:files={uploadedFiles}
	label="Click to browse or drag files here"
	hint="PNG, JPG, PDF up to 10MB"
	maxSize={10485760}
/>
