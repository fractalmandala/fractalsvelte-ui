<!-- @example Shortcut and drawer :: ⌘K folds the rail to icons, and the same tree slides in over the page as a drawer on a narrow viewport. -->
<script lang="ts">
	import { SidebarNav, Button } from '@fractaldesign/fractalsvelte-ui';
	import { luInbox, luFile, luCalendar, luSettings } from '@fractaldesign/icons/lucide';

	const items = [
		{ label: 'Inbox', href: '/inbox', icon: luInbox, badge: 4 },
		{ label: 'Drafts', href: '/drafts', icon: luFile },
		{ separator: true },
		{
			label: 'Library',
			icon: luCalendar,
			children: [
				{ label: 'This week', href: '/library/week', icon: luCalendar },
				{ label: 'Settings', href: '/library/settings', icon: luSettings }
			]
		}
	];

	let collapsed = $state(false);
	let mobileOpen = $state(false);
</script>

<div class="row gap-md ytop">
	<SidebarNav
		{items}
		current="/inbox"
		bind:collapsed
		bind:mobileOpen
		shortcut="k"
		label="Workspace"
		size="h-sm"
		shape="modern"
		childTextSize="text-sm"
		surface="paneled"
	/>
	<div class="column gap-sm min0">
		<Button variant="ghost" size="h-sm" onclick={() => (mobileOpen = true)}>Open drawer</Button>
		<p class="text-sm text-muted">
			⌘K or Ctrl-K folds the rail on {collapsed ? 'an expanded' : 'a collapsed'} sidebar; the drawer covers the page
			below 768px.
		</p>
	</div>
</div>
