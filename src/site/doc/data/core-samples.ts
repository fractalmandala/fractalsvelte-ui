// Self-contained sample content for component previews, per component (path under
// lib/components). Markers: { $snippet: 'text' } renders text;
// { $html: '...' } renders sample markup; { $icon: 'luName' } a lucide icon.
export const coreSamples: Record<string, Record<string, unknown>> = {
	'actions/Button': { children: { $snippet: 'Save' } },
	'actions/CloseButton': { label: 'Close' },
	'actions/CopyButton': { text: 'pnpm add @fractaldesign/fractalsvelte-ui' },
	'actions/IconButton': { label: 'Settings' },
	'blocks/BeforeAfter': {
		beforeSrc: 'https://picsum.photos/id/10/800/450?grayscale',
		afterSrc: 'https://picsum.photos/id/10/800/450'
	},
	'blocks/ChatBubble': { message: 'Hi! How can I help?' },
	'blocks/FeatureGrid': {
		items: [
			{ title: 'Fast', description: 'Built on Svelte 5.', icon: { $icon: 'luZap' } },
			{ title: 'Accessible', description: 'Keyboard and screen reader friendly.', icon: { $icon: 'luAccessibility' } },
			{ title: 'Themeable', description: 'Light and dark modes.', icon: { $icon: 'luPalette' } }
		]
	},
	'display/Alert': { title: 'Saved', description: 'Your changes have been saved.' },
	'display/Avatar': { initials: 'AP' },
	'display/AvatarGroup': {
		max: 3,
		avatars: [
			{ initials: 'AL', status: 'online' },
			{ initials: 'GH', status: 'offline' },
			{ initials: 'AT' },
			{ initials: 'KJ' },
			{ initials: 'MH' },
			{ initials: 'BL' }
		]
	},
	'display/Badge': { children: { $snippet: 'New' } },
	'display/Banner': { children: { $snippet: 'A new version is available.' } },
	'display/Bar': { fraction: 0.65 },
	'display/Counter': { value: 1280 },
	'display/Kbd': { label: 'Keyboard shortcuts', children: { $snippet: 'K' } },
	'display/Meter': { label: 'Storage', value: 64 },
	'display/Progress': { label: 'Uploading', value: 60 },
	'display/Tag': { children: { $snippet: 'Design' } },
	'forms/Checkbox': { label: 'Accept terms' },
	'forms/ColorPicker': { label: 'Colour' },
	'forms/FormField': { label: 'Country', id: 'email', helperText: 'Where you live.' },
	'forms/Input': { label: 'Name' },
	'forms/NumberInput': { label: 'Quantity' },
	'forms/PinInput': { label: 'Verification code' },
	'forms/Radio': { name: 'plan', value: 'pro', label: 'Pro' },
	'forms/RadioGroup': {
		label: 'Plan',
		options: [
			{ value: 'free', label: 'Free' },
			{ value: 'pro', label: 'Pro' },
			{ value: 'team', label: 'Team' }
		]
	},
	'forms/RangeSlider': { label: 'Price' },
	'forms/RotaryDial': { label: 'Volume' },
	'forms/SearchInput': { placeholder: 'Search…' },
	'forms/Select': {
		label: 'Country',
		options: [
			{ value: 'in', label: 'India' },
			{ value: 'uk', label: 'United Kingdom' },
			{ value: 'us', label: 'United States' }
		]
	},
	'forms/Slider': { label: 'Volume' },
	'forms/SliderTrack': { width: 180, height: 24, values: [0.45] },
	'forms/Switch': {
		label: 'Notifications',
		description: 'Email me when someone mentions me.',
		checked: true
	},
	'forms/TagInput': { label: 'Tags' },
	'forms/TextArea': { label: 'Message' },
	'layout/Card': {
		title: 'Project',
		description: 'Last updated today.',
		children: { $snippet: 'Three tasks remaining.' }
	},
	'layout/ClickableCard': { href: '#', title: 'Documentation', description: 'Read the guides.' },
	'layout/Container': { children: { $snippet: 'Page content' } },
	'layout/SelectableCard': {
		title: 'Pro plan',
		description: 'For growing teams.',
		selected: true
	},
	'layout/SplitPane': {
		paneA: { $snippet: 'Left pane' },
		paneB: { $snippet: 'Right pane' }
	},
	'navigation/AppShell': {
		header: { $snippet: 'App' },
		sidebar: { $snippet: 'Menu' },
		children: { $snippet: 'Main content' }
	},
	'navigation/BottomNav': {
		items: [
			{ id: 'home', label: 'Home' },
			{ id: 'search', label: 'Search' },
			{ id: 'profile', label: 'Profile' }
		]
	},
	'navigation/Breadcrumb': {
		items: [
			{ label: 'Home', href: '#' },
			{ label: 'Projects', href: '#' },
			{ label: 'Website' }
		]
	},
	'navigation/Header': {
		brand: { $snippet: 'Acme' }
	},
	'navigation/MobileNav': {
		title: 'Menu',
		children: { $snippet: 'Navigation items' }
	},
	'navigation/Pagination': { totalPages: 10 },
	'navigation/SegmentedControl': {
		options: [
			{ value: 'day', label: 'Day' },
			{ value: 'week', label: 'Week' },
			{ value: 'month', label: 'Month' }
		]
	},
	'navigation/SideNav': {
		items: [
			{ id: 'dashboard', label: 'Dashboard' },
			{ id: 'projects', label: 'Projects' },
			{ id: 'settings', label: 'Settings' }
		]
	},
	'navigation/Stepper': {
		steps: [{ label: 'Account' }, { label: 'Profile' }, { label: 'Review' }]
	},
	'navigation/Tabs': {
		tabs: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'activity', label: 'Activity' },
			{ id: 'settings', label: 'Settings' }
		],
		children: { $snippet: 'Tab content' }
	},
	'navigation/TopNav': {
		items: [
			{ label: 'Home', href: '#' },
			{ label: 'Docs', href: '#' },
			{ label: 'Blog', href: '#' }
		]
	},
	'navigation/TreeList': {
		items: [
			{
				id: 'src',
				label: 'src',
				children: [
					{ id: 'app', label: 'app.html' },
					{ id: 'lib', label: 'lib' }
				]
			},
			{ id: 'pkg', label: 'package.json' }
		]
	},
	'overlays/AlertDialog': {
		title: 'Delete project?',
		description: 'This permanently deletes the Atlas project, its 24 files and all comments.',
		confirmText: 'Delete project'
	},
	'overlays/Anchor': {
		open: true,
		trigger: { $html: '<span class="btn variant size shape outline h-sm min">Trigger</span>' },
		panel: {
			$html: '<div class="card bg-panel border radius-sm shadow-sm pad-sm text-xs nowrap">Panel</div>'
		}
	},
	'overlays/CommandPalette': {
		groups: [
			{
				category: 'Actions',
				items: [
					{ id: 'new', label: 'New file' },
					{ id: 'open', label: 'Open file' }
				]
			}
		]
	},
	'overlays/ContextMenu': {
		items: [
			{ id: 'copy', label: 'Copy' },
			{ id: 'paste', label: 'Paste' },
			{ id: 'delete', label: 'Delete' }
		]
	},
	'overlays/Dialog': {
		title: 'Edit profile',
		description: 'Update how others see you across the workspace.'
	},
	'overlays/Drawer': {
		title: 'Filters',
		description: 'Narrow down the project list.'
	},
	'overlays/DropdownMenu': {
		items: [
			{ label: 'Edit', icon: { $icon: 'luPencil' }, shortcut: '⌘E' },
			{ label: 'Duplicate', icon: { $icon: 'luCopy' }, shortcut: '⌘D' },
			{ separator: true },
			{ label: 'Delete', icon: { $icon: 'luTrash2' }, danger: true }
		]
	},
	'overlays/MenuList': {
		items: [
			{ id: 'edit', label: 'Edit', shortcut: '⌘E' },
			{ id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
			{ separator: true },
			{ id: 'delete', label: 'Delete', danger: true }
		],
		autofocus: false,
		onselect: () => {},
		onclose: () => {}
	},
	'overlays/Modal': {
		children: { $snippet: 'Modal content' }
	},
	'overlays/Popover': {
		children: { $snippet: 'Popover content' }
	},
	'overlays/Toast': {
		title: 'Saved',
		description: 'Your changes have been saved.',
		messageText: 'text-success',
		duration: 0
	},
	'overlays/ToastStack': { position: 'inline' },
	'overlays/Tooltip': { content: 'Save changes' },
	'typography/Accordion': {
		items: [
			{ id: 'one', title: 'What is it?', content: 'A component library.' },
			{ id: 'two', title: 'Is it free?', content: 'Yes.' }
		]
	},
	'typography/Blockquote': {
		quote: 'Simplicity is the ultimate sophistication.',
		author: 'Leonardo da Vinci'
	},
	'typography/Code': { children: { $snippet: 'pnpm install' } },
	'typography/CodeBlock': {
		filename: 'install.sh',
		language: 'bash',
		code: 'pnpm add @fractaldesign/fractalsvelte-ui',
		showLineNumbers: true
	},
	'typography/Collapsible': { title: 'Details' }
};
