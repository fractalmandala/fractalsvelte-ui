<!-- @example Usage :: Two panes with a draggable handle between them. -->
<script lang="ts">
	import { Resizable, ResizablePane, ResizableHandle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="frame-16-9 border-subtle radius-md">
	<Resizable orientation="horizontal">
		<ResizablePane defaultSize={30} minSize={20} maxSize={50}>
			<div class="box gap-xs pad-md">
				<span class="text-sm weight-500">Inbox</span>
				<span class="text-sm text-muted">14 unread, 3 flagged</span>
			</div>
		</ResizablePane>
		<ResizableHandle />
		<ResizablePane defaultSize={70}>
			<div class="box gap-xs pad-md">
				<span class="text-sm weight-500">Q3 roadmap review</span>
				<span class="text-sm text-secondary">Drag the divider, or focus it and use the arrow keys.</span>
			</div>
		</ResizablePane>
	</Resizable>
</div>
