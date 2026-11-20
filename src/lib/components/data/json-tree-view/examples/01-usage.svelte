<!-- @example Usage :: Inspecting a structured API configuration object with expandable branches. -->
<script lang="ts">
	import { JsonTreeView } from '@fractaldesign/fractalsvelte-ui';

	const payload = {
		service: 'fractal-edge',
		version: 4.2,
		active: true,
		limits: { requestsPerMin: 1200, burst: 200 },
		regions: ['iad', 'fra', 'nrt'],
		deprecatedAt: null
	};
</script>

<div class="measure-md wfull">
	<JsonTreeView data={payload} rootName="config" defaultExpandedDepth={2} />
</div>
