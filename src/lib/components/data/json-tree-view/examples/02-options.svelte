<!-- @example Presentation options :: sortKeys orders the keys, maxStringLength cuts the string previews short, and copyable={false} drops the per-row copy button. -->
<script lang="ts">
	import { JsonTreeView } from '@fractaldesign/fractalsvelte-ui';

	const manifest = {
		name: 'fractal-edge',
		entrypoint: 'src/server/edge/handler.ts',
		compatibilityFlags: ['nodejs_compat', 'streams_enable_constructors'],
		tailConsumers: 2,
		observability: { enabled: true, headSamplingRate: 0.25 }
	};
</script>

<div class="row wrap gap-lg">
	<div class="measure-sm">
		<JsonTreeView data={manifest} rootName="manifest" defaultExpandedDepth={2} sortKeys maxStringLength={18} surface="outlined" shape="curved" pad="pad-md" textSize="text-md" />
	</div>
	<div class="measure-sm">
		<JsonTreeView data={manifest} rootName="manifest" defaultExpandedDepth={2} copyable={false} />
	</div>
</div>
