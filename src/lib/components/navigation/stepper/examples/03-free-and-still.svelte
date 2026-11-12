<!-- @example Free navigation and a still trail :: linear={false} lets a person skip ahead; clickable={false} is descriptive only. -->
<script lang="ts">
	import { Stepper } from '@fractaldesign/fractalsvelte-ui';

	let value = $state<string | null>('rehearse');
</script>

<div class="box gap-xl">
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">Free navigation</p>
		<Stepper
			bind:value
			linear={false}
			steps={[
				{ value: 'cast', label: 'Cast' },
				{ value: 'rehearse', label: 'Rehearse' },
				{ value: 'dress', label: 'Dress' },
				{ value: 'open', label: 'Opening night', disabled: true }
			]}
		/>
	</div>
	<div class="box gap-sm">
		<p class="text-sm text-muted weight-500">Descriptive only</p>
		<Stepper
			value="mix"
			clickable={false}
			steps={[
				{ value: 'track', label: 'Tracking' },
				{ value: 'mix', label: 'Mix', status: 'current' },
				{ value: 'master', label: 'Master' }
			]}
		/>
	</div>
</div>
