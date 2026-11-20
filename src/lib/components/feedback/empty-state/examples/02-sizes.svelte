<!-- @example Sizes :: The type, icon and padding scale from xs to xl. -->
<script lang="ts">
	import { EmptyState } from '@fractaldesign/fractalsvelte-ui';
	import { luFolderOpen } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-lg">
	<EmptyState size="h-xs" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-sm" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-md" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-lg" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-xl" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-bs" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-2xl" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="h-3xl" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
</div>
