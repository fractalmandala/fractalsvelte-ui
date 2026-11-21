<!-- @example Frames and list look :: outline, ghost and secondary frames, each opening its list on a panel with quieter secondary text. -->
<script lang="ts">
	import { Combobox } from '@fractaldesign/fractalsvelte-ui';

	const stations = [
		{ value: 'kings-cross', label: 'King’s Cross', description: 'Platforms 9 to 11' },
		{ value: 'paddington', label: 'Paddington', description: 'Heathrow Express' },
		{ value: 'waterloo', label: 'Waterloo', description: 'Main concourse' }
	];
</script>

<div class="box gap-sm measure-xs">
	{#each ['outline', 'ghost', 'secondary'] as const as variant (variant)}
		<Combobox
			{variant}
			options={stations}
			value="paddington"
			inputValue="Paddington"
			surface="paneled"
			childTextSize="text-sm"
			childTextColor="text-secondary"
			placeholder={`Station — ${variant}`}
			aria-label={`Station, ${variant} frame`}
		/>
	{/each}
</div>
