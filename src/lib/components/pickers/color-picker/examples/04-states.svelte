<!-- @example States, measure and forms :: A disabled picker, a named picker that submits with a form, and one whose column, track and thumb heights, corner, type and gap are all its own. -->
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
	<div class="box gap-xs">
		<p class="text-sm text-secondary">A wider column, taller tracks and a wider gap</p>
		<ColorPicker
			value="#059669"
			measure="measure-sm"
			size="h-xl"
			trackSize="h-md"
			thumbSize="h-lg"
			shape="curved"
			textSize="text-lg"
			gap="gap-md"
			label="Report accent"
		/>
	</div>
</div>
