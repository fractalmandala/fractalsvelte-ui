<script lang="ts">
	import { Button } from 'fractalsvelte/components';
	import { Icon } from 'fractalicons';
	import { luArrowRight } from 'fractalicons/lucide';

	let { selected = 'all' }: { selected?: string } = $props();
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button>Default</Button>
		<Button shape="pill">Pill</Button>
		<Button shape="pill" variant="secondary">
			Next
			<Icon icon={luArrowRight} />
		</Button>
	</div>
{:else if selected === 'default'}
	<Button>Default</Button>
{:else if selected === 'pill'}
	<Button shape="pill">Pill</Button>
{:else if selected === 'with-icon'}
	<Button shape="pill" variant="secondary">
		Next
		<Icon icon={luArrowRight} />
	</Button>
{/if}
