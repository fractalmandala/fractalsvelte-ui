// Sample content for component previews, one entry per component, keyed by its
// path under lib/components ("core/Button").
// Markers: { $snippet: 'text' } renders text; { $html: '...' } renders sample
// markup; { $icon: 'klName' } a keyline icon.
export const coreSamples: Record<string, Record<string, unknown>> = {
	// ---- core
	'core/Accordion': {
		value: 'why',
		items: [
			{ id: 'why', title: 'Why Fractalsvelte UI?', content: 'No Tailwind deps, easy props, lean.' },
			{ id: 'custom', title: 'Is it customizable?', content: 'It absolutely is.' },
			{ id: 'themes', title: 'Themeable?', content: 'Fully!' }
		]
	},
	'core/Alert': { title: 'Saved', description: 'Your changes have been saved.' },
	'core/AlertDialog': {
		title: 'Delete Past Life?',
		description: 'This permanently deletes past life memories and initiates next incarnation.',
		confirmText: 'Reincarnate'
	},
	'core/AspectRatio': {},
	'core/Button': { children: { $snippet: 'Save' } },
	'core/Card': {
		title: 'This is the title of a hypothetical blog essay.',
		description: 'The essay is hypothetically about human imagination and inner space.',
		children: { $snippet: '#consciousness' }
	},
	'core/Checkbox': { label: 'Accept terms', checked: true },
	'core/CodeBlock': {
		filename: 'install.sh',
		language: 'bash',
		code: 'pnpm add @fractaldesign/fractalsvelte-ui'
	},
	'core/Combobox': {
		placeholder: 'Choose framework…',
		options: [
			{ value: 'svelte', label: 'Svelte' },
			{ value: 'vue', label: 'Vue' },
			{ value: 'react', label: 'React' }
		]
	},
	'core/CommandPalette': {
		groups: [
			{
				category: 'Actions',
				items: [
					{ id: 'new', label: 'New file', shortcut: '⌘N' },
					{ id: 'open', label: 'Open file', shortcut: '⌘O' }
				]
			}
		]
	},
	'core/ContextMenu': {
		items: [
			{ id: 'copy', label: 'Copy' },
			{ id: 'paste', label: 'Paste' },
			{ id: 'delete', label: 'Delete', danger: true }
		],
		children: {
			$html: '<div class="pad-lg border-dashed modern text-sm text-secondary">Right-click here</div>'
		}
	},
	'core/Dialog': {
		title: 'Edit profile',
		description: 'Update how others see you across the workspace.',
		children: { $snippet: 'Changes apply to every project you belong to.' }
	},
	'core/Drawer': {
		title: 'Filters',
		description: 'Narrow down the project list.',
		children: { $snippet: 'Pick the projects you want to see.' }
	},
	'core/DropdownMenu': {
		items: [{ label: 'Edit' }, { label: 'Duplicate' }, { separator: true }, { label: 'Delete', danger: true }]
	},
	'core/Icon': { icon: { $icon: 'klStar' } },
	'core/Input': { label: 'Name', placeholder: 'Asha Rao' },
	'core/Label': { children: { $snippet: 'Email address' } },
	'core/Modal': {
		children: {
			$html: '<div class="box gap-sm pad-lg"><h3 class="page-heading-bs">Modal</h3><p class="text-body-sm text-secondary">Content sits on the modal panel. Press Escape to close.</p></div>'
		}
	},
	'core/Popover': { children: { $snippet: 'Popover content' } },
	'core/Radio': { name: 'plan', value: 'pro', label: 'Pro', checked: true },
	'core/RadioGroup': {
		label: 'Plan',
		value: 'pro',
		options: [
			{ value: 'free', label: 'Free' },
			{ value: 'pro', label: 'Pro' },
			{ value: 'team', label: 'Team' }
		]
	},
	'core/Select': {
		label: 'Country',
		value: 'in',
		options: [
			{ value: 'in', label: 'India' },
			{ value: 'uk', label: 'United Kingdom' },
			{ value: 'us', label: 'United States' }
		]
	},
	'core/Switch': { label: 'Notifications', checked: true },
	'core/Toast': { title: 'Saved', description: 'Your changes have been saved.', duration: 0 },
	'core/Tooltip': {
		content: 'Save changes',
		children: { $html: '<span class="button inline-flex outline h-bs mincurved text-sm">Hover me</span>' }
	},

	// ---- actions
	'actions/CloseButton': { label: 'Close', size: 'h-xl' },
	'actions/CopyButton': { text: 'pnpm add @fractaldesign/fractalsvelte-ui', size: 'h-xl' },
	'actions/IconButton': { label: 'Favourite', size: 'h-xl' },

	// ---- forms
	'forms/ColorPicker': { label: 'Colour' },
	'forms/Fader': { value: 65, label: 'Master' },
	'forms/Fieldset': {
		legend: 'Account settings',
		children: { $html: '<p class="text-body-sm text-secondary">Manage your profile and workspace preferences.</p>' }
	},
	'forms/FileUpload': { label: 'Click to browse or drag files here', hint: 'PNG, JPG or PDF up to 10 MB' },
	'forms/FormField': { label: 'Country', helperText: 'Where you live.' },
	'forms/MultiSelect': {
		placeholder: 'Choose skills…',
		value: ['svelte'],
		options: [
			{ value: 'svelte', label: 'Svelte' },
			{ value: 'design', label: 'Design' },
			{ value: 'motion', label: 'Motion' }
		]
	},
	'forms/NumberInput': { label: 'Quantity', value: 2 },
	'forms/PinInput': { label: 'Verification code', value: '12' },
	'forms/RangeSlider': { label: 'Price', minVal: 20, maxVal: 80 },
	'forms/RotaryDial': { label: 'Gain', value: 40 },
	'forms/SearchInput': { placeholder: 'Search documentation…' },
	'forms/Slider': { label: 'Volume', value: 60 },
	'forms/SliderTrack': { width: 180, height: 24, values: [0.45] },
	'forms/TagInput': { label: 'Tags', tags: ['svelte', 'css'] },
	'forms/TextArea': { label: 'Message', placeholder: 'Write a few lines…' },
	'forms/XYPad': { value: { x: 60, y: 40 }, label: 'Filter' },

	// ---- display
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
	'display/Datatable': {
		caption: 'Projects',
		rowKey: 'project',
		columns: [
			{ key: 'project', label: 'Project', sortable: true },
			{ key: 'status', label: 'Status' },
			{ key: 'version', label: 'Version', align: 'right' }
		],
		rows: [
			{ project: 'Atlas', status: 'Published', version: '1.5.0' },
			{ project: 'Borealis', status: 'Draft', version: '0.9.2' },
			{ project: 'Cygnus', status: 'Archived', version: '2.1.4' }
		]
	},
	'display/Divider': { label: 'OR' },
	'display/Dot': {},
	'display/Img': { src: 'https://picsum.photos/id/29/400/300', alt: 'Mountain ridge' },
	'display/Kbd': { label: 'Keyboard shortcuts', children: { $snippet: 'K' } },
	'display/Meter': { label: 'Storage', value: 64 },
	'display/Progress': { label: 'Uploading', value: 60 },
	'display/Ribbon': { children: { $snippet: 'New' } },
	'display/Skeleton': { lines: 3 },
	'display/Spinner': {
		label: 'Loading…'
	},
	'display/Stamp': { children: { $snippet: '7' } },
	'display/Status': {
		label: 'Operational',
		variant: 'success'
	},
	'display/Table': {
		caption: 'Projects',
		columns: [
			{ key: 'project', label: 'Project', sortable: true },
			{ key: 'status', label: 'Status' },
			{ key: 'version', label: 'Version', align: 'right' }
		],
		rows: [
			{ project: 'Atlas', status: 'Published', version: '1.5.0' },
			{ project: 'Borealis', status: 'Draft', version: '0.9.2' },
			{ project: 'Cygnus', status: 'Archived', version: '2.1.4' }
		]
	},
	'display/Tag': { children: { $snippet: 'Design' } },

	// ---- layout
	'layout/ClickableCard': { href: '#', title: 'Documentation', description: 'Read the guides.' },
	'layout/Container': { children: { $snippet: 'Page content' } },
	'layout/Grid': { cols: 3, children: { $html: '<div class="contents"><div class="pad-sm modern bg-panel text-xs ta-c font-mono">1</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">2</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">3</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">4</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">5</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">6</div></div>' } },
	'layout/SelectableCard': {
		title: 'Pro plan',
		description: 'For growing teams.',
		selected: false
	},
	'layout/SplitPane': {
		paneA: { $html: '<div class="pad-md text-sm text-secondary">Pane A</div>' },
		paneB: { $html: '<div class="pad-md text-sm text-secondary">Pane B</div>' }
	},
	'layout/Stack': { children: { $html: '<div class="contents"><div class="pad-sm modern bg-panel text-xs ta-c font-mono">First</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">Second</div><div class="pad-sm modern bg-panel text-xs ta-c font-mono">Third</div></div>' } },

	// ---- navigation
	'navigation/AppShell': {
		header: { $snippet: 'App' },
		sidebar: { $snippet: 'Menu' },
		children: { $snippet: 'Main content' }
	},
	'navigation/BottomNav': {
		activeId: 'home',
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
		value: 'week',
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
	'navigation/Stepper': { currentStep: 1, steps: [{ label: 'Account' }, { label: 'Profile' }, { label: 'Review' }] },
	'navigation/Tabs': {
		activeTab: 'overview',
		tabs: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'activity', label: 'Activity', badge: 3 },
			{ id: 'settings', label: 'Settings' }
		]
	},
	'navigation/TopNav': {
		activeId: 'docs',
		items: [
			{ id: 'home', label: 'Home', href: '#' },
			{ id: 'docs', label: 'Docs', href: '#' },
			{ id: 'blog', label: 'Blog', href: '#' }
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

	// ---- overlays
	'overlays/Anchor': {
		open: true,
		trigger: { $html: '<span class="button inline-flex outline h-bs mincurved text-sm">Trigger</span>' },
		panel: { $html: '<div class="pad-sm modern bg-overlay border shad-sm text-xs">Panel</div>' }
	},
	'overlays/MenuList': {
		label: 'Actions',
		autofocus: false,
		onselect: () => {},
		onclose: () => {},
		items: [{ label: 'Edit', shortcut: '⌘E' }, { label: 'Duplicate' }, { separator: true }, { label: 'Delete', danger: true }]
	},
	'overlays/ToastStack': {},

	// ---- typography
	'typography/Blockquote': {
		quote: 'Simplicity is the ultimate sophistication.',
		author: 'Leonardo da Vinci'
	},
	'typography/Code': { children: { $snippet: 'pnpm install' } },
	'typography/Collapsible': {
		title: 'Details',
		children: { $snippet: 'Hidden content reveals smoothly when expanded.' }
	},
	'typography/Heading': {
		children: { $snippet: 'Heading' }
	},
	'typography/Text': {
		children: { $snippet: 'Building resilient user interfaces.' }
	},

	// ---- blocks
	'blocks/BeforeAfter': {
		beforeSrc: 'https://picsum.photos/id/10/800/450?grayscale',
		afterSrc: 'https://picsum.photos/id/10/800/450'
	},
	'blocks/Canvas': { label: 'Canvas' },
	'blocks/Carousel': {
		items: ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4']
	},
	'blocks/ChatBubble': { message: 'Hi! How can I help?' },
	'blocks/EmptyState': {
		title: 'No documents yet',
		description: 'Create a new document to get started.'
	},
	'blocks/FeatureGrid': {
		items: [
			{ title: 'Tokens', description: 'Every colour and size is a variable.', badge: 'Core' },
			{ title: 'Classes', description: 'Props are class names you can read.' },
			{ title: 'Runes', description: 'Built on Svelte 5 from the start.' }
		]
	},
	'blocks/FlowCanvas': {},
	'blocks/Video': {
		title: 'Product Tour',
		caption: 'Overview of features',
		poster: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23222"/><text x="50%" y="50%" fill="%23fff" font-family="sans-serif" font-size="24" text-anchor="middle">Product Tour</text></svg>'
	},
	'blocks/Waveform': {
		peaks: [0.2, 0.5, 0.8, 0.4, 0.7, 0.9, 0.6, 0.3, 0.8, 0.5],
		progress: 40,
		duration: 180
	}
};
