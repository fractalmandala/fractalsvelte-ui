<!-- @example Labels and sizes :: Named swatches, and every size of the control. -->
<script lang="ts">
	import { ThemePicker } from '@fractaldesign/fractalsvelte-ui';
	import type { ThemeName } from '@fractaldesign/fractalsvelte-ui/theme';

	let value = $state<ThemeName>('ocean');
</script>

<div class="box gap-lg">
	<ThemePicker bind:value showLabels onValueChange={() => {}} />
	<div class="box gap-sm">
		{#each ['xs', 'sm', 'md', 'lg', 'xl'] as const as size (size)}
			<div class="row ycenter gap-md">
				<span class="text-xs text-muted measure-xs">{size}</span>
				<ThemePicker {size} {value} />
			</div>
		{/each}
	</div>
</div>
