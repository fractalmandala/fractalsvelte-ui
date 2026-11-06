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
	'blocks/Audio': {
		title: 'Ambient Echoes',
		caption: 'Soundscape Studio',
		src: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3'
	},
	'blocks/AudioTrack': {
		trackNumber: 1,
		title: 'Solaris Resonance',
		artist: 'Fractal Sound Lab',
		album: 'Modular Harmonics',
		duration: 245,
		active: true
	},
	'blocks/AudioTrackList': {
		tracks: [
			{ id: 1, title: 'Solaris Resonance', artist: 'Fractal Sound Lab', album: 'Modular Harmonics', duration: '4:05' },
			{ id: 2, title: 'Prism Horizon', artist: 'Aura', album: 'Modular Harmonics', duration: '3:22' },
			{ id: 3, title: 'Kinetic Waves', artist: 'Vector One', album: 'Modular Harmonics', duration: '5:10' }
		]
	},
	'blocks/Canvas': {
		ratio: '16/9',
		label: 'Interactive Canvas'
	},
	'blocks/Carousel': {
		items: ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4']
	},
	'blocks/EmptyState': {
		title: 'No documents yet',
		description: 'Create a new document to get started.'
	},
	'blocks/FlowCanvas': {
		nodes: [
			{ id: '1', x: 20, y: 30, label: 'Start' },
			{ id: '2', x: 180, y: 30, label: 'Process' }
		]
	},
	'blocks/Video': {
		title: 'Product Tour',
		caption: 'Overview of features',
		poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80'
	},
	'blocks/Waveform': {
		peaks: [0.2, 0.5, 0.8, 0.4, 0.7, 0.9, 0.6, 0.3, 0.8, 0.5],
		progress: 40,
		duration: 180
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
	'display/Ribbon': {
		children: { $snippet: 'PRO' }
	},
	'display/Skeleton': {
		lines: 3,
		width: '100%'
	},
	'display/Spinner': {
		label: 'Loading…'
	},
	'display/Stamp': {
		children: { $snippet: '★' }
	},
	'display/Status': {
		label: 'Operational',
		variant: 'success'
	},
	'display/Table': {
		columns: [
			{ key: 'id', label: 'ID' },
			{ key: 'status', label: 'Status' }
		],
		rows: [
			{ id: 'INV-01', status: 'Paid' },
			{ id: 'INV-02', status: 'Pending' }
		]
	},
	'display/Tag': { children: { $snippet: 'Design' } },
	'display/AspectRatio': {
		ratio: '16/9'
	},
	'display/Datatable': {
		columns: [
			{ key: 'name', label: 'Name' },
			{ key: 'role', label: 'Role' }
		],
		rows: [
			{ id: 1, name: 'Alice', role: 'Engineer' },
			{ id: 2, name: 'Bob', role: 'Designer' }
		]
	},
	'display/Divider': {
		label: 'OR'
	},
	'display/Dot': {
		variant: 'success'
	},
	'display/Img': {
		src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
		alt: 'Sample Artwork',
		ratio: '1/1'
	},
	'forms/Checkbox': { label: 'Accept terms' },
	'forms/ColorPicker': { label: 'Colour' },
	'forms/Combobox': {
		placeholder: 'Choose framework…',
		options: [
			{ value: 'svelte', label: 'Svelte' },
			{ value: 'vue', label: 'Vue' },
			{ value: 'react', label: 'React' }
		]
	},
	'forms/Fader': {
		value: 65,
		label: 'Master (dB)'
	},
	'forms/Fieldset': {
		legend: 'Account Settings',
		children: {
			$html: '<div class="text-xs text-secondary">Manage your profile and workspace preferences.</div>'
		}
	},
	'forms/FileUpload': {
		label: 'Upload Assets',
		hint: 'PNG, JPG up to 10MB'
	},
	'forms/FormField': { label: 'Country', id: 'email', helperText: 'Where you live.' },
	'forms/Input': { label: 'Name' },
	'forms/Label': {
		children: { $snippet: 'Email address' },
		description: 'We will not share your email.'
	},
	'forms/MultiSelect': {
		placeholder: 'Choose skills…',
		options: [
			{ value: 'svelte', label: 'Svelte' },
			{ value: 'design', label: 'Design' },
			{ value: 'motion', label: 'Motion' }
		],
		value: ['svelte']
	},
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
	'forms/XYPad': {
		value: { x: 60, y: 40 },
		label: 'Filter Resonance'
	},
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
	'layout/Grid': {
		cols: 3,
		children: {
			$html: '<div class="card bg-panel border radius-sm p-sm text-xs ta-c font-mono">1</div><div class="card bg-panel border radius-sm p-sm text-xs ta-c font-mono">2</div><div class="card bg-panel border radius-sm p-sm text-xs ta-c font-mono">3</div>'
		}
	},
	'layout/Stack': {
		children: {
			$html: '<div class="card bg-panel border radius-sm px-md py-xs text-xs">First</div><div class="card bg-panel border radius-sm px-md py-xs text-xs">Second</div><div class="card bg-panel border radius-sm px-md py-xs text-xs">Third</div>'
		}
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
	'typography/Collapsible': { title: 'Details' },
	'typography/Heading': {
		children: { $snippet: 'Design Systems' }
	},
	'typography/Text': {
		children: { $snippet: 'Building resilient user interfaces.' }
	}
};
