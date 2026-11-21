<!-- @example Previews and folders :: showPreviews draws a thumbnail per image, and directory lets the picker take a whole folder. -->
<script lang="ts">
	import { Field, FileDrop } from '@fractaldesign/fractalsvelte-ui';

	let shots = $state<File[]>([]);
	let bundle = $state<File[]>([new File(['# Release notes'], 'release-notes.md', { type: 'text/markdown' })]);
</script>

<div class="measure-sm box gap-lg">
	<Field label="Product shots" hint="Drop images and check each thumbnail before publishing.">
		<FileDrop
			bind:files={shots}
			showPreviews
			accept="image/*"
			size="h-lg"
			gap="gap-lg"
			surface="paneled"
			textColor="text-secondary"
		/>
	</Field>
	<Field label="Site bundle" hint="Choose the exported folder; every file inside it is added.">
		<FileDrop bind:files={bundle} directory childTextSize="text-xs" />
	</Field>
</div>
