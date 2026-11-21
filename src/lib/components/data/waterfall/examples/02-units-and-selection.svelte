<!-- @example Units and selection :: The same deploy trace in milliseconds and in seconds, on a six-tick axis, reporting the stage the reader picks. -->
<script lang="ts">
	import { Waterfall, type WaterfallItem } from '@fractaldesign/fractalsvelte-ui';

	const migrations: WaterfallItem[] = [
		{
			id: 'migrate',
			label: 'pnpm migrate',
			start: 0,
			duration: 412,
			tone: 'info',
			status: 'ok',
			children: [
				{ id: 'lock', label: 'Acquire advisory lock', start: 8, duration: 96, tone: 'warning' },
				{ id: 'apply', label: 'Apply 14 pending steps', start: 104, duration: 268, tone: 'info' },
				{ id: 'verify', label: 'Verify constraints', start: 372, duration: 40, tone: 'success' }
			]
		}
	];

	const backups: WaterfallItem[] = [
		{
			id: 'backup',
			label: 'Nightly backup',
			start: 0,
			duration: 11.4,
			tone: 'success',
			children: [
				{ id: 'snapshot', label: 'Volume snapshot', start: 0.2, duration: 3.6, tone: 'info' },
				{ id: 'upload', label: 'Upload to cold storage', start: 3.8, duration: 7.1, tone: 'info' },
				{ id: 'prune', label: 'Prune seven-day tail', start: 10.9, duration: 0.5, tone: 'warning' }
			]
		}
	];

	let picked = $state('None yet');
</script>

<div class="column gap-lg measure-lg wfull">
	<Waterfall
		items={migrations}
		unit="ms"
		ticks={6}
		surface="outlined"
		shape="curved"
		size="h-sm"
		textSize="text-md"
		childTextSize="text-sm"
		textColor="text-secondary"
		childTextColor="text-muted"
		onSelect={(item) => (picked = item.label)}
	/>
	<Waterfall items={backups} unit="s" ticks={6} onSelect={(item) => (picked = item.label)} />
	<span class="text-sm text-secondary">Last picked: {picked}</span>
</div>
