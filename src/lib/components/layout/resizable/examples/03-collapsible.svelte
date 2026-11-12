<!-- @example Collapsible sidebar :: Drag past the minimum, press Enter on the handle, or use the button to spring the sidebar shut. -->
<script lang="ts">
	import { Button, Resizable, ResizablePane, ResizableHandle } from '@fractaldesign/fractalsvelte-ui';

	let collapsed = $state(false);
</script>

<div class="box gap-sm">
	<div class="row gap-sm">
		<Button size="sm" variant="outline" onclick={() => (collapsed = !collapsed)}>
			{collapsed ? 'Show sidebar' : 'Hide sidebar'}
		</Button>
	</div>
	<div class="frame-16-9 border-subtle radius-md">
		<Resizable>
			<ResizablePane
				defaultSize={26}
				minSize={16}
				maxSize={40}
				collapsible
				collapsedSize={0}
				bind:collapsed
			>
				<div class="box gap-xs pad-md">
					<span class="text-sm weight-500">Projects</span>
					<span class="text-sm text-secondary">Atlas</span>
					<span class="text-sm text-secondary">Meridian</span>
					<span class="text-sm text-secondary">Halcyon</span>
				</div>
			</ResizablePane>
			<ResizableHandle aria-label="Resize sidebar" />
			<ResizablePane defaultSize={74}>
				<div class="box gap-xs pad-md">
					<span class="text-sm weight-500">Atlas</span>
					<span class="text-sm text-muted">{collapsed ? 'Sidebar hidden' : 'Sidebar open'}</span>
				</div>
			</ResizablePane>
		</Resizable>
	</div>
</div>
