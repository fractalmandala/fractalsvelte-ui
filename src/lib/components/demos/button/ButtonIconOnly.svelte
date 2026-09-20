<script lang="ts">
	import { Button } from 'fractalsvelte/components';
	import { Icon } from 'fractalicons';
	import { luSettings, luBell, luArchive } from 'fractalicons/lucide';

	let { selected = 'all' }: { selected?: string } = $props();
</script>

{#if selected === 'all'}
	<div class="row wrap gap-sm ycenter">
		<Button size="icon-sm" variant="ghost" aria-label="Settings">
			<Icon icon={luSettings} />
		</Button>
		<Button size="icon" variant="outline" aria-label="Notifications">
			<Icon icon={luBell} />
		</Button>
		<Button size="icon-lg" variant="soft" aria-label="Archive">
			<Icon icon={luArchive} />
		</Button>
	</div>
{:else if selected === 'icon-sm'}
	<Button size="icon-sm" variant="ghost" aria-label="Settings">
		<Icon icon={luSettings} />
	</Button>
{:else if selected === 'icon'}
	<Button size="icon" variant="outline" aria-label="Notifications">
		<Icon icon={luBell} />
	</Button>
{:else if selected === 'icon-lg'}
	<Button size="icon-lg" variant="soft" aria-label="Archive">
		<Icon icon={luArchive} />
	</Button>
{/if}
