<!-- @example Frames and popover look :: outline, ghost and secondary frames, presets on a popover panel with their own scale and ink. -->
<script lang="ts">
	import { DatePicker } from '@fractaldesign/fractalsvelte-ui';

	let date = $state<string | null>('2026-11-12');
	const presets = [
		{ label: 'Today', value: '2026-11-12' },
		{ label: 'Next week', value: '2026-11-19' }
	];
</script>

<div class="box gap-sm measure-xs">
	{#each ['outline', 'ghost', 'secondary'] as const as variant (variant)}
		<DatePicker
			bind:value={date}
			{variant}
			{presets}
			surface="paneled"
			childTextSize="text-md"
			childTextColor="text-secondary"
			placeholder={`Publish on — ${variant}`}
			aria-label={`Publish date, ${variant} frame`}
		/>
	{/each}
</div>
