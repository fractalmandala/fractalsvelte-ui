<!-- @example States and forms :: A disabled chip, a disabled group, and a named group that submits with a form. -->
<script lang="ts">
	import { ChipGroup } from '@fractaldesign/fractalsvelte-ui';

	let severity = $state<string | null>('high');
	let submitted = $state('');
	const options = [
		{ value: 'low', label: 'Low', count: 12 },
		{ value: 'medium', label: 'Medium', count: 7 },
		{ value: 'high', label: 'High', count: 2 },
		{ value: 'critical', label: 'Critical', count: 0, disabled: true }
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('severity') ?? '');
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm" onsubmit={submit}>
		<ChipGroup {options} bind:value={severity} name="severity" label="Severity" />
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Apply filter</button>
			<span class="text-sm text-muted">{submitted ? `Submitted severity=${submitted}` : 'Critical has no matching incidents'}</span>
		</div>
	</form>
	<div class="box gap-xs">
		<p class="text-sm text-secondary">Locked on this view (disabled)</p>
		<ChipGroup {options} value="high" disabled label="Locked severity" />
	</div>
</div>
