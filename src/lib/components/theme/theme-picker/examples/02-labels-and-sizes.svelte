<!-- @example Labels and sizes :: Named swatches in their own scale and ink, and every size of the control. -->
<script lang="ts">
	import { ThemePicker } from '@fractaldesign/fractalsvelte-ui';
	import type {  ThemeName  } from '@fractaldesign/fractalsvelte-ui/theme';

	let value = $state<ThemeName>('ocean');
</script>

<div class="box gap-lg">
	<ThemePicker bind:value showLabels textSize="text-xs" textColor="text-muted" gap="gap-md" onValueChange={() => {}} />
	<div class="box gap-sm">
		{#each ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl', 'h-2xl', 'h-3xl'] as const as size (size)}
			<div class="row ycenter gap-md">
				<span class="text-xs text-muted shrink-0">{size}</span>
				<ThemePicker {size} {value} />
			</div>
		{/each}
	</div>
</div>
