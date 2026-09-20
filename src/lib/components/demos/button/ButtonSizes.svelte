<script lang="ts">
	import { Button } from 'fractalsvelte/components';
	import type { ButtonSize } from '#lib/data/componentTypes.ts';

	let { selected = 'all' }: { selected?: string } = $props();

	const labelMap: Record<string, string> = {
		sm: 'Small (sm)',
		md: 'Medium (md)',
		bs: 'Base (bs)',
		lg: 'Large (lg)'
	};
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button size="sm">Small (sm)</Button>
		<Button size="md">Medium (md)</Button>
		<Button size="bs">Base (bs)</Button>
		<Button size="lg">Large (lg)</Button>
	</div>
{:else}
	<Button size={selected as ButtonSize}>
		{labelMap[selected] ?? selected}
	</Button>
{/if}
