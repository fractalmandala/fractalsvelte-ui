<!-- @example Usage :: Request trace waterfall with nested spans and a milestone marker. -->
<script lang="ts">
	import { Waterfall, type WaterfallItem } from '@fractaldesign/fractalsvelte-ui';

	const items: WaterfallItem[] = [
		{
			id: 'doc',
			label: 'GET /dashboard',
			start: 0,
			duration: 240,
			tone: 'info',
			status: '200',
			children: [
				{ id: 'auth', label: 'Verify session', start: 18, duration: 42, tone: 'success' },
				{ id: 'db', label: 'Query metrics', start: 65, duration: 115, tone: 'warning' },
				{ id: 'render', label: 'SSR stream', start: 185, duration: 55, tone: 'info' }
			]
		}
	];

	let selectedId = $state<string>('db');
</script>

<div class="measure-lg wfull">
	<Waterfall
		{items}
		bind:selectedId
		markers={[{ value: 180, label: 'TTFB' }]}
	/>
</div>
