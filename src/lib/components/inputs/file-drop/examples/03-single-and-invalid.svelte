<!-- @example Single file and invalid :: One cover image, required, with custom prompt copy. -->
<script lang="ts">
	import { Field, FileDrop } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luImage } from '@fractaldesign/icons/lucide';

	let files = $state<File[]>([]);
	const invalid = $derived(files.length === 0);
</script>

<div class="measure-sm">
	<Field label="Cover image" error={invalid ? 'Choose a cover image to continue.' : undefined}>
		<FileDrop bind:files {invalid} multiple={false} accept="image/*">
			<span class="row ycenter xcenter square h-xl radius-full state-selected text-theme">
				<Icon icon={luImage} />
			</span>
			<span class="box xcenter gap-xs">
				<span class="weight-500">Drop a cover image, or click to choose one</span>
				<span class="text-sm text-muted">PNG, JPEG or WebP</span>
			</span>
		</FileDrop>
	</Field>
</div>
