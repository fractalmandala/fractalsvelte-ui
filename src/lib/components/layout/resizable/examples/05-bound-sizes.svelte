<!-- @example Bound sizes :: Read and set the layout from state, react to resizes, and remember it between visits. -->
<script lang="ts">
	import { Button, Resizable, ResizablePane, ResizableHandle } from '@fractaldesign/fractalsvelte-ui';

	let sizes = $state([25, 50, 25]);
	let resizes = $state(0);
</script>

<div class="box gap-sm">
	<div class="row gap-sm wrap">
		<Button size="sm" variant="outline" onclick={() => (sizes = [20, 60, 20])}>Focus the editor</Button>
		<Button size="sm" variant="ghost" onclick={() => (sizes = [25, 50, 25])}>Reset</Button>
		<span class="text-sm text-muted tabular-nums">
			{sizes.map((s) => Math.round(s)).join(' / ')} · {resizes} resizes
		</span>
	</div>
	<div class="frame-16-9 border-subtle radius-md">
		<Resizable bind:sizes storageKey="docs-workspace" onResize={() => resizes++}>
			<ResizablePane minSize={12}>
				<div class="pad-md text-sm weight-500">Outline</div>
			</ResizablePane>
			<ResizableHandle />
			<ResizablePane minSize={30}>
				<div class="pad-md text-sm weight-500">Editor</div>
			</ResizablePane>
			<ResizableHandle />
			<ResizablePane minSize={12}>
				<div class="pad-md text-sm weight-500">Preview</div>
			</ResizablePane>
		</Resizable>
	</div>
</div>
