<script lang="ts">
	import {
		Accordion,
		Alert,
		AnimatedButton,
		AnimatedCard,
		Avatar,
		Badge,
		BitsEffect,
		Button,
		Card,
		Card3D,
		CardStack,
		Carousel,
		Checkbox,
		ContextMenu,
		ContextMenuContent,
		ContextMenuCheckboxItem,
		ContextMenuItem,
		ContextMenuLabel,
		ContextMenuSeparator,
		ContextMenuShortcut,
		ContextMenuTrigger,
		Counter,
		Dialog,
		Input,
		MacosDock,
		Magnetic,
		Marquee,
		MotionList,
		Presence,
		Progress,
		Reveal,
		Select,
		Separator,
		Slider,
		DropdownMenu,
		Skeleton,
		Stepper,
		Switch,
		Tabs,
		Textarea,
		TextLoop,
		TextScramble,
		Theme,
		ThemeSetter,
		Toast,
		Tooltip,
		AppShell,
		AspectRatio,
		Banner,
		Blockquote,
		Breadcrumbs,
		ButtonGroup,
		Calendar,
		ClickableCard,
		Collapsible,
		FormLayout,
		Kbd,
		ResizeHandle,
		Table,
		Thumbnail,
		CheckIndicator,
		DatePicker,
		ColorPicker,
		Combobox,
		CommandPalette,
		ComplexSelector,
		FileInput,
		IconButton,
		MultiSelector,
		RadioIndicator,
		RadioList,
		Rating,
		SegmentedControl,
		SelectableCard,
		Selector,
		TimePicker,
		ToggleButton,
		ToggleButtonGroup,
		Toolbar,
		ToolbarGroup,
		Confetti,
		CookieConsent,
		Countdown,
		Drawer,
		Empty,
		Lightbox,
		Menubar,
		MoreMenu,
		Overlay,
		Outline,
		Pagination,
		Popover,
		HoverCard,
		ToastItem,
		ToastViewport,
		MobileNav,
		MobileNavToggle,
		SideNav,
		TabList,
		TopNav,
		TopNavMenu,
		TopNavMegaMenu,
		TopNavMegaMenuFeaturedCard,
		TreeList,
		MorphingTabs,
		CenterMorphModal,
		CenterMorphModalTrigger,
		CenterMorphModalContent,
		MorphPopover,
		MorphPopoverTrigger,
		MorphPopoverContent,
		MorphSelect,
		MorphSelectTrigger,
		MorphSelectValue,
		MorphSelectContent,
		MorphSelectItem,
		AnimatedSidebarProvider,
		AnimatedSidebar,
		AnimatedSidebarHeader,
		AnimatedSidebarContent,
		AnimatedSidebarGroup,
		AnimatedSidebarGroupLabel,
		AnimatedSidebarGroupContent,
		AnimatedSidebarMenu,
		AnimatedSidebarMenuItem,
		AnimatedSidebarMenuButton,
		SharedLayoutBg,
		SharedLayoutBgItem,
		ToastStack,
		BouncyAccordion,
		Code,
		CodeBlock
	} from '#lib/components/index.ts';
	import { Icon } from 'fractalicons';
	import { luBell, luPlus, luBold, luItalic, luLink, luImage, luLayoutGrid, luFile } from 'fractalicons/lucide';
	import MotionCore from './MotionCore.svelte';
	import { svelteBitsCategoryBySlug, svelteBitsSlugs } from '#lib/docs/catalogue.ts';
	import { highlight } from '#lib/docs/highlight.ts';

	let { slug }: { slug: string } = $props();

	// Standalone Components Knobs State
	let card3dMaxTilt = $state(18);
	let card3dGlare = $state(true);
	let card3dPerspective = $state(1000);
	let card3dScale = $state(1.02);

	let macosDockMagnification = $state(1.6);
	let macosDockDistance = $state(120);

	let cardStackMaxVisible = $state(3);
	let cmSnap = $state(true);
	let themeSetterOpen = $state(false);

	let textScrambleText = $state('Decentralized Future');
	let textScrambleTrigger = $state<'hover' | 'click' | 'mount'>('hover');
	let textScrambleSpeed = $state(30);

	// Catalogue-extension knob state
	let shellSidebar = $state(true);
	let shellFooter = $state(true);
	let aspectRatio = $state('16/9');
	let bannerVariant = $state<'default' | 'info' | 'success' | 'warning' | 'danger'>('default');
	let bannerDismissible = $state(false);
	let crumbsDepth = $state(3);
	let groupOrientation = $state<'horizontal' | 'vertical'>('horizontal');
	let calendarMonth = $state('July 2026');
	let formCols = $state<1 | 2 | 3>(2);
	let kbdKeys = $state('⌘ K');
	let tableRows = $state(4);
	let thumbShape = $state<'square' | 'round'>('square');
	let checkState = $state<'checked' | 'unchecked' | 'indeterminate'>('checked');
	let pickerValue = $state('#3b82f6');
	let pickerSwatches = $state(true);
	let comboSearchable = $state(true);
	let pickerStep = $state(30);
	let pickerHour12 = $state(true);
	let fileMultiple = $state(false);
	let iconBtnLabel = $state('Notifications');
	let ratingValue = $state(4);
	let ratingMax = $state(5);
	let selectableState = $state(true);
	let selectorDesc = $state(true);
	let countdownSeconds = $state(90);
	let countdownShowDays = $state(false);
	let drawerSide = $state<'left' | 'right'>('right');
	let drawerOpen = $state(false);
	let lightboxIndex = $state(0);
	let paginationPage = $state(2);
	let paginationTotal = $state(9);
	let popoverPlacement = $state<'top' | 'bottom' | 'left' | 'right'>('bottom');
	let popoverOpen = $state(false);
	let overlayModal = $state(true);
	let outlineLevels = $state(true);
	let toastPos = $state<'top-right' | 'bottom-right'>('bottom-right');
	let toastCount = $state(2);
	let navActive = $state('overview');
	let treeOpen = $state(true);
	let tabsMorphValue = $state('grid');
	let morphPopoverOpen = $state(false);
	let morphSelectValue = $state('speed');
	let sidebarOpen = $state(true);
	let bouncyCollapsible = $state(true);
	let paletteOpen = $state(false);
	let lightboxOpen = $state(false);
	let overlayOpen = $state(false);
	let mobileNavOpen = $state(false);
	let confettiApi: Confetti | null = $state(null);
	const demoNonce = Math.random().toString(36).slice(2, 8);

	// Stage controls
	let viewportWidth = $state<'100%' | '768px' | '375px'>('100%');
	let bgMode = $state<'surface' | 'grid' | 'checker'>('surface');
	let copied = $state(false);

	// Core UI Knobs State
	let btnVariant = $state<'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'soft'>('primary');
	let btnSize = $state<'sm' | 'md' | 'lg' | 'icon-sm' | 'icon' | 'icon-lg'>('md');
	let btnShape = $state<'default' | 'pill'>('default');
	let btnDisabled = $state(false);
	let btnLoading = $state(false);
	let btnLabel = $state('Save changes');

	let badgeVariant = $state<'neutral' | 'accent' | 'success' | 'warning' | 'danger'>('accent');
	let badgeText = $state('Featured');

	let alertVariant = $state<'info' | 'success' | 'warning' | 'danger'>('info');
	let alertTitle = $state('A thoughtful default');
	let alertContent = $state('This alert puts context where it is needed.');

	let avatarName = $state('Maya Chen');
	let avatarSize = $state<'sm' | 'md' | 'lg'>('md');
	let avatarSrc = $state('');

	let cardPadding = $state<'none' | 'sm' | 'md' | 'lg'>('md');

	let accordionTitle = $state('How does it work?');
	let accordionOpen = $state(true);

	let inputType = $state<'text' | 'email' | 'password' | 'search' | 'number'>('email');
	let inputPlaceholder = $state('you@example.com');
	let inputDisabled = $state(false);
	let inputValue = $state('');

	let textareaPlaceholder = $state('Leave a note for the team...');
	let textareaRows = $state(4);
	let textareaDisabled = $state(false);
	let textareaValue = $state('');

	let checkboxChecked = $state(true);
	let checkboxLabel = $state('I agree to product updates');
	let checkboxDisabled = $state(false);

	let switchChecked = $state(true);
	let switchLabel = $state('Enable notifications');
	let switchDisabled = $state(false);

	let selectValue = $state('team');
	let selectPlaceholder = $state('Select plan');
	let selectDisabled = $state(false);
	const selectOptions = [
		{ label: 'Starter', value: 'starter' },
		{ label: 'Team', value: 'team' },
		{ label: 'Enterprise', value: 'enterprise' }
	];

	// Catalogue-extension demo data
	const demoCrumbs = [
		{ label: 'Home', href: '/introduction' },
		{ label: 'Projects', href: '/introduction' },
		{ label: 'Aurora', href: '/introduction' }
	];
	const demoColumns = [
		{ key: 'name', header: 'Name', width: '40%' },
		{ key: 'role', header: 'Role', width: '35%' },
		{ key: 'status', header: 'Status', width: '25%' }
	];
	const demoRows = [
		{ id: '1', name: 'Maya Chen', role: 'Design lead', status: 'Active' },
		{ id: '2', name: 'Tom Okafor', role: 'Engineer', status: 'Active' },
		{ id: '3', name: 'Ana Ruiz', role: 'Researcher', status: 'Invited' },
		{ id: '4', name: 'Leo Park', role: 'Engineer', status: 'Active' },
		{ id: '5', name: 'Zoe Adler', role: 'PM', status: 'Paused' }
	];
	const demoPeople = [
		{ value: 'maya', label: 'Maya Chen', description: 'Design lead' },
		{ value: 'tom', label: 'Tom Okafor', description: 'Engineer' },
		{ value: 'ana', label: 'Ana Ruiz', description: 'Researcher' }
	];
	const demoComboOptions = [
		{ value: 'svelte', label: 'Svelte', description: 'Component framework' },
		{ value: 'kit', label: 'SvelteKit', description: 'App framework' },
		{ value: 'vitest', label: 'Vitest', description: 'Test runner' }
	];
	const demoCommandItems = [
		{ id: 'new', label: 'New project', description: 'Start a fresh workspace' },
		{ id: 'invite', label: 'Invite teammate', description: 'Share the current project' },
		{ id: 'theme', label: 'Toggle theme', description: 'Switch light or dark' }
	];
	const demoToggles = [
		{ value: 'bold', label: 'Bold' },
		{ value: 'italic', label: 'Italic' },
		{ value: 'underline', label: 'Underline' }
	];
	const demoMenuItems = [
		{ label: 'Duplicate', shortcut: '⌘D' },
		{ label: 'Rename', shortcut: '⏎' },
		{ label: 'Delete', danger: true }
	];
	const demoMenubarMenus = [
		{ label: 'File', items: [{ label: 'New', shortcut: '⌘N' }, { label: 'Open…', shortcut: '⌘O' }, 'separator' as const, { label: 'Close', shortcut: '⌘W' }] },
		{ label: 'Edit', items: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }, 'separator' as const, { label: 'Cut', shortcut: '⌘X' }, { label: 'Copy', shortcut: '⌘C' }] }
	];
	const demoTopNavItems = [
		{ label: 'Overview', href: '/introduction', active: true },
		{ label: 'Docs', href: '/introduction' },
		{ label: 'Pricing', href: '/introduction' }
	];
	const demoSideNavGroups = [
		{ heading: 'Platform', items: [{ label: 'Dashboard', value: 'dashboard', href: '/introduction' }, { label: 'Reports', value: 'reports', href: '/introduction' }] },
		{ heading: 'Workspace', items: [{ label: 'Members', value: 'members', href: '/introduction' }, { label: 'Settings', value: 'settings', href: '/introduction' }] }
	];
	const demoTree = [
		{ id: 'src', label: 'src', defaultOpen: true, children: [
			{ id: 'lib', label: 'lib', defaultOpen: true, children: [{ id: 'components', label: 'components' }, { id: 'styles', label: 'styles' }] },
			{ id: 'routes', label: 'routes' }
		] },
		{ id: 'static', label: 'static' }
	];
	const demoOutline = [
		{ label: 'Introduction', href: '/introduction#introduction', level: 2 as const, active: true },
		{ label: 'Live preview', href: '/introduction#live-preview', level: 2 as const },
		{ label: 'Props', href: '/introduction#props', level: 2 as const },
		{ label: 'Theming', href: '/introduction#styling-contract', level: 3 as const }
	];
	const demoLightboxImages = [
		{ src: '/images/logomotif.png', alt: 'Fractal motif' },
		{ src: '/images/logotype-d.png', alt: 'Logotype on dark' },
		{ src: '/images/logotype-w.png', alt: 'Logotype on light' }
	];
	const demoToastData = (count: number) =>
		[
			{ id: 't1', title: 'Build complete', description: 'Deployed to production.', variant: 'success' as const },
			{ id: 't2', title: 'New comment', description: 'Ana mentioned you.', variant: 'default' as const },
			{ id: 't3', title: 'Storage almost full', description: '92% of 10 GB used.', variant: 'warning' as const },
			{ id: 't4', title: 'Sync failed', description: 'Retry in a moment.', variant: 'danger' as const }
		].slice(0, Math.max(1, Math.min(4, count)));
	const demoMegaColumns = [
		{ heading: 'Product', links: [{ label: 'Overview', href: '/introduction', description: 'What we make' }, { label: 'Features', href: '/introduction' }] },
		{ heading: 'Developers', links: [{ label: 'Docs', href: '/introduction', description: 'Guides and API' }, { label: 'Changelog', href: '/introduction' }] }
	];
	const demoMorphTabsItems = ['grid', 'list', 'map'];
	const demoBouncyItems = [
		{ id: 'what', title: 'What is this?', description: 'A spring-animated disclosure row.' },
		{ id: 'how', title: 'How does it move?', description: 'Each row bounces as it expands or collapses.' },
		{ id: 'why', title: 'Why use it?', description: 'Motion draws the eye without blocking interaction.' }
	];
	const demoToasts = [
		{ id: 'a1', title: 'Deployed', description: 'Build 412 is live.', status: 'success' as const, duration: 0 },
		{ id: 'a2', title: 'Heads up', description: 'Maintenance at 22:00 UTC.', status: 'info' as const, duration: 0 }
	];
	const demoCodeSnippet = '<script>\n\timport { Button } from \'fractalsvelte/components\';\n<\/script>\n\n<Button variant="primary">Save</Button>';

	let dialogOpen = $state(false);
	let dialogTitle = $state('Invite a teammate');
	let dialogDescription = $state('They will receive an email invitation.');

	let tooltipContent = $state('Create a new workspace');
	let tooltipPosition = $state<'top' | 'bottom'>('top');

	let progressValue = $state(68);
	let progressMax = $state(100);
	let progressLabel = $state('Uploading files');

	let skeletonWidth = $state('100%');
	let skeletonHeight = $state('1.5rem');
	let skeletonCircle = $state(false);

	let toastOpen = $state(true);
	let toastVariant = $state<'info' | 'success' | 'warning' | 'danger'>('success');
	let toastTitle = $state('Changes saved');

	let separatorOrientation = $state<'horizontal' | 'vertical'>('horizontal');
	let sliderValue = $state(50);
	let sliderDisabled = $state(false);
	let dropdownReady = $state(false);
	$effect(() => {
		dropdownReady = true;
	});

	let animBtnVariant = $state<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
	let animBtnSize = $state<'sm' | 'md' | 'lg'>('md');
	let animBtnAnimated = $state(true);
	let animBtnDisabled = $state(false);

	let animCardPadding = $state<'none' | 'sm' | 'md' | 'lg'>('md');
	let animCardInteractive = $state(true);

	let revealDelay = $state(0.08);

	let presenceOpen = $state(true);

	let magneticStrength = $state(0.16);
	let magneticMaxOffset = $state(12);
	let magneticDisabled = $state(false);

	let textLoopInterval = $state(2200);

	let marqueeSpeed = $state(18);
	let marqueeDirection = $state<'left' | 'right'>('left');

	let carouselIndex = $state(0);
	const carouselItems = [
		{ id: 'tokens', title: 'Start with tokens', description: 'Choose the colors, typography, and radius that fit your product.' },
		{ id: 'components', title: 'Compose primitives', description: 'Use accessible building blocks without inheriting a rigid brand.' },
		{ id: 'motion', title: 'Add considered motion', description: 'Keep every effect purposeful, subtle, and easy to disable.' }
	];

	let stepperCurrent = $state(1);
	let stepperInteractive = $state(true);
	const stepperSteps = [
		{ id: 'plan', title: 'Plan', description: 'Set component contracts' },
		{ id: 'build', title: 'Build', description: 'Compose the interface' },
		{ id: 'ship', title: 'Ship', description: 'Verify before release' }
	];

	let counterValue = $state(12800);
	let counterDuration = $state(850);

	const tabs = [
		{ id: 'overview', label: 'Overview', content: 'A concise overview of your project architecture.' },
		{ id: 'activity', label: 'Activity', content: 'Nothing new since your last visit.' }
	];
	const motionItems = [
		{ id: 'tokens', title: 'Configure tokens', description: 'Foundation complete' },
		{ id: 'components', title: 'Compose components', description: '18 base primitives ready' },
		{ id: 'ship', title: 'Ship with confidence', description: 'Checked and built' }
	];
	const brandTokens = { '--theme-color': '#0f766e', '--theme-color-alt': '#115e59', '--radius-6': '1.5rem' };

	function resetKnobs() {
		btnVariant = 'primary';
		btnSize = 'md';
		btnShape = 'default';
		btnDisabled = false;
		btnLoading = false;
		btnLabel = 'Save changes';
		badgeVariant = 'accent';
		badgeText = 'Featured';
		alertVariant = 'info';
		alertTitle = 'A thoughtful default';
		avatarSize = 'md';
		cardPadding = 'md';
		accordionOpen = true;
		inputDisabled = false;
		inputValue = '';
		checkboxChecked = true;
		switchChecked = true;
		selectValue = 'team';
		dialogOpen = false;
		toastOpen = true;
		toastVariant = 'success';
		animBtnVariant = 'primary';
		animBtnSize = 'md';
		animBtnAnimated = true;
		magneticDisabled = false;
		stepperCurrent = 1;
		carouselIndex = 0;
	}

	const generatedCode = $derived.by(() => {
		switch (slug) {
			case 'button': {
				const isIcon = btnSize.startsWith('icon');
				const iconImports = isIcon ? "\n\timport { Icon } from 'fractalicons';\n\timport { luBell } from 'fractalicons/lucide';" : '';
				const shapeAttr = btnShape === 'pill' ? '\n\tshape="pill"' : '';
				const stateAttrs = `${btnLoading ? '\n\tloading' : ''}${btnDisabled ? '\n\tdisabled' : ''}`;
				const labelAttr = isIcon ? `aria-label="${btnLabel}"` : `onclick={() => alert('Clicked')}`;
				const body = isIcon ? '<Icon icon={luBell} />' : btnLabel;
				return `<script>\n\timport { Button } from 'fractalsvelte/components';${iconImports}\n<\/script>\n\n<Button\n\tvariant="${btnVariant}"\n\tsize="${btnSize}"${shapeAttr}${stateAttrs}\n\t${labelAttr}\n>\n\t${body}\n</Button>`;
			}
			case 'badge':
				return `<script>\n\timport { Badge } from 'fractalsvelte/components';\n<\/script>\n\n<Badge variant="${badgeVariant}">\n\t${badgeText}\n</Badge>`;
			case 'alert':
				return `<script>\n\timport { Alert } from 'fractalsvelte/components';\n<\/script>\n\n<Alert title="${alertTitle}" variant="${alertVariant}">\n\t${alertContent}\n</Alert>`;
			case 'avatar':
				return `<script>\n\timport { Avatar } from 'fractalsvelte/components';\n<\/script>\n\n<Avatar\n\tname="${avatarName}"\n\tsize="${avatarSize}"${avatarSrc ? `\n\tsrc="${avatarSrc}"` : ''}\n/>`;
			case 'card':
				return `<script>\n\timport { Card } from 'fractalsvelte/components';\n<\/script>\n\n<Card padding="${cardPadding}">\n\t<strong>Design decision</strong>\n\t<p>Use a Card to group content without imposing visual noise.</p>\n</Card>`;
			case 'accordion':
				return `<script>\n\timport { Accordion } from 'fractalsvelte/components';\n\tlet open = $state(${accordionOpen});\n<\/script>\n\n<Accordion title="${accordionTitle}" bind:open>\n\tIt uses the native details element, so disclosure and keyboard support come built in.\n</Accordion>`;
			case 'tabs':
				return `<script>\n\timport { Tabs } from 'fractalsvelte/components';\n\tconst tabs = [\n\t\t{ id: 'overview', label: 'Overview', content: 'A concise overview.' },\n\t\t{ id: 'activity', label: 'Activity', content: 'Recent activity.' }\n\t];\n<\/script>\n\n<Tabs {tabs} />`;
			case 'input':
				return `<script>\n\timport { Input } from 'fractalsvelte/components';\n\tlet value = $state('${inputValue}');\n<\/script>\n\n<Input\n\ttype="${inputType}"\n\tplaceholder="${inputPlaceholder}"${inputDisabled ? '\n\tdisabled' : ''}\n\tbind:value\n/>`;
			case 'textarea':
				return `<script>\n\timport { Textarea } from 'fractalsvelte/components';\n\tlet value = $state('${textareaValue}');\n<\/script>\n\n<Textarea\n\trows={${textareaRows}}\n\tplaceholder="${textareaPlaceholder}"${textareaDisabled ? '\n\tdisabled' : ''}\n\tbind:value\n/>`;
			case 'checkbox':
				return `<script>\n\timport { Checkbox } from 'fractalsvelte/components';\n\tlet checked = $state(${checkboxChecked});\n<\/script>\n\n<Checkbox\n\tlabel="${checkboxLabel}"${checkboxDisabled ? '\n\tdisabled' : ''}\n\tbind:checked\n/>`;
			case 'switch':
				return `<script>\n\timport { Switch } from 'fractalsvelte/components';\n\tlet checked = $state(${switchChecked});\n<\/script>\n\n<Switch\n\tlabel="${switchLabel}"${switchDisabled ? '\n\tdisabled' : ''}\n\tbind:checked\n/>`;
			case 'select':
				return `<script>\n\timport { Select } from 'fractalsvelte/components';\n\tlet value = $state('${selectValue}');\n\tconst options = [\n\t\t{ label: 'Starter', value: 'starter' },\n\t\t{ label: 'Team', value: 'team' },\n\t\t{ label: 'Enterprise', value: 'enterprise' }\n\t];\n<\/script>\n\n<Select\n\t{options}\n\tplaceholder="${selectPlaceholder}"${selectDisabled ? '\n\tdisabled' : ''}\n\tbind:value\n/>`;
			case 'dialog':
				return `<script>\n\timport { Button, Dialog } from 'fractalsvelte/components';\n\tlet open = $state(false);\n<\/script>\n\n<Button onclick={() => open = true}>Open dialog</Button>\n\n<Dialog\n\tbind:open\n\ttitle="${dialogTitle}"\n\tdescription="${dialogDescription}"\n>\n\t<p>Choose their project role before continuing.</p>\n</Dialog>`;
			case 'tooltip':
				return `<script>\n\timport { Button, Tooltip } from 'fractalsvelte/components';\n<\/script>\n\n<Tooltip content="${tooltipContent}" position="${tooltipPosition}">\n\t<Button size="sm" variant="secondary">Hover me</Button>\n</Tooltip>`;
			case 'progress':
				return `<script>\n\timport { Progress } from 'fractalsvelte/components';\n<\/script>\n\n<Progress value={${progressValue}} max={${progressMax}} label="${progressLabel}" />`;
			case 'skeleton':
				return `<script>\n\timport { Skeleton } from 'fractalsvelte/components';\n<\/script>\n\n<Skeleton width="${skeletonWidth}" height="${skeletonHeight}"${skeletonCircle ? ' circle' : ''} />`;
			case 'toast':
				return `<script>\n\timport { Toast } from 'fractalsvelte/components';\n\tlet open = $state(${toastOpen});\n<\/script>\n\n<Toast bind:open title="${toastTitle}" variant="${toastVariant}">\n\tYour project configuration is up to date.\n</Toast>`;
			case 'separator':
				return `<script>\n\timport { Separator } from 'fractalsvelte/components';\n<\/script>\n\n<Separator orientation="${separatorOrientation}" />`;
			case 'animated-button':
				return `<script>\n\timport { AnimatedButton } from 'fractalsvelte/components';\n<\/script>\n\n<AnimatedButton\n\tvariant="${animBtnVariant}"\n\tsize="${animBtnSize}"\n\tanimated={${animBtnAnimated}}${animBtnDisabled ? '\n\tdisabled' : ''}\n>\n\tHover and press\n</AnimatedButton>`;
			case 'animated-card':
				return `<script>\n\timport { AnimatedCard } from 'fractalsvelte/components';\n<\/script>\n\n<AnimatedCard padding="${animCardPadding}" interactive={${animCardInteractive}}>\n\t<strong>Project plan</strong>\n\t<p>Lifts gently on hover and settles on press.</p>\n</AnimatedCard>`;
			case 'magnetic':
				return `<script>\n\timport { Button, Magnetic } from 'fractalsvelte/components';\n<\/script>\n\n<Magnetic strength={${magneticStrength}} maxOffset={${magneticMaxOffset}}${magneticDisabled ? ' disabled' : ''}>\n\t<Button>Magnetic action</Button>\n</Magnetic>`;
			case 'carousel':
				return `<script>\n\timport { Carousel } from 'fractalsvelte/components';\n\tlet index = $state(0);\n<\/script>\n\n<Carousel {items} bind:index />`;
			case 'stepper':
				return `<script>\n\timport { Stepper } from 'fractalsvelte/components';\n\tlet current = $state(${stepperCurrent});\n<\/script>\n\n<Stepper {steps} bind:current interactive={${stepperInteractive}} />`;
			case 'counter':
				return `<script>\n\timport { Counter } from 'fractalsvelte/components';\n<\/script>\n\n<Counter value={${counterValue}} duration={${counterDuration}} locale="en-US" />`;
			case 'card-3d':
				return `<script>\n\timport { Card3D } from 'fractalsvelte/components';\n<\/script>\n\n<Card3D maxTilt={${card3dMaxTilt}} glare={${card3dGlare}} perspective={${card3dPerspective}} scale={${card3dScale}}>\n\t<h3>Interactive 3D Surface</h3>\n\t<p>Move your pointer across this card to experience real-time parallax tilt and specular glare.</p>\n</Card3D>`;
			case 'macos-dock':
				return `<script>\n\timport { MacosDock } from 'fractalsvelte/components';\n\tconst items = [\n\t\t{ id: 'finder', label: 'Finder', icon: '📁' },\n\t\t{ id: 'browser', label: 'Browser', icon: '🌐' },\n\t\t{ id: 'terminal', label: 'Terminal', icon: '💻' },\n\t\t{ id: 'editor', label: 'Editor', icon: '⚡' },\n\t\t{ id: 'settings', label: 'Settings', icon: '⚙️' }\n\t];\n<\/script>\n\n<MacosDock {items} magnification={${macosDockMagnification}} distance={${macosDockDistance}} />`;
			case 'card-stack':
				return `<script>\n\timport { CardStack } from 'fractalsvelte/components';\n\tconst items = [\n\t\t{ id: '1', title: 'Design System', description: 'Composable Sass-first design contracts' },\n\t\t{ id: '2', title: 'Theming Engine', description: 'Real-time custom accent and GPU auras' },\n\t\t{ id: '3', title: 'Svelte 5 Primitives', description: 'Fully accessible UI building blocks' }\n\t];\n<\/script>\n\n<CardStack {items} maxVisible={${cardStackMaxVisible}} onswipe={(item, dir) => console.log(item, dir)} />`;
			case 'text-scramble':
				return `<script>\n\timport { TextScramble } from 'fractalsvelte/components';\n<\/script>\n\n<TextScramble text="${textScrambleText}" trigger="${textScrambleTrigger}" speed={${textScrambleSpeed}} />`;
			default:
				return `<script>\n\timport { ${slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')} } from 'fractalsvelte/components';\n<\/script>\n\n<${slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')} />`;
		}
	});

	function copySnippet() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(generatedCode);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	let highlightedCode = $state<string>('');

	$effect(() => {
		let active = true;
		highlight(generatedCode, 'svelte').then((res) => {
			if (active) highlightedCode = res;
		});
		return () => {
			active = false;
		};
	});
</script>

<div class="box gap-md">
	<!-- Stage Control Bar -->
	<div class="row wrap gap-bs">
		<div class="row wrap gap-sm ycenter">
			<span class="text-xs weight-600 text-muted mr-xs">Viewport:</span>
			<button
				type="button"
				class="small"
				data-shape="modern"
				data-variant={viewportWidth === '100%' ? 'active' : undefined}
				onclick={() => (viewportWidth = '100%')}
				title="Desktop viewport (100%)"
			>
				Desktop
			</button>
			<button
				type="button"
				class="small"
				data-shape="modern"
				data-variant={viewportWidth === '768px' ? 'active' : undefined}
				onclick={() => (viewportWidth = '768px')}
				title="Tablet viewport (768px)"
			>
				Tablet
			</button>
			<button
				type="button"
				class="small"
				data-shape="modern"
				data-variant={viewportWidth === '375px' ? 'active' : undefined}
				onclick={() => (viewportWidth = '375px')}
				title="Mobile viewport (375px)"
			>
				Mobile
			</button>
		</div>

		<div class="row wrap gap-sm ycenter">
			<span class="text-xs weight-600 text-muted mr-xs">Canvas:</span>
			<button
				type="button"
				class="small"
				data-shape="modern"
				data-variant={bgMode === 'surface' ? 'active' : undefined}
				onclick={() => (bgMode = 'surface')}
				title="Default surface background"
			>
				Surface
			</button>
			<button
				type="button"
				class="small"
				data-shape="modern"
				data-variant={bgMode === 'grid' ? 'active' : undefined}
				onclick={() => (bgMode = 'grid')}
				title="Subtle grid background"
			>
				Grid
			</button>
			<button
				type="button"
				class="small"
				data-shape="modern"
				data-variant={bgMode === 'checker' ? 'active' : undefined}
				onclick={() => (bgMode = 'checker')}
				title="Transparency checkerboard"
			>
				Checker
			</button>
			<button
				type="button"
				class="small"
				data-shape="modern"
				onclick={resetKnobs}
				title="Reset knobs to defaults"
			>
				Reset
			</button>
		</div>
	</div>

	<!-- Stage Canvas -->
		<div
			class="playground-stage"
			data-bg={bgMode}
			style="max-width: {viewportWidth};"
		>
			<div style="width: 100%; display: grid; place-items: center;">
				{#if slug === 'button'}
					{#if btnSize.startsWith('icon')}
						<Button variant={btnVariant} size={btnSize} shape={btnShape} disabled={btnDisabled} loading={btnLoading} aria-label={btnLabel}>
							<Icon icon={luBell} />
						</Button>
					{:else}
						<Button variant={btnVariant} size={btnSize} shape={btnShape} disabled={btnDisabled} loading={btnLoading}>
							{btnLabel}
						</Button>
					{/if}
				{:else if slug === 'badge'}
					<Badge variant={badgeVariant}>
						{badgeText}
					</Badge>
				{:else if slug === 'alert'}
					<Alert title={alertTitle} variant={alertVariant}>
						{alertContent}
					</Alert>
				{:else if slug === 'avatar'}
					<Avatar name={avatarName} size={avatarSize} src={avatarSrc || undefined} />
				{:else if slug === 'card'}
					<Card padding={cardPadding}>
						<strong>Design decision</strong>
						<p class="preview-copy">Use a Card to group content, not to create every visual boundary.</p>
					</Card>
				{:else if slug === 'accordion'}
					<Accordion title={accordionTitle} bind:open={accordionOpen}>
						It uses the native details element, so disclosure and keyboard support come built in.
					</Accordion>
				{:else if slug === 'tabs'}
					<Tabs {tabs} />
				{:else if slug === 'input'}
					<Input type={inputType} placeholder={inputPlaceholder} disabled={inputDisabled} bind:value={inputValue} ariaLabel="Input demo" />
				{:else if slug === 'textarea'}
					<Textarea rows={textareaRows} placeholder={textareaPlaceholder} disabled={textareaDisabled} bind:value={textareaValue} ariaLabel="Textarea demo" />
				{:else if slug === 'checkbox'}
					<Checkbox label={checkboxLabel} disabled={checkboxDisabled} bind:checked={checkboxChecked} />
				{:else if slug === 'switch'}
					<Switch label={switchLabel} disabled={switchDisabled} bind:checked={switchChecked} />
				{:else if slug === 'select'}
					<Select options={selectOptions} disabled={selectDisabled} placeholder={selectPlaceholder} bind:value={selectValue} />
				{:else if slug === 'dialog'}
					<div class="row gap-s ycenter">
						<Button onclick={() => (dialogOpen = true)}>Open dialog</Button>
						<Dialog bind:open={dialogOpen} title={dialogTitle} description={dialogDescription}>
							<p class="preview-copy">Choose their project role before you continue.</p>
						</Dialog>
					</div>
				{:else if slug === 'tooltip'}
					<Tooltip content={tooltipContent} position={tooltipPosition}>
						<Button size="sm" variant="secondary">Hover me</Button>
					</Tooltip>
				{:else if slug === 'progress'}
					<Progress value={progressValue} max={progressMax} label={progressLabel} />
				{:else if slug === 'skeleton'}
					<div class="skeleton-stack" style="width: 100%; max-width: 320px;">
						<Skeleton width={skeletonCircle ? '3.5rem' : skeletonWidth} height={skeletonCircle ? '3.5rem' : skeletonHeight} circle={skeletonCircle} />
					</div>
				{:else if slug === 'toast'}
					<div class="stack gap-s ycenter">
						<Button size="sm" variant="secondary" onclick={() => (toastOpen = !toastOpen)}>
							{toastOpen ? 'Dismiss toast' : 'Trigger toast'}
						</Button>
						<Toast bind:open={toastOpen} title={toastTitle} variant={toastVariant}>
							Your project configuration is up to date.
						</Toast>
					</div>
			{:else if slug === 'separator'}
				<div class="separator-sample row ycenter gap-m" style="width: 100%; max-width: 320px;">
					<span>Account</span>
					<Separator orientation={separatorOrientation} />
					<span>Billing</span>
				</div>
			{:else if slug === 'dropdown-menu'}
				{#if dropdownReady}
					<DropdownMenu
						items={[
							{ label: 'Duplicate', shortcut: '⌘D', onSelect: () => {} },
							{ label: 'Rename', shortcut: '⌘R', onSelect: () => {} },
							{ label: 'Move to…', onSelect: () => {} },
							{ label: 'Archive', disabled: true },
							{ label: 'Delete', danger: true, onSelect: () => {} }
						]}
						label="Actions"
					/>
				{/if}
			{:else if slug === 'slider'}
				<div style="width: 100%; max-width: 420px;">
					<Slider label="Volume" value={sliderValue} onValueChange={(v) => (sliderValue = v)} showValue disabled={sliderDisabled} />
				</div>
			{:else if slug === 'animated-button'}
				<AnimatedButton variant={animBtnVariant} size={animBtnSize} animated={animBtnAnimated} disabled={animBtnDisabled}>
					Hover and press
				</AnimatedButton>
			{:else if slug === 'animated-card'}
				<AnimatedCard padding={animCardPadding} interactive={animCardInteractive}>
					<strong>Project plan</strong>
					<p class="preview-copy">This surface lifts gently on hover and settles on press.</p>
				</AnimatedCard>
				{:else if slug === 'reveal'}
					<Reveal delay={revealDelay}>
						<div class="motion-reveal-sample">
							<span class="eyebrow">Viewport motion</span>
							<strong>Content enters with quiet intent.</strong>
							<span>Scroll this sample into view to replay the reveal.</span>
						</div>
					</Reveal>
				{:else if slug === 'motion-list'}
					<MotionList items={motionItems} label="Build progress" />
				{:else if slug === 'presence'}
					<div class="presence-sample stack gap-s ycenter">
						<Button size="sm" variant="secondary" onclick={() => (presenceOpen = !presenceOpen)}>
							{presenceOpen ? 'Hide message' : 'Show message'}
						</Button>
						<Presence present={presenceOpen}>
							<Alert title="Changes saved" variant="success">The exit completes before this message is removed.</Alert>
						</Presence>
					</div>
				{:else if slug === 'theme'}
					<Theme theme="light" tokens={brandTokens}>
						<Card>
							<div class="theme-sample stack gap-xs">
								<Badge variant="accent">Custom tokens</Badge>
								<strong>Your brand, your radius, your accent.</strong>
								<Button>Branded action</Button>
							</div>
						</Card>
					</Theme>
				{:else if slug === 'theme-setter' || slug === 'theme-picker'}
					<ThemeSetter bind:open={themeSetterOpen}>
						<div class="card pad-m stack gap-s" style="width: 100%; max-width: 480px;">
							<p class="text-sm text-muted">Explore the modern <strong>fractalthemer</strong> theme and background engine:</p>
							<Button onclick={() => (themeSetterOpen = true)}>Open appearance</Button>
						</div>
					</ThemeSetter>
				{:else if slug === 'bits-effect'}
					<BitsEffect pattern="animated-content" category="animation" label="Bits effect preview" />
				{:else if slug === 'magnetic'}
					<Magnetic strength={magneticStrength} maxOffset={magneticMaxOffset} disabled={magneticDisabled}>
						<Button>Move your pointer here</Button>
					</Magnetic>
				{:else if slug === 'text-loop'}
					<p class="text-loop-sample">
						Make interfaces <TextLoop texts={['expressive', 'calm', 'memorable']} interval={textLoopInterval} />.
					</p>
				{:else if slug === 'marquee'}
					<Marquee items={['Svelte 5', 'Sass', 'Accessible', 'Themeable']} speed={marqueeSpeed} direction={marqueeDirection} />
				{:else if slug === 'carousel'}
					<Carousel items={carouselItems} bind:index={carouselIndex} />
				{:else if slug === 'stepper'}
					<Stepper steps={stepperSteps} bind:current={stepperCurrent} interactive={stepperInteractive} />
				{:else if slug === 'counter'}
					<div class="counter-sample row ycenter gap-xs">
						<Counter value={counterValue} duration={counterDuration} locale="en-US" />
						<span>projects configured</span>
					</div>
				{:else if slug === 'card-3d'}
					<Card3D maxTilt={card3dMaxTilt} glare={card3dGlare} perspective={card3dPerspective} scale={card3dScale}>
						<div class="stack gap-xs">
							<Badge variant="accent">3D Perspective</Badge>
							<strong class="text-lg">Interactive Tilt Surface</strong>
							<p class="text-sm text-muted">Move pointer across this card to experience real-time 3D parallax tilt and specular glare.</p>
						</div>
					</Card3D>
				{:else if slug === 'macos-dock'}
					<div class="pad-m row center">
						<MacosDock magnification={macosDockMagnification} distance={macosDockDistance} />
					</div>
				{:else if slug === 'card-stack'}
					<div class="pad-m row center">
						<CardStack maxVisible={cardStackMaxVisible} />
					</div>
				{:else if slug === 'context-menu'}
					<ContextMenu>
						<ContextMenuTrigger>
							<div class="card pad-m row center" style="min-width: 280px; min-height: 120px; border-style: dashed;">
								<span class="text-muted">Right-click this card</span>
							</div>
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuLabel>Canvas</ContextMenuLabel>
							<ContextMenuItem onSelect={() => {}}>Rename<ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
							<ContextMenuCheckboxItem checked={cmSnap} onCheckedChange={(v) => (cmSnap = v)}>Snap to grid</ContextMenuCheckboxItem>
							<ContextMenuSeparator />
							<ContextMenuItem tone="destructive" onSelect={() => {}}>Delete</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				{:else if slug === 'text-scramble'}
					<div class="pad-l row center">
						<span class="text-2xl weight-700">
							<TextScramble text={textScrambleText} trigger={textScrambleTrigger} speed={textScrambleSpeed} />
						</span>
					</div>
				{:else if slug === 'app-shell'}
					<div style="width: 100%; max-width: 560px;">
						<AppShell>
							{#snippet header()}
								<div class="row ycenter xbetween pad-s"><strong>Aurora</strong><span class="text-sm opacity-60">Workspace</span></div>
							{/snippet}
							{#if shellSidebar}
								{#snippet sidebar()}
									<nav class="stack gap-2xs pad-s text-sm"><a href="/introduction">Dashboard</a><a href="/introduction">Reports</a><a href="/introduction">Settings</a></nav>
								{/snippet}
							{/if}
							<div class="pad-s preview-copy">Main content area — the shell reserves header, rail, and footer space so pages stay aligned.</div>
							{#if shellFooter}
								{#snippet footer()}
									<div class="pad-2xs text-sm opacity-60">© Aurora</div>
								{/snippet}
							{/if}
						</AppShell>
					</div>
				{:else if slug === 'aspect-ratio'}
					<div style="width: 100%; max-width: 380px;">
						<AspectRatio ratio={aspectRatio}>
							<img src="/images/logomotif.png" alt="Fractal motif" style="width: 100%; height: 100%; object-fit: cover;" />
						</AspectRatio>
					</div>
				{:else if slug === 'banner'}
					<div style="width: 100%; max-width: 460px;">
						<Banner variant={bannerVariant} title="Storage almost full" dismissible={bannerDismissible}>
							You are using 92% of your workspace storage. Upgrade to keep version history.
						</Banner>
					</div>
				{:else if slug === 'blockquote'}
					<Blockquote cite="Ada Lovelace">
						The analytical engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves.
					</Blockquote>
				{:else if slug === 'breadcrumbs'}
					<Breadcrumbs crumbs={demoCrumbs.slice(0, Math.max(2, Math.min(3, crumbsDepth)))} />
				{:else if slug === 'button-group'}
					<ButtonGroup orientation={groupOrientation}>
						<Button variant="secondary" size="sm">Day</Button>
						<Button variant="secondary" size="sm">Week</Button>
						<Button variant="secondary" size="sm">Month</Button>
						<Button variant="secondary" size="sm" aria-label="Add view"><Icon icon={luPlus} /></Button>
					</ButtonGroup>
				{:else if slug === 'calendar'}
					<Calendar defaultValue="2026-07-14" defaultMonth={calendarMonth} ariaLabel="Demo calendar" />
				{:else if slug === 'clickable-card'}
					<div style="width: 100%; max-width: 340px;">
						<ClickableCard href="/introduction" title="Aurora design system" description="Tokens, components, and usage guidance for the Aurora product surface.">
							<span class="text-sm opacity-60">Updated 2 days ago</span>
						</ClickableCard>
					</div>
				{:else if slug === 'collapsible'}
					<div style="width: 100%; max-width: 380px;">
						<Collapsible>
							<p class="preview-copy">Content inside collapses with an animated height transition and stays keyboard accessible.</p>
						</Collapsible>
					</div>
				{:else if slug === 'form-layout'}
					<div style="width: 100%; max-width: 460px;">
						<FormLayout cols={formCols}>
							<Input placeholder="First name" ariaLabel="First name" />
							<Input placeholder="Last name" ariaLabel="Last name" />
							<Input type="email" placeholder="Email" ariaLabel="Email" />
							<Input placeholder="Role" ariaLabel="Role" />
						</FormLayout>
					</div>
				{:else if slug === 'kbd'}
					<div class="row ycenter gap-s">
						{#each kbdKeys.split(' ') as key (key)}<Kbd>{key}</Kbd>{/each}
					</div>
				{:else if slug === 'resize-handle'}
					<div class="row" style="width: 100%; max-width: 480px; height: 160px;">
						<ResizeHandle value={38}>
							{#snippet left()}<div class="pad-s preview-copy">Navigation</div>{/snippet}
							{#snippet right()}<div class="pad-s preview-copy">Content</div>{/snippet}
						</ResizeHandle>
					</div>
				{:else if slug === 'table'}
					<div style="width: 100%; max-width: 520px;">
						<Table columns={demoColumns} rows={demoRows.slice(0, Math.max(2, Math.min(5, tableRows)))} rowKey={(row) => row.id} selectable defaultSelected={['2']} />
					</div>
				{:else if slug === 'thumbnail'}
					<Thumbnail src="/images/logomotif.png" alt="Fractal motif" fallback="FM" shape={thumbShape} width="96px" height="96px" />
				{:else if slug === 'check-indicator'}
					<div class="row ycenter gap-m">
						<CheckIndicator state={checkState} />
						<CheckIndicator state={checkState} disabled />
						<span class="text-sm opacity-60">{checkState}</span>
					</div>
				{:else if slug === 'date-picker'}
					<DatePicker defaultValue="2026-09-14" ariaLabel="Demo date picker" />
				{:else if slug === 'color-picker'}
					<ColorPicker defaultValue={pickerValue} swatches={pickerSwatches ? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] : []} ariaLabel="Demo color picker" />
				{:else if slug === 'combobox'}
					<div style="width: 100%; max-width: 300px;">
						<Combobox options={demoComboOptions} defaultValue="" placeholder="Choose a framework…" searchable={comboSearchable} ariaLabel="Demo combobox" />
					</div>
				{:else if slug === 'command-palette'}
					<div class="stack gap-s ycenter">
						<Button size="sm" variant="secondary" onclick={() => (paletteOpen = true)}>Open command palette</Button>
						<CommandPalette bind:open={paletteOpen} items={demoCommandItems} placeholder="Type a command…" />
					</div>
				{:else if slug === 'complex-selector'}
					<div style="width: 100%; max-width: 340px;">
						<ComplexSelector selected={selectableState} onSelectedChange={(v) => (selectableState = v)} title="Aurora Pro" description="Unlimited projects, priority support, and SSO.">
							<span class="text-sm opacity-60">$24 per member / month</span>
						</ComplexSelector>
					</div>
				{:else if slug === 'file-input'}
					<div style="width: 100%; max-width: 380px;">
						<FileInput multiple={fileMultiple} label="Drop files here or click to browse" hint={fileMultiple ? 'Up to 5 files, 10 MB each' : 'Any file type, up to 10 MB'} />
					</div>
				{:else if slug === 'icon-button'}
					<IconButton label={iconBtnLabel}><Icon icon={luBell} /></IconButton>
				{:else if slug === 'multi-selector'}
					<div style="width: 100%; max-width: 340px;">
						<MultiSelector options={demoPeople} values={['maya']} label="Assign to" />
					</div>
				{:else if slug === 'radio-indicator'}
					<div class="row ycenter gap-m">
						<RadioIndicator state="checked" />
						<RadioIndicator state="unchecked" />
						<RadioIndicator state="unchecked" disabled />
					</div>
				{:else if slug === 'radio-list'}
					<div style="width: 100%; max-width: 320px;">
						<RadioList options={demoToggles} value="bold" label="Text style" />
					</div>
				{:else if slug === 'rating'}
					<Rating defaultValue={ratingValue} max={ratingMax} ariaLabel="Demo rating" />
				{:else if slug === 'segmented-control'}
					<SegmentedControl options={demoToggles} value="bold" label="Text style" />
				{:else if slug === 'selectable-card'}
					<div style="width: 100%; max-width: 340px;">
						<SelectableCard selected={selectableState} onSelectedChange={(v) => (selectableState = v)} title="Starter" description="Up to 3 projects and community support.">
							<span class="text-sm opacity-60">Free forever</span>
						</SelectableCard>
					</div>
				{:else if slug === 'selector'}
					<div style="width: 100%; max-width: 340px;">
						<Selector options={demoPeople} value="maya" label="Assign to" />
					</div>
				{:else if slug === 'time-picker'}
					<TimePicker defaultValue="09:30" step={pickerStep} hour12={pickerHour12} ariaLabel="Demo time picker" />
				{:else if slug === 'toggle-button'}					<ToggleButton pressed>
						<span class="row ycenter gap-2xs"><Icon icon={luBold} size={14} /> Bold</span>
					</ToggleButton>
				{:else if slug === 'toggle-button-group'}
					<ToggleButtonGroup options={demoToggles} value="bold" label="Text style" />
				{:else if slug === 'toolbar'}
					<Toolbar>
						<ToolbarGroup label="Format">
							<ToggleButtonGroup options={demoToggles} value="bold" label="Text style" />
						</ToolbarGroup>
						<ToolbarGroup label="Insert">
							<IconButton label="Insert link"><Icon icon={luLink} /></IconButton>
							<IconButton label="Insert image"><Icon icon={luImage} /></IconButton>
						</ToolbarGroup>
					</Toolbar>
				{:else if slug === 'toolbar-group'}
					<ToolbarGroup label="Format">
						<IconButton label="Bold"><Icon icon={luBold} /></IconButton>
						<IconButton label="Italic"><Icon icon={luItalic} /></IconButton>
						<IconButton label="Underline"><Icon icon={luLink} /></IconButton>
					</ToolbarGroup>
				{:else if slug === 'confetti'}
					<div class="stack gap-s ycenter" style="min-height: 180px;">
						<Button variant="secondary" onclick={() => confettiApi?.fire()}>Celebrate</Button>
						<Confetti bind:this={confettiApi} />
					</div>
				{:else if slug === 'cookie-consent'}
					<CookieConsent storageKey={`demo-cookie-${demoNonce}`} onDecision={() => {}} />
				{:else if slug === 'countdown'}
					<Countdown seconds={countdownSeconds} showDays={countdownShowDays} running />
				{:else if slug === 'drawer'}
					<div class="stack gap-s ycenter">
						<Button size="sm" variant="secondary" onclick={() => (drawerOpen = true)}>Open drawer</Button>
						{#if drawerOpen}
							<Drawer open={drawerOpen} onOpenChange={(v) => (drawerOpen = v)} side={drawerSide} ariaLabel="Demo drawer">
								<div class="stack gap-s pad-m" style="min-width: 260px;">
									<strong>Drawer</strong>
									<p class="preview-copy">Slide-over panel for filters, details, or compose surfaces.</p>
								</div>
							</Drawer>
						{/if}
					</div>
				{:else if slug === 'empty'}
					<Empty title="No projects yet" description="Create your first project to see it here.">
						{#snippet action()}<Button size="sm">New project</Button>{/snippet}
					</Empty>
				{:else if slug === 'lightbox'}
					<div class="stack gap-s ycenter">
						<Button size="sm" variant="secondary" onclick={() => (lightboxOpen = true)}>Open lightbox</Button>
						{#if lightboxOpen}
							<Lightbox open={lightboxOpen} onOpenChange={(v) => (lightboxOpen = v)} images={demoLightboxImages} bind:index={lightboxIndex} />
						{/if}
						<div class="row gap-2xs">
							{#each demoLightboxImages as img, i (img.src)}
								<button type="button" class="thumb-btn" onclick={() => (lightboxIndex = i, lightboxOpen = true)} aria-label="Open image {i + 1}"><img src={img.src} alt={img.alt ?? ''} /></button>
							{/each}
						</div>
					</div>
				{:else if slug === 'menubar'}
					<Menubar menus={demoMenubarMenus} />
				{:else if slug === 'more-menu'}
					<MoreMenu items={demoMenuItems} label="Row actions" />
				{:else if slug === 'overlay'}
					<div class="stack gap-s ycenter">
						<Button size="sm" variant="secondary" onclick={() => (overlayOpen = true)}>Show overlay</Button>
						{#if overlayOpen}
							<Overlay open={overlayOpen} onOpenChange={(v) => (overlayOpen = v)} modal={overlayModal} label="Demo overlay">
								<div class="card pad-m" style="max-width: 320px;"><strong>Overlay panel</strong><p class="preview-copy">{overlayModal ? 'Modal mode blocks page interaction until dismissed.' : 'Non-modal mode lets the page stay interactive.'}</p></div>
							</Overlay>
						{/if}
					</div>
				{:else if slug === 'outline'}
					<div style="width: 100%; max-width: 280px;">
						<Outline items={outlineLevels ? demoOutline : demoOutline.filter((i) => i.level === 2)} />
					</div>
				{:else if slug === 'pagination'}
					<Pagination bind:page={paginationPage} total={paginationTotal} siblings={1} />
				{:else if slug === 'popover'}
					<div class="row ycenter gap-s">
						<Popover placement={popoverPlacement}>
							{#snippet label()}Pop{/snippet}
							<p class="preview-copy">Anchored, non-blocking detail surface.</p>
						</Popover>
						<Button size="sm" variant="secondary" onclick={() => (popoverOpen = !popoverOpen)}>{popoverOpen ? 'Hide' : 'Show'} controlled</Button>
						{#if popoverOpen}<div class="card pad-s text-sm">Controlled open state</div>{/if}
					</div>
				{:else if slug === 'hover-card'}
					<HoverCard placement="bottom" text="Hover cards preview richer content without leaving the page.">
						<Button size="sm" variant="secondary">Hover me</Button>
					</HoverCard>
				{:else if slug === 'toast-item'}
					<ToastItem variant="success" title="Changes saved" description="Your workspace is up to date." duration={0} />
				{:else if slug === 'toast-viewport'}
					<div class="toast-viewport-stage">
						<ToastViewport toasts={demoToastData(toastCount)} onDismiss={() => {}} position={toastPos} />
					</div>
				{:else if slug === 'mobile-nav'}
					<div class="stack gap-s ycenter">
						<MobileNavToggle bind:open={mobileNavOpen} />
						{#if mobileNavOpen}
							<MobileNav open={mobileNavOpen} onOpenChange={(v) => (mobileNavOpen = v)} items={demoTopNavItems} />
						{/if}
					</div>
				{:else if slug === 'mobile-nav-toggle'}
					<MobileNavToggle bind:open={mobileNavOpen} />
				{:else if slug === 'side-nav'}
					<div class="side-nav-stage">
						<SideNav groups={demoSideNavGroups} activeValue={navActive} />
					</div>
				{:else if slug === 'tab-list'}
					<TabList tabs={demoToggles} value="bold" label="Text style tabs" />
				{:else if slug === 'top-nav'}
					<div class="top-nav-stage">
						<TopNav items={demoTopNavItems} />
					</div>
				{:else if slug === 'top-nav-menu'}
					<TopNavMenu label="Resources" items={demoMenuItems} />
				{:else if slug === 'top-nav-mega-menu'}
					<TopNavMegaMenu label="Product" columns={demoMegaColumns}>
						<TopNavMegaMenuFeaturedCard eyebrow="New" title="Aurora 3.0" description="Theming, motion, and accessibility in one kit." href="/introduction" cta="See what's new" />
					</TopNavMegaMenu>
				{:else if slug === 'top-nav-mega-menu-featured-card'}
					<div style="width: 100%; max-width: 300px;">
						<TopNavMegaMenuFeaturedCard eyebrow="New" title="Aurora 3.0" description="Theming, motion, and accessibility in one kit." href="/introduction" cta="See what's new" />
					</div>
				{:else if slug === 'tree-list'}
					<div class="tree-stage">
						<TreeList items={treeOpen ? demoTree : demoTree.map((t) => ({ ...t, defaultOpen: false, children: undefined }))} label="Project files" />
					</div>
				{:else if slug === 'morphing-tabs'}
					{#snippet mtGrid()}A responsive grid of project cards lives here.{/snippet}
					{#snippet mtList()}A compact list view with inline metadata.{/snippet}
					{#snippet mtMap()}A spatial map view of the same data.{/snippet}
					<div style="width: 100%; max-width: 480px;">
						<MorphingTabs items={[
							{ id: 'grid', label: 'Grid', content: mtGrid },
							{ id: 'list', label: 'List', content: mtList },
							{ id: 'map', label: 'Map', content: mtMap }
						]} defaultValue={tabsMorphValue} onValueChange={(id) => (tabsMorphValue = id ?? 'grid')} ariaLabel="Demo morphing tabs" />
					</div>
				{:else if slug === 'center-morph-modal'}
					<CenterMorphModal>
						<CenterMorphModalTrigger><Button size="sm">Open morph modal</Button></CenterMorphModalTrigger>
						<CenterMorphModalContent ariaLabel="Demo morph modal">
							<div class="stack gap-s pad-m" style="max-width: 320px;">
								<strong>Morphing modal</strong>
								<p class="preview-copy">The trigger surface expands into the centered dialog.</p>
							</div>
						</CenterMorphModalContent>
					</CenterMorphModal>
				{:else if slug === 'morph-popover'}
					<MorphPopover open={morphPopoverOpen} onOpenChange={(v) => (morphPopoverOpen = v)}>
						<MorphPopoverTrigger><Button size="sm" variant="secondary">Open morph popover</Button></MorphPopoverTrigger>
						<MorphPopoverContent side="bottom" align="start">
							<div class="stack gap-s pad-s" style="max-width: 240px;">
								<strong>Anchored surface</strong>
								<p class="preview-copy">Content morphs from the trigger with spring easing.</p>
							</div>
						</MorphPopoverContent>
					</MorphPopover>
				{:else if slug === 'morph-select'}
					<div style="width: 220px;">
						<MorphSelect defaultValue={morphSelectValue} onValueChange={(v) => (morphSelectValue = v)}>
							<MorphSelectTrigger><MorphSelectValue placeholder="Choose speed…" /></MorphSelectTrigger>
							<MorphSelectContent>
								<MorphSelectItem value="slow" label="Slow">Slow</MorphSelectItem>
								<MorphSelectItem value="normal" label="Normal">Normal</MorphSelectItem>
								<MorphSelectItem value="speed" label="Speed">Speed</MorphSelectItem>
							</MorphSelectContent>
						</MorphSelect>
					</div>
				{:else if slug === 'animated-sidebar'}
					<div class="sidebar-stage">
						<AnimatedSidebarProvider defaultOpen={sidebarOpen} onOpenChange={(v) => (sidebarOpen = v)}>
							<AnimatedSidebar>
								<AnimatedSidebarHeader><span class="text-sm weight-700">Aurora</span></AnimatedSidebarHeader>
								<AnimatedSidebarContent>
									<AnimatedSidebarGroup>
										<AnimatedSidebarGroupLabel>Platform</AnimatedSidebarGroupLabel>
										<AnimatedSidebarGroupContent>
											<AnimatedSidebarMenu>
												<AnimatedSidebarMenuItem>
													<AnimatedSidebarMenuButton isActive href="/introduction"><span class="row ycenter gap-2xs"><Icon icon={luLayoutGrid} size={14} /> Dashboard</span></AnimatedSidebarMenuButton>
												</AnimatedSidebarMenuItem>
												<AnimatedSidebarMenuItem>
													<AnimatedSidebarMenuButton href="/introduction"><span class="row ycenter gap-2xs"><Icon icon={luFile} size={14} /> Reports</span></AnimatedSidebarMenuButton>
												</AnimatedSidebarMenuItem>
											</AnimatedSidebarMenu>
										</AnimatedSidebarGroupContent>
									</AnimatedSidebarGroup>
								</AnimatedSidebarContent>
							</AnimatedSidebar>
						</AnimatedSidebarProvider>
					</div>
				{:else if slug === 'shared-layout-bg'}
					<SharedLayoutBg class="shared-bg-stage">
						{#each demoTopNavItems as item, i (item.label)}
							<SharedLayoutBgItem>{item.label}</SharedLayoutBgItem>
						{/each}
					</SharedLayoutBg>
				{:else if slug === 'toast-stack'}
					<div class="toast-viewport-stage">
						<ToastStack toasts={demoToasts} onDismiss={() => {}} fixed={false} />
					</div>
				{:else if slug === 'bouncy-accordion'}
					<div style="width: 100%; max-width: 420px;">
						<BouncyAccordion items={demoBouncyItems} collapsible={bouncyCollapsible} />
					</div>
				{:else if slug === 'code'}
					<p class="preview-copy">Install it with <Code>pnpm add fractalsvelte</Code> and import from the package root.</p>
				{:else if slug === 'code-block'}
					<div style="width: 100%; max-width: 480px;">
						<CodeBlock code={demoCodeSnippet} label="Example usage" />
					</div>
				{:else if svelteBitsSlugs.has(slug)}
					<BitsEffect pattern={slug} category={svelteBitsCategoryBySlug[slug] as 'animation' | 'background' | 'component' | 'text'} />
				{:else}
					<MotionCore pattern={slug} />
				{/if}
			</div>
		</div>

	<!-- Interactive Prop Knobs Panel -->
	{#if ['button', 'badge', 'alert', 'avatar', 'card', 'accordion', 'input', 'textarea', 'checkbox', 'switch', 'select', 'dialog', 'tooltip', 'progress', 'skeleton', 'toast', 'separator', 'slider', 'animated-button', 'animated-card', 'reveal', 'magnetic', 'text-loop', 'marquee', 'stepper', 'counter', 'card-3d', 'macos-dock', 'card-stack', 'text-scramble', 'app-shell', 'aspect-ratio', 'banner', 'breadcrumbs', 'button-group', 'form-layout', 'kbd', 'table', 'thumbnail', 'check-indicator', 'color-picker', 'combobox', 'time-picker', 'file-input', 'icon-button', 'rating', 'countdown', 'drawer', 'overlay', 'outline', 'pagination', 'popover', 'toast-viewport', 'side-nav', 'top-nav', 'tree-list', 'bouncy-accordion', 'animated-sidebar'].includes(slug)}
		<div class="playground-knobs">
			{#if slug === 'button'}
				<div class="knob-item">
					<label for="btn-variant">Variant</label>
					<select id="btn-variant" bind:value={btnVariant}>
						<option value="primary">primary</option>
						<option value="secondary">secondary</option>
						<option value="soft">soft</option>
						<option value="outline">outline</option>
						<option value="ghost">ghost</option>
						<option value="link">link</option>
						<option value="destructive">destructive</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="btn-size">Size</label>
					<select id="btn-size" bind:value={btnSize}>
						<option value="sm">sm (compact)</option>
						<option value="md">md (default)</option>
						<option value="lg">lg (large)</option>
						<option value="icon-sm">icon-sm</option>
						<option value="icon">icon</option>
						<option value="icon-lg">icon-lg</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="btn-shape">Shape</label>
					<select id="btn-shape" bind:value={btnShape}>
						<option value="default">default</option>
						<option value="pill">pill</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="btn-label">Label</label>
					<input id="btn-label" type="text" bind:value={btnLabel} />
				</div>
				<div class="knob-item">
					<label for="btn-disabled">State</label>
					<div class="row gap-md">
					<div class="knob-toggle">
						<input id="btn-disabled" type="checkbox" bind:checked={btnDisabled} />
						<span>Disabled</span>
					</div>
					<div class="knob-toggle">
						<input id="btn-loading" type="checkbox" bind:checked={btnLoading} />
						<span>Loading</span>
					</div>
					</div>
				</div>
			{:else if slug === 'badge'}
				<div class="knob-item">
					<label for="badge-variant">Variant</label>
					<select id="badge-variant" bind:value={badgeVariant}>
						<option value="neutral">neutral</option>
						<option value="accent">accent</option>
						<option value="success">success</option>
						<option value="warning">warning</option>
						<option value="danger">danger</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="badge-text">Text</label>
					<input id="badge-text" type="text" bind:value={badgeText} />
				</div>
			{:else if slug === 'alert'}
				<div class="knob-item">
					<label for="alert-variant">Variant</label>
					<select id="alert-variant" bind:value={alertVariant}>
						<option value="info">info</option>
						<option value="success">success</option>
						<option value="warning">warning</option>
						<option value="danger">danger</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="alert-title">Title</label>
					<input id="alert-title" type="text" bind:value={alertTitle} />
				</div>
				<div class="knob-item">
					<label for="alert-content">Content</label>
					<input id="alert-content" type="text" bind:value={alertContent} />
				</div>
			{:else if slug === 'avatar'}
				<div class="knob-item">
					<label for="avatar-size">Size</label>
					<select id="avatar-size" bind:value={avatarSize}>
						<option value="sm">sm</option>
						<option value="md">md</option>
						<option value="lg">lg</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="avatar-name">Name (Initials derivation)</label>
					<input id="avatar-name" type="text" bind:value={avatarName} />
				</div>
				<div class="knob-item">
					<label for="avatar-src">Image URL (optional)</label>
					<input id="avatar-src" type="text" placeholder="https://..." bind:value={avatarSrc} />
				</div>
			{:else if slug === 'card'}
				<div class="knob-item">
					<label for="card-padding">Padding</label>
					<select id="card-padding" bind:value={cardPadding}>
						<option value="none">none</option>
						<option value="sm">sm</option>
						<option value="md">md (default)</option>
						<option value="lg">lg</option>
					</select>
				</div>
			{:else if slug === 'accordion'}
				<div class="knob-item">
					<label for="accordion-title">Title</label>
					<input id="accordion-title" type="text" bind:value={accordionTitle} />
				</div>
				<div class="knob-item">
					<label for="accordion-open">State</label>
					<div class="knob-toggle">
						<input id="accordion-open" type="checkbox" bind:checked={accordionOpen} />
						<span>Open (Expanded)</span>
					</div>
				</div>
			{:else if slug === 'input'}
				<div class="knob-item">
					<label for="input-type">Type</label>
					<select id="input-type" bind:value={inputType}>
						<option value="text">text</option>
						<option value="email">email</option>
						<option value="password">password</option>
						<option value="search">search</option>
						<option value="number">number</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="input-placeholder">Placeholder</label>
					<input id="input-placeholder" type="text" bind:value={inputPlaceholder} />
				</div>
				<div class="knob-item">
					<label for="input-disabled">State</label>
					<div class="knob-toggle">
						<input id="input-disabled" type="checkbox" bind:checked={inputDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'textarea'}
				<div class="knob-item">
					<label for="textarea-rows">Rows</label>
					<input id="textarea-rows" type="number" min="2" max="10" bind:value={textareaRows} />
				</div>
				<div class="knob-item">
					<label for="textarea-placeholder">Placeholder</label>
					<input id="textarea-placeholder" type="text" bind:value={textareaPlaceholder} />
				</div>
				<div class="knob-item">
					<label for="textarea-disabled">State</label>
					<div class="knob-toggle">
						<input id="textarea-disabled" type="checkbox" bind:checked={textareaDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'checkbox'}
				<div class="knob-item">
					<label for="cb-label">Label</label>
					<input id="cb-label" type="text" bind:value={checkboxLabel} />
				</div>
				<div class="knob-item">
					<label for="cb-checked">Checked</label>
					<div class="knob-toggle">
						<input id="cb-checked" type="checkbox" bind:checked={checkboxChecked} />
						<span>Checked</span>
					</div>
				</div>
				<div class="knob-item">
					<label for="cb-disabled">Disabled</label>
					<div class="knob-toggle">
						<input id="cb-disabled" type="checkbox" bind:checked={checkboxDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'switch'}
				<div class="knob-item">
					<label for="sw-label">Label</label>
					<input id="sw-label" type="text" bind:value={switchLabel} />
				</div>
				<div class="knob-item">
					<label for="sw-checked">Checked</label>
					<div class="knob-toggle">
						<input id="sw-checked" type="checkbox" bind:checked={switchChecked} />
						<span>Checked</span>
					</div>
				</div>
				<div class="knob-item">
					<label for="sw-disabled">Disabled</label>
					<div class="knob-toggle">
						<input id="sw-disabled" type="checkbox" bind:checked={switchDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'select'}
				<div class="knob-item">
					<label for="sel-val">Selected Value</label>
					<select id="sel-val" bind:value={selectValue}>
						<option value="starter">Starter</option>
						<option value="team">Team</option>
						<option value="enterprise">Enterprise</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="sel-disabled">State</label>
					<div class="knob-toggle">
						<input id="sel-disabled" type="checkbox" bind:checked={selectDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'dialog'}
				<div class="knob-item">
					<label for="dlg-title">Title</label>
					<input id="dlg-title" type="text" bind:value={dialogTitle} />
				</div>
				<div class="knob-item">
					<label for="dlg-desc">Description</label>
					<input id="dlg-desc" type="text" bind:value={dialogDescription} />
				</div>
			{:else if slug === 'tooltip'}
				<div class="knob-item">
					<label for="tip-content">Content</label>
					<input id="tip-content" type="text" bind:value={tooltipContent} />
				</div>
				<div class="knob-item">
					<label for="tip-pos">Position</label>
					<select id="tip-pos" bind:value={tooltipPosition}>
						<option value="top">top</option>
						<option value="bottom">bottom</option>
					</select>
				</div>
			{:else if slug === 'progress'}
				<div class="knob-item">
					<label for="prog-val">Value ({progressValue}%)</label>
					<input id="prog-val" type="range" min="0" max="100" bind:value={progressValue} />
				</div>
				<div class="knob-item">
					<label for="prog-label">Label</label>
					<input id="prog-label" type="text" bind:value={progressLabel} />
				</div>
			{:else if slug === 'skeleton'}
				<div class="knob-item">
					<label for="skel-width">Width</label>
					<input id="skel-width" type="text" bind:value={skeletonWidth} />
				</div>
				<div class="knob-item">
					<label for="skel-height">Height</label>
					<input id="skel-height" type="text" bind:value={skeletonHeight} />
				</div>
				<div class="knob-item">
					<label for="skel-circle">Shape</label>
					<div class="knob-toggle">
						<input id="skel-circle" type="checkbox" bind:checked={skeletonCircle} />
						<span>Circle</span>
					</div>
				</div>
			{:else if slug === 'toast'}
				<div class="knob-item">
					<label for="toast-variant">Variant</label>
					<select id="toast-variant" bind:value={toastVariant}>
						<option value="info">info</option>
						<option value="success">success</option>
						<option value="warning">warning</option>
						<option value="danger">danger</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="toast-title">Title</label>
					<input id="toast-title" type="text" bind:value={toastTitle} />
				</div>
			{:else if slug === 'separator'}
				<div class="knob-item">
					<label for="sep-orient">Orientation</label>
					<select id="sep-orient" bind:value={separatorOrientation}>
						<option value="horizontal">horizontal</option>
						<option value="vertical">vertical</option>
					</select>
				</div>
			{:else if slug === 'slider'}
				<div class="knob-item">
					<label for="slider-val">Value ({sliderValue})</label>
					<input id="slider-val" type="range" min="0" max="100" bind:value={sliderValue} />
				</div>
				<div class="knob-item">
					<label for="slider-disabled">State</label>
					<div class="knob-toggle">
						<input id="slider-disabled" type="checkbox" bind:checked={sliderDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'animated-button'}
				<div class="knob-item">
					<label for="animbtn-variant">Variant</label>
					<select id="animbtn-variant" bind:value={animBtnVariant}>
						<option value="primary">primary</option>
						<option value="secondary">secondary</option>
						<option value="ghost">ghost</option>
						<option value="danger">danger</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="animbtn-size">Size</label>
					<select id="animbtn-size" bind:value={animBtnSize}>
						<option value="sm">sm</option>
						<option value="md">md</option>
						<option value="lg">lg</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="animbtn-anim">Animation</label>
					<div class="knob-toggle">
						<input id="animbtn-anim" type="checkbox" bind:checked={animBtnAnimated} />
						<span>Animated</span>
					</div>
				</div>
				<div class="knob-item">
					<label for="animbtn-disabled">State</label>
					<div class="knob-toggle">
						<input id="animbtn-disabled" type="checkbox" bind:checked={animBtnDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'animated-card'}
				<div class="knob-item">
					<label for="animcard-padding">Padding</label>
					<select id="animcard-padding" bind:value={animCardPadding}>
						<option value="none">none</option>
						<option value="sm">sm</option>
						<option value="md">md</option>
						<option value="lg">lg</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="animcard-int">Interactive</label>
					<div class="knob-toggle">
						<input id="animcard-int" type="checkbox" bind:checked={animCardInteractive} />
						<span>Interactive</span>
					</div>
				</div>
			{:else if slug === 'magnetic'}
				<div class="knob-item">
					<label for="mag-strength">Strength ({magneticStrength})</label>
					<input id="mag-strength" type="range" min="0.05" max="0.5" step="0.01" bind:value={magneticStrength} />
				</div>
				<div class="knob-item">
					<label for="mag-offset">Max Offset ({magneticMaxOffset}px)</label>
					<input id="mag-offset" type="range" min="4" max="30" step="1" bind:value={magneticMaxOffset} />
				</div>
				<div class="knob-item">
					<label for="mag-disabled">State</label>
					<div class="knob-toggle">
						<input id="mag-disabled" type="checkbox" bind:checked={magneticDisabled} />
						<span>Disabled</span>
					</div>
				</div>
			{:else if slug === 'stepper'}
				<div class="knob-item">
					<label for="step-curr">Active Step ({stepperCurrent})</label>
					<input id="step-curr" type="range" min="0" max="2" step="1" bind:value={stepperCurrent} />
				</div>
				<div class="knob-item">
					<label for="step-int">Interactive</label>
					<div class="knob-toggle">
						<input id="step-int" type="checkbox" bind:checked={stepperInteractive} />
						<span>Interactive (Clickable)</span>
					</div>
				</div>				{:else if slug === 'marquee'}
					<div class="knob-item">
						<label for="marq-speed">Speed ({marqueeSpeed}s)</label>
						<input id="marq-speed" type="range" min="6" max="40" step="1" bind:value={marqueeSpeed} />
					</div>
					<div class="knob-item">
						<label for="marq-dir">Direction</label>
						<select id="marq-dir" bind:value={marqueeDirection}>
							<option value="left">left</option>
							<option value="right">right</option>
						</select>
					</div>
				{:else if slug === 'text-loop'}
					<div class="knob-item">
						<label for="tl-interval">Interval ({textLoopInterval}ms)</label>
						<input id="tl-interval" type="range" min="600" max="5000" step="100" bind:value={textLoopInterval} />
					</div>
				{:else if slug === 'counter'}
					<div class="knob-item">
						<label for="count-val">Target Number</label>
					<input id="count-val" type="number" step="500" bind:value={counterValue} />
				</div>
				<div class="knob-item">
					<label for="count-dur">Duration ({counterDuration}ms)</label>
					<input id="count-dur" type="range" min="200" max="2000" step="50" bind:value={counterDuration} />
				</div>
			{:else if slug === 'card-3d'}
				<div class="knob-item">
					<label for="c3d-tilt">Max Tilt ({card3dMaxTilt}°)</label>
					<input id="c3d-tilt" type="range" min="5" max="40" step="1" bind:value={card3dMaxTilt} />
				</div>
				<div class="knob-item">
					<label for="c3d-persp">Perspective ({card3dPerspective}px)</label>
					<input id="c3d-persp" type="range" min="400" max="2000" step="50" bind:value={card3dPerspective} />
				</div>
				<div class="knob-item">
					<label for="c3d-glare">Specular Glare</label>
					<div class="knob-toggle">
						<input id="c3d-glare" type="checkbox" bind:checked={card3dGlare} />
						<span>Enabled</span>
					</div>
				</div>
			{:else if slug === 'macos-dock'}
				<div class="knob-item">
					<label for="dock-mag">Magnification ({macosDockMagnification}x)</label>
					<input id="dock-mag" type="range" min="1.2" max="2.4" step="0.1" bind:value={macosDockMagnification} />
				</div>
				<div class="knob-item">
					<label for="dock-dist">Influence Distance ({macosDockDistance}px)</label>
					<input id="dock-dist" type="range" min="60" max="200" step="10" bind:value={macosDockDistance} />
				</div>
			{:else if slug === 'card-stack'}
				<div class="knob-item">
					<label for="cstack-vis">Visible Cards ({cardStackMaxVisible})</label>
					<input id="cstack-vis" type="range" min="2" max="5" step="1" bind:value={cardStackMaxVisible} />
				</div>
			{:else if slug === 'text-scramble'}
				<div class="knob-item">
					<label for="tsc-text">Text</label>
					<input id="tsc-text" type="text" bind:value={textScrambleText} />
				</div>
				<div class="knob-item">
					<label for="tsc-trig">Trigger Mode</label>
					<select id="tsc-trig" bind:value={textScrambleTrigger}>
						<option value="hover">hover</option>
						<option value="click">click</option>
						<option value="mount">mount</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="tsc-spd">Speed ({textScrambleSpeed}ms)</label>
					<input id="tsc-spd" type="range" min="10" max="100" step="5" bind:value={textScrambleSpeed} />
				</div>
			{:else if slug === 'app-shell'}
				<div class="knob-item">
					<label for="shell-sidebar">Regions</label>
					<div class="knob-toggle">
						<input id="shell-sidebar" type="checkbox" bind:checked={shellSidebar} /><span>Sidebar</span>
					</div>
					<div class="knob-toggle">
						<input id="shell-footer" type="checkbox" bind:checked={shellFooter} /><span>Footer</span>
					</div>
				</div>
			{:else if slug === 'aspect-ratio'}
				<div class="knob-item">
					<label for="aspect-val">Ratio</label>
					<select id="aspect-val" bind:value={aspectRatio}>
						<option value="16/9">16/9</option>
						<option value="4/3">4/3</option>
						<option value="1/1">1/1</option>
						<option value="3/4">3/4</option>
					</select>
				</div>
			{:else if slug === 'banner'}
				<div class="knob-item">
					<label for="banner-variant">Variant</label>
					<select id="banner-variant" bind:value={bannerVariant}>
						<option value="default">default</option>
						<option value="info">info</option>
						<option value="success">success</option>
						<option value="warning">warning</option>
						<option value="danger">danger</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="banner-dismiss">Dismiss</label>
					<div class="knob-toggle">
						<input id="banner-dismiss" type="checkbox" bind:checked={bannerDismissible} /><span>Dismissible</span>
					</div>
				</div>
			{:else if slug === 'breadcrumbs'}
				<div class="knob-item">
					<label for="crumbs-depth">Depth</label>
					<select id="crumbs-depth" bind:value={crumbsDepth}>
						<option value={2}>2 levels</option>
						<option value={3}>3 levels</option>
					</select>
				</div>
			{:else if slug === 'button-group'}
				<div class="knob-item">
					<label for="group-orient">Orientation</label>
					<select id="group-orient" bind:value={groupOrientation}>
						<option value="horizontal">horizontal</option>
						<option value="vertical">vertical</option>
					</select>
				</div>
			{:else if slug === 'form-layout'}
				<div class="knob-item">
					<label for="form-cols">Columns</label>
					<select id="form-cols" bind:value={formCols}>
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
					</select>
				</div>
			{:else if slug === 'kbd'}
				<div class="knob-item">
					<label for="kbd-keys">Keys (space-separated)</label>
					<input id="kbd-keys" type="text" bind:value={kbdKeys} />
				</div>
			{:else if slug === 'table'}
				<div class="knob-item">
					<label for="table-rows">Rows</label>
					<input id="table-rows" type="range" min="2" max="5" step="1" bind:value={tableRows} />
				</div>
			{:else if slug === 'thumbnail'}
				<div class="knob-item">
					<label for="thumb-shape">Shape</label>
					<select id="thumb-shape" bind:value={thumbShape}>
						<option value="square">square</option>
						<option value="round">round</option>
					</select>
				</div>
			{:else if slug === 'check-indicator'}
				<div class="knob-item">
					<label for="check-state">State</label>
					<select id="check-state" bind:value={checkState}>
						<option value="checked">checked</option>
						<option value="unchecked">unchecked</option>
						<option value="indeterminate">indeterminate</option>
					</select>
				</div>
			{:else if slug === 'color-picker'}
				<div class="knob-item">
					<label for="picker-swatches">Swatches</label>
					<div class="knob-toggle">
						<input id="picker-swatches" type="checkbox" bind:checked={pickerSwatches} /><span>Show</span>
					</div>
				</div>
			{:else if slug === 'combobox'}
				<div class="knob-item">
					<label for="combo-search">Search</label>
					<div class="knob-toggle">
						<input id="combo-search" type="checkbox" bind:checked={comboSearchable} /><span>Searchable</span>
					</div>
				</div>
			{:else if slug === 'time-picker'}
				<div class="knob-item">
					<label for="picker-step">Minute step</label>
					<select id="picker-step" bind:value={pickerStep}>
						<option value={5}>5</option>
						<option value={15}>15</option>
						<option value={30}>30</option>
						<option value={60}>60</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="picker-hour12">Format</label>
					<div class="knob-toggle">
						<input id="picker-hour12" type="checkbox" bind:checked={pickerHour12} /><span>12-hour</span>
					</div>
				</div>
			{:else if slug === 'file-input'}
				<div class="knob-item">
					<label for="file-multiple">Files</label>
					<div class="knob-toggle">
						<input id="file-multiple" type="checkbox" bind:checked={fileMultiple} /><span>Multiple</span>
					</div>
				</div>
			{:else if slug === 'icon-button'}
				<div class="knob-item">
					<label for="iconbtn-label">Label</label>
					<input id="iconbtn-label" type="text" bind:value={iconBtnLabel} />
				</div>
			{:else if slug === 'rating'}
				<div class="knob-item">
					<label for="rating-val">Value</label>
					<input id="rating-val" type="range" min="0" max="10" step="1" bind:value={ratingValue} />
				</div>
				<div class="knob-item">
					<label for="rating-max">Max</label>
					<select id="rating-max" bind:value={ratingMax}>
						<option value={5}>5</option>
						<option value={10}>10</option>
					</select>
				</div>
			{:else if slug === 'countdown'}
				<div class="knob-item">
					<label for="cd-seconds">Seconds</label>
					<input id="cd-seconds" type="range" min="10" max="300" step="5" bind:value={countdownSeconds} />
				</div>
				<div class="knob-item">
					<label for="cd-days">Units</label>
					<div class="knob-toggle">
						<input id="cd-days" type="checkbox" bind:checked={countdownShowDays} /><span>Show days</span>
					</div>
				</div>
			{:else if slug === 'drawer'}
				<div class="knob-item">
					<label for="drawer-side">Side</label>
					<select id="drawer-side" bind:value={drawerSide}>
						<option value="right">right</option>
						<option value="left">left</option>
					</select>
				</div>
			{:else if slug === 'overlay'}
				<div class="knob-item">
					<label for="overlay-modal">Mode</label>
					<div class="knob-toggle">
						<input id="overlay-modal" type="checkbox" bind:checked={overlayModal} /><span>Modal</span>
					</div>
				</div>
			{:else if slug === 'outline'}
				<div class="knob-item">
					<label for="outline-levels">Levels</label>
					<div class="knob-toggle">
						<input id="outline-levels" type="checkbox" bind:checked={outlineLevels} /><span>Include sub-levels</span>
					</div>
				</div>
			{:else if slug === 'pagination'}
				<div class="knob-item">
					<label for="pagination-total">Total pages</label>
					<input id="pagination-total" type="range" min="3" max="15" step="1" bind:value={paginationTotal} />
				</div>
			{:else if slug === 'popover'}
				<div class="knob-item">
					<label for="popover-placement">Placement</label>
					<select id="popover-placement" bind:value={popoverPlacement}>
						<option value="top">top</option>
						<option value="bottom">bottom</option>
						<option value="left">left</option>
						<option value="right">right</option>
					</select>
				</div>
			{:else if slug === 'toast-viewport'}
				<div class="knob-item">
					<label for="toast-pos">Position</label>
					<select id="toast-pos" bind:value={toastPos}>
						<option value="bottom-right">bottom-right</option>
						<option value="top-right">top-right</option>
					</select>
				</div>
				<div class="knob-item">
					<label for="toast-count">Toasts</label>
					<input id="toast-count" type="range" min="1" max="4" step="1" bind:value={toastCount} />
				</div>
			{:else if slug === 'side-nav' || slug === 'top-nav'}
				<div class="knob-item">
					<label for="nav-active">Active item</label>
					<select id="nav-active" bind:value={navActive}>
						<option value="dashboard">dashboard</option>
						<option value="reports">reports</option>
						<option value="members">members</option>
						<option value="settings">settings</option>
					</select>
				</div>
			{:else if slug === 'tree-list'}
				<div class="knob-item">
					<label for="tree-open">Expansion</label>
					<div class="knob-toggle">
						<input id="tree-open" type="checkbox" bind:checked={treeOpen} /><span>Expand folders</span>
					</div>
				</div>
			{:else if slug === 'bouncy-accordion'}
				<div class="knob-item">
					<label for="bouncy-collapsible">Behavior</label>
					<div class="knob-toggle">
						<input id="bouncy-collapsible" type="checkbox" bind:checked={bouncyCollapsible} /><span>Allow collapse</span>
					</div>
				</div>
			{:else if slug === 'animated-sidebar'}
				<div class="knob-item">
					<label for="sidebar-open">Panel</label>
					<div class="knob-toggle">
						<input id="sidebar-open" type="checkbox" bind:checked={sidebarOpen} /><span>Expanded</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Live Svelte 5 Code Snippet Block -->
	<div class="playground__code-block">
		<div class="playground__code-header">
			<span>Interactive Svelte 5 Code</span>
			<button
				type="button"
				class="playground__copy-btn"
				class:copied
				onclick={copySnippet}
			>
				{#if copied}
					✓ Copied!
				{:else}
					📋 Copy Code
				{/if}
			</button>
		</div>
		<div class="playground__code-content">
			{#if highlightedCode}
				{@html highlightedCode}
			{:else}
				<pre><code>{generatedCode}</code></pre>
			{/if}
		</div>
	</div>
</div>

