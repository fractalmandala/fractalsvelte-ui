<!-- @example Alignment :: The same deploy on the left edge, on the right edge, and alternating about the rail. -->
<script lang="ts">
	import { Timeline } from '@fractaldesign/fractalsvelte-ui';

	const events = [
		{ title: 'Build passed', time: '06:04', description: 'The gate was green.' },
		{ title: 'Deployed to staging', time: '06:11', description: 'Staging is on 0.8.4.' },
		{ title: 'Canary at 10%', time: '06:18', description: 'Error rate is unchanged.' },
		{ title: 'Promoted to production', time: '06:27', description: 'All regions are on 0.8.4.' }
	];
</script>

<div class="box gap-xl">
	<div class="box gap-xs">
		<span class="text-sm text-muted">Left</span>
		<Timeline align="left" items={events} class="measure-md" />
	</div>
	<div class="box gap-xs">
		<span class="text-sm text-muted">Right</span>
		<Timeline align="right" items={events} class="measure-md" />
	</div>
	<div class="box gap-xs">
		<span class="text-sm text-muted">Alternate</span>
		<Timeline alternate items={events} />
	</div>
</div>
