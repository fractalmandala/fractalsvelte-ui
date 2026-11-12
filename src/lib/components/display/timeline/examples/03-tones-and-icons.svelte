<!-- @example Tones and icons :: Every tone, with a marker icon on the rail. -->
<script lang="ts">
	import {
		luCircleAlert,
		luCircleCheck,
		luInfo,
		luTriangleAlert,
		luPackage
	} from '@fractaldesign/icons/lucide';
	import { Timeline } from '@fractaldesign/fractalsvelte-ui';
</script>

<Timeline
	class="measure-md"
	items={[
		{
			title: 'Image published',
			description: 'ghcr.io/mintfolio/web:0.8.4 was pushed from the main pipeline.',
			time: '05:58',
			icon: luPackage,
			tone: 'neutral'
		},
		{
			title: 'Checks started',
			description: 'Staging received the revision and the smoke suite began.',
			time: '06:02',
			icon: luInfo,
			tone: 'info'
		},
		{
			title: 'Build passed',
			description: 'Type check, lint and the component gate all came back clean.',
			time: '06:04',
			icon: luCircleCheck,
			tone: 'success'
		},
		{
			title: 'Canary lagging',
			description: 'p95 latency in eu-west-1 rose to 420 ms. The canary was held at 10%.',
			time: '06:19',
			icon: luTriangleAlert,
			tone: 'warning'
		},
		{
			title: 'Canary aborted',
			description: 'Latency did not recover. Traffic was returned to 0.8.3.',
			time: '06:23',
			icon: luCircleAlert,
			tone: 'danger'
		}
	]}
/>
