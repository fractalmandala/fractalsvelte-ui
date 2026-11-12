<!-- @example Every variant :: The full range of looks for a split button, from primary to danger. -->
<script lang="ts">
	import { SplitButton } from '@fractaldesign/fractalsvelte-ui';

	const items = [
		{ label: 'Save as template', onSelect: () => {} },
		{ label: 'Duplicate', onSelect: () => {} }
	];
</script>

<div class="row wrap gap-md ycenter">
	{#each ['primary', 'secondary', 'themed', 'soft', 'outline', 'ghost', 'link', 'info', 'success', 'warning', 'danger'] as v (v)}
		<SplitButton variant={v as never} size="sm" {items}>{v}</SplitButton>
	{/each}
</div>
