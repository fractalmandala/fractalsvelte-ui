<!-- @example States and forms :: A disabled picker, and a named picker that submits with a form. -->
<script lang="ts">
	import { ColorPicker } from '@fractaldesign/fractalsvelte-ui';

	let theme = $state('#0f172a');
	let submitted = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = String(data.get('theme') ?? '');
	}
</script>

<div class="box gap-lg">
	<form class="box gap-sm" onsubmit={submit}>
		<ColorPicker bind:value={theme} name="theme" label="Theme colour" />
		<div class="row ycenter gap-sm">
			<button class="button secondary h-bs text-sm modern" type="submit">Save theme</button>
			<span class="text-sm text-muted font-mono">{submitted ? `Submitted theme=${submitted}` : theme}</span>
		</div>
	</form>
	<div class="box gap-xs">
		<p class="text-sm text-secondary">Locked on this plan (disabled)</p>
		<ColorPicker value="#2563eb" disabled label="Locked accent" />
	</div>
</div>
