<script lang="ts">
	import { Button } from 'fractalsvelte/components';
	import type { ButtonVariant } from '#lib/data/componentTypes.ts';

	let { selected = 'all' }: { selected?: string } = $props();

	const labelMap: Record<string, string> = {
		primary: 'Primary',
		secondary: 'Secondary',
		soft: 'Soft',
		outline: 'Outline',
		ghost: 'Ghost',
		link: 'Link',
		destructive: 'Destructive'
	};
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="soft">Soft</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="link">Link</Button>
		<Button variant="destructive">Destructive</Button>
	</div>
{:else}
	<Button variant={selected as ButtonVariant}>
		{labelMap[selected] ?? selected}
	</Button>
{/if}
