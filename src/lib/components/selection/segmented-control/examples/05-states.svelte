<!-- @example States and forms :: A disabled option, a disabled control, and a named group that submits with a form. -->
<script lang="ts">
	import { SegmentedControl } from '@fractaldesign/fractalsvelte-ui';

	let env = $state('staging');
	let submitted = $state('');
	const options = [
		{ value: 'development', label: 'Development' },
		{ value: 'staging', label: 'Staging' },
		{ value: 'production', label: 'Production', disabled: true }
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('environment') ?? '');
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm" onsubmit={submit}>
		<SegmentedControl {options} bind:value={env} name="environment" label="Environment" />
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Save target</button>
			<span class="text-sm text-muted">{submitted ? `Submitted environment=${submitted}` : 'Production is locked on this plan'}</span>
		</div>
	</form>
	<div class="box gap-xs">
		<p class="text-sm text-secondary">Archived project (disabled)</p>
		<SegmentedControl {options} value="staging" disabled label="Archived environment" />
	</div>
</div>
