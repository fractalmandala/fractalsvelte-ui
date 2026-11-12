<!-- @example Usage :: A workspace navigation with groups, icons, a badge and a separator. -->
<script lang="ts">
	import { SidebarNav, Button } from '@fractaldesign/fractalsvelte-ui';
	import {
		luInbox,
		luFile,
		luCalendar,
		luSettings,
		luUser,
		luStar,
		luCreditCard
	} from '@fractaldesign/icons/lucide';

	let collapsed = $state(false);
	const items = [
		{ label: 'Inbox', href: '/inbox', icon: luInbox, badge: 12 },
		{ label: 'Drafts', href: '/drafts', icon: luFile },
		{ label: 'Starred', href: '/starred', icon: luStar },
		{ separator: true },
		{
			label: 'Library',
			icon: luCalendar,
			defaultOpen: true,
			children: [
				{ label: 'This week', href: '/library/week', icon: luCalendar },
				{ label: 'Archive', href: '/library/archive', icon: luFile }
			]
		},
		{
			label: 'Account',
			icon: luUser,
			children: [
				{ label: 'Profile', href: '/account', icon: luUser },
				{ label: 'Billing', href: '/account/billing', icon: luCreditCard },
				{ label: 'Settings', href: '/account/settings', icon: luSettings, disabled: true }
			]
		}
	];
</script>

<div class="row gap-md ytop">
	<SidebarNav {items} current="/inbox" bind:collapsed onCollapsedChange={() => {}} label="Sidebar" />
	<Button variant="ghost" size="sm" onclick={() => (collapsed = !collapsed)}>
		{collapsed ? 'Expand' : 'Collapse'} rail
	</Button>
</div>
