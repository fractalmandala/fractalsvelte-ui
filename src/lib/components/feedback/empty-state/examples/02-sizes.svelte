<!-- @example Sizes and padding :: Icon and type step up from md to xl, the inset is set on its own pad ladder, and textSize overrides the type scale. -->
<script lang="ts">
	import { EmptyState } from '@fractaldesign/fractalsvelte-ui';
	import { luFolderOpen } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-lg">
	<EmptyState
		size="h-md"
		icon={luFolderOpen}
		title="No files"
		description="Drop a folder to start an index."
	/>
	<EmptyState
		size="h-lg"
		icon={luFolderOpen}
		title="No files"
		description="Drop a folder to start an index."
	/>
	<EmptyState
		size="h-xl"
		textSize="text-lg"
		icon={luFolderOpen}
		title="No files"
		description="Drop a folder to start an index."
	/>
</div>
