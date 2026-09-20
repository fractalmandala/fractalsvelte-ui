<script lang="ts">
	import { Button } from 'fractalsvelte/components';
	import type { ButtonShape } from '#lib/data/componentTypes.ts';

	let { selected = 'all' }: { selected?: string } = $props();
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button shape="square">Square</Button>
		<Button shape="modern">Modern</Button>
		<Button shape="curved">Curved</Button>
		<Button shape="round">Round</Button>
	</div>
{:else}
	<Button shape={selected as ButtonShape}>
		{selected.charAt(0).toUpperCase() + selected.slice(1)}
	</Button>
{/if}
