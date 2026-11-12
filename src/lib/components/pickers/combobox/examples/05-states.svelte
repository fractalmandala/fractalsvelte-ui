<!-- @example States and forms :: invalid, disabled, clearable, a named field, and open with onOpenChange and onValueChange. -->
<script lang="ts">
	import { Combobox } from '@fractaldesign/fractalsvelte-ui';

	let zone = $state<string | null>(null);
	let open = $state(false);
	let submitted = $state('');
	const zones = [
		{ value: 'America/New_York', label: 'Eastern Time — New York' },
		{ value: 'Europe/London', label: 'Greenwich Mean Time — London' },
		{ value: 'Asia/Kolkata', label: 'India Standard Time — Kolkata' },
		{ value: 'Asia/Tokyo', label: 'Japan Standard Time — Tokyo' }
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('timezone') ?? '');
	}
</script>

<div class="box gap-bs measure-xs">
	<form class="box gap-sm" onsubmit={submit}>
		<Combobox
			options={zones}
			bind:value={zone}
			bind:open
			clearable
			invalid={!zone}
			name="timezone"
			placeholder="Time zone"
			aria-label="Time zone"
			onValueChange={(v) => console.info('zone', v)}
			onOpenChange={(o) => console.info('open', o)}
			onInputValueChange={(t) => console.info('text', t)}
		/>
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Save schedule</button>
			<span class="text-sm text-muted">{submitted ? `Submitted timezone=${submitted}` : 'A time zone is required'}</span>
		</div>
	</form>
	<Combobox options={zones} value="Europe/London" inputValue="Greenwich Mean Time — London" disabled aria-label="Account time zone" />
</div>
