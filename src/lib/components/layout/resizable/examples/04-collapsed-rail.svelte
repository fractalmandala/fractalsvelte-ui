<!-- @example Collapsed rail :: A pane that collapses to a narrow rail instead of disappearing. -->
<script lang="ts">
	import { Resizable, ResizablePane, ResizableHandle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="frame-16-9 border-subtle radius-md">
	<Resizable>
		<ResizablePane defaultSize={24} minSize={18} collapsible collapsedSize={6} maxSize={36}>
			<div class="box gap-xs pad-sm">
				<span class="text-sm weight-500 truncate">Files</span>
				<span class="text-xs text-muted truncate">src/lib/index.ts</span>
			</div>
		</ResizablePane>
		<ResizableHandle withGrip aria-label="Resize file tree" />
		<ResizablePane defaultSize={76}>
			<div class="box gap-xs pad-md">
				<span class="text-sm weight-500">index.ts</span>
				<span class="text-sm text-secondary">Press Enter on the handle to collapse the tree to a rail.</span>
			</div>
		</ResizablePane>
	</Resizable>
</div>
