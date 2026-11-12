<!-- @example Vertical with a grip :: Stacked panes, with a grip on the handles so they read as draggable. -->
<script lang="ts">
	import { Resizable, ResizablePane, ResizableHandle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="frame-3-2 border-subtle radius-md">
	<Resizable orientation="vertical">
		<ResizablePane defaultSize={55} minSize={25}>
			<div class="box gap-xs pad-md">
				<span class="text-sm weight-500">editor.ts</span>
				<code class="text-sm text-secondary font-mono">export const total = items.reduce(sum, 0);</code>
			</div>
		</ResizablePane>
		<ResizableHandle withGrip aria-label="Resize terminal" />
		<ResizablePane defaultSize={45} minSize={15}>
			<div class="box gap-xs pad-md">
				<span class="text-sm weight-500">Terminal</span>
				<code class="text-sm text-muted font-mono">pnpm test: 128 passed</code>
			</div>
		</ResizablePane>
	</Resizable>
</div>
