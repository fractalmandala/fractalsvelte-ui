<!-- @example Accept and limits :: PDFs and images only, at most three, each under 5 MB, reported through onFiles. -->
<script lang="ts">
	import { Field, FileDrop } from '@fractaldesign/fractalsvelte-ui';

	let files = $state<File[]>([]);
	let last = $state(0);

	function onFiles(next: File[]): void {
		last = next.length;
	}
</script>

<div class="measure-sm">
	<Field label="Press images" hint="PDF, PNG or JPEG, up to 5 MB each, at most three.">
		<FileDrop bind:files accept=".pdf,image/png,image/jpeg,image/*" multiple maxSize={5 * 1024 * 1024} maxFiles={3} {onFiles} />
	</Field>
</div>
