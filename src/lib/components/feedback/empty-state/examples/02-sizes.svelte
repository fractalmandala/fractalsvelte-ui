<!-- @example Sizes :: The type, icon and padding scale from xs to xl. -->
<script lang="ts">
	import { EmptyState } from '@fractaldesign/fractalsvelte-ui';
	import { luFolderOpen } from '@fractaldesign/icons/lucide';
</script>

<div class="box gap-lg">
	<EmptyState size="xs" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="sm" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="md" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="lg" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
	<EmptyState size="xl" icon={luFolderOpen} title="No files" description="Drop a folder to start an index." />
</div>
