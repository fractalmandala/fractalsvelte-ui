<!-- @example Submenus and placement :: A nested submenu opened to the side, every placement, and a controlled solid menu. -->
<script lang="ts">
	import { luShare, luStar } from '@fractaldesign/icons/lucide';
	import {
		Button,
		DropdownMenu,
		MenuItem,
		MenuSub,
		type Placement
	} from '@fractaldesign/fractalsvelte-ui';

	const placements: Placement[] = [
		'top',
		'top-start',
		'top-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'left',
		'right'
	];

	let open = $state(false);
	let shareOpen = $state(false);
	let log = $state('Share menu is closed');
</script>

<div class="box gap-md">
	<div class="row wrap gap-sm">
		{#each placements as placement (placement)}
			<DropdownMenu {placement}>
				{#snippet trigger({ props })}
					<Button variant="ghost" size="sm" {...props}>{placement}</Button>
				{/snippet}
				<MenuItem>Pin to sidebar</MenuItem>
				<MenuItem>Move to archive</MenuItem>
			</DropdownMenu>
		{/each}
	</div>

	<div class="row wrap gap-sm ycenter">
		<DropdownMenu bind:open surface="solid" onOpenChange={(next) => (open = next)}>
			{#snippet trigger({ props })}
				<Button variant="secondary" {...props}>{open ? 'Close actions' : 'Project actions'}</Button>
			{/snippet}
			<MenuItem icon={luStar} onclick={() => (log = 'Starred')}>Star project</MenuItem>
			<MenuSub bind:open={shareOpen} icon={luShare} label="Share" surface="solid" onOpenChange={(next) => (shareOpen = next)}>
				<MenuItem onclick={() => (log = 'Copied link')}>Copy link</MenuItem>
				<MenuItem onclick={() => (log = 'Invited by email')}>Invite by email</MenuItem>
				<MenuItem disabled>Share to Slack (offline)</MenuItem>
			</MenuSub>
		</DropdownMenu>
		<span class="text-sm text-muted">{log}{shareOpen ? ' · Share is open' : ''}</span>
	</div>
</div>
