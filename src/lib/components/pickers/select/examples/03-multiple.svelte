<!-- @example Multiple, in a form :: multiple keeps the list open and binds an array; name writes one hidden input per value, and onValueChange reports each change. -->
<script lang="ts">
	import { Select } from '@fractaldesign/fractalsvelte-ui';

	let labels = $state<number[]>([2, 5]);
	let submitted = $state('');
	const options = [
		{ value: 1, label: 'Bug' },
		{ value: 2, label: 'Design' },
		{ value: 3, label: 'Documentation' },
		{ value: 4, label: 'Good first issue' },
		{ value: 5, label: 'Performance' },
		{ value: 6, label: 'Security' }
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = data.getAll('labels').join(', ');
	}
</script>

<form class="box gap-sm measure-sm" onsubmit={submit}>
	<Select
		{options}
		multiple
		clearable
		name="labels"
		bind:value={labels}
		onValueChange={(v) => console.info('labels', v)}
		placeholder="Add labels"
		aria-label="Labels"
	/>
	<div class="row ycenter gap-sm">
		<button class="button secondary h-bs text-sm modern" type="submit">Save issue</button>
		<span class="text-sm text-muted tabular-nums">{submitted ? `Submitted labels=${submitted}` : `${labels.length} selected`}</span>
	</div>
</form>
