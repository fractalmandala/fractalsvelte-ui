<script lang="ts">
	import { Button } from 'fractalsvelte/components';
	import { Icon } from 'fractalicons';
	import { luMail, luArrowRight } from 'fractalicons/lucide';

	let { selected = 'all' }: { selected?: string } = $props();
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button variant="secondary">
			<Icon icon={luMail} />
			Email us
		</Button>
		<Button variant="outline">
			Continue
			<Icon icon={luArrowRight} />
		</Button>
	</div>
{:else if selected === 'leading'}
	<Button variant="secondary">
		<Icon icon={luMail} />
		Email us
	</Button>
{:else if selected === 'trailing'}
	<Button variant="outline">
		Continue
		<Icon icon={luArrowRight} />
	</Button>
{/if}
