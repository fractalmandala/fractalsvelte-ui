<script lang="ts">
	import fsCss from '@fractaldesign/fractalstyler/css?url';
	import { Icon } from 'fractalicons';
	import { luSparkles, luStar, luSettings, luUser } from 'fractalicons/lucide';

	import {
		Button, IconButton, ButtonGroup, SplitButton, LinkButton, CloseButton, CopyButton, HoldToConfirm, SlideUnlock,
		Input, TextArea, Checkbox, RadioGroup, Switch, Select, Slider, RangeSlider, PinInput, NumberInput, SearchInput,
		ColorPicker, FileInput, FormField, TagInput, RotaryDial,
		Badge, Tag, Kbd, Avatar, AvatarGroup, Alert, Banner, Progress, Meter, Spinner, Skeleton, EmptyState, StatCard,
		AspectRatio, Sparkline, DotMatrix, SizeReadout, Counter,
		Card, ClickableCard, SelectableCard, Stack, Flex, Grid, Container, Section, BentoGrid, BentoCell, Divider,
		DataTable, SplitPane,
		AppShell, Header, TopNav, SideNav, BottomNav, Breadcrumb, Pagination, SegmentedControl, Tabs, TreeList,
		MobileNav, MorphingTabs, Dock, Stepper,
		Dialog, AlertDialog, Drawer, CenterMorphModal, CommandPalette, Popover, Tooltip, DropdownMenu, ContextMenu,
		Toast, ToastStack, type ToastItem,
		Heading, Text, Code, CodeBlock, Blockquote, Collapsible, Accordion,
		AnimatedButton, AnimatedCard, Card3D, GlowCard, ShimmerEffect, Marquee, TextScramble, RippleEffect,
		FloatingBadge, CanvasMotion, MagneticButton, BorderBeam, ConfettiBurst, EqualizerBars, LidarSweep, CardStack,
		ClickSpark, MagnetLines, SpotlightCard, SplitReveal, StaggerList,
		WorkflowNode, FlowCanvas, HeroBlock, PricingCard, FeatureGrid, TerminalBlock, ChatBubble, Timeline, BeforeAfter,
		ComponentPreview, PropsTable, ThemeToggle, modeState
	} from '$lib/styler';
	import { luHouse, luFolder, luBell, luCalendar, luTerminal, luCommand } from 'fractalicons/lucide';

	$effect(() => modeState.init());

	let email = $state('ada@fractal.dev');
	let password = $state('hunter2');
	let bio = $state('Designs closed-world systems.\nShips on Fridays.');
	let agree = $state(true);
	let plan = $state<string | number | undefined>('pro');
	let notify = $state(true);
	let region = $state<string | number | undefined>('eu');
	let framework = $state<string | number | undefined>(undefined);
	let volume = $state(64);
	let lo = $state(25);
	let hi = $state(70);
	let pin = $state('4920');
	let seats = $state(3);
	let query = $state('');
	let color = $state('#3b82f6');
	let tags = $state(['svelte', 'runes']);
	let gain = $state(42);
	let unlocked = $state(false);
	let counter = $state(1280);

	const regions = [
		{ value: 'us', label: 'United States', group: 'Americas' },
		{ value: 'br', label: 'Brazil', group: 'Americas' },
		{ value: 'eu', label: 'European Union', group: 'Europe' },
		{ value: 'uk', label: 'United Kingdom', group: 'Europe' },
		{ value: 'in', label: 'India', group: 'Asia' }
	];
	const frameworks = [
		{ value: 'svelte', label: 'SvelteKit' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'next', label: 'Next.js' },
		{ value: 'remix', label: 'Remix', disabled: true },
		{ value: 'nuxt', label: 'Nuxt' }
	];
	// Layout
	let picked = $state(true);
	let tier = $state(false);
	let collapsed = $state<'a' | 'b' | null>(null);
	const people = [
		{ name: 'Ada Lovelace', role: 'Engineer', commits: 412 },
		{ name: 'Grace Hopper', role: 'Admiral', commits: 1280 },
		{ name: 'Alan Turing', role: 'Researcher', commits: 87 },
		{ name: 'Katherine Johnson', role: 'Mathematician', commits: 640 }
	];

	// Navigation
	let navActive = $state('overview');
	let sideActive = $state('inbox');
	let page = $state(4);
	let view = $state('grid');
	let tab = $state('code');
	let morph = $state('all');
	let step = $state(1);
	let mobileOpen = $state(false);
	let tree = $state<string[]>(['src']);
	let treeSel = $state('index');

	// Overlays
	let dialogOpen = $state(false);
	let alertOpen = $state(false);
	let drawerOpen = $state(false);
	let paletteOpen = $state(false);
	let popOpen = $state(false);
	let menuOpen = $state(false);
	let toasts = $state<ToastItem[]>([]);
	let toastN = 0;
	function pushToast(intent: ToastItem['intent']) {
		toastN += 1;
		toasts = [...toasts, { id: `t${toastN}`, intent, title: `Toast #${toastN}`, message: 'Pinned to a corner by margins on a popover.', duration: 5000 }];
	}

	// Typography
	let acc = $state<string | string[]>('a1');
	let collapsibleOpen = $state(false);

	// Motion
	let confetti: ReturnType<typeof ConfettiBurst> | undefined = $state();
	let stackIndex = $state(0);
	let revealed = $state(false);
	const staggerItems = ['Provision', 'Build', 'Test', 'Deploy', 'Verify'].map((t, i) => ({ id: `s${i}`, label: t }));
</script>

<svelte:head>
	<link rel="stylesheet" href={fsCss} />
	<title>Fractalstyler edition</title>
</svelte:head>

<div class="content-section narrow-full bg-surface text-primary" data-mode={modeState.current}>
	<div class="box gap-xl">
		<header class="page-header">
			<div class="row ycenter xbetween gap-md">
				<h1 class="page-title">Fractalstyler edition</h1>
				<ThemeToggle variant="outline" />
			</div>
			<p class="page-desc text-secondary">
				Every component below is styled only by classes that exist in the compiled fractalstyler stylesheet.
			</p>
		</header>

		<!-- Actions -->
		<section id="actions" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Actions</h2>
				<p class="text-body text-secondary">Button axes are fractalstyler's own: data-variant, data-size, data-shape.</p>
			</div>
			<div class="row ycenter gap-sm wrap">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="soft">Soft</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="link">Link</Button>
				<Button variant="destructive">Delete</Button>
			</div>
			<div class="row ycenter gap-sm wrap">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="bs">Base</Button>
				<Button size="lg" shape="round">Large round</Button>
				<Button size="lg" loading>Saving</Button>
				<Button size="lg" disabled>Disabled</Button>
				<Button size="lg" href="#actions" variant="secondary">
					{#snippet leading()}<Icon icon={luSparkles} />{/snippet}
					Anchor
				</Button>
			</div>
			<div class="row ycenter gap-sm wrap">
				<IconButton label="Settings" size="lg"><Icon icon={luSettings} /></IconButton>
				<IconButton label="Star" variant="primary" size="lg"><Icon icon={luStar} /></IconButton>
				<IconButton label="Profile" variant="iconbox" size="lg"><Icon icon={luUser} /></IconButton>
				<CloseButton />
				<CopyButton text="pnpm add @fractaldesign/fractalstyler" size="lg" />
				<LinkButton href="https://svelte.dev" external size="lg">Svelte docs</LinkButton>
			</div>
			<div class="row ycenter gap-sm wrap">
				<ButtonGroup>
					<Button variant="secondary" size="lg">Day</Button>
					<Button variant="secondary" size="lg">Week</Button>
					<Button variant="secondary" size="lg">Month</Button>
				</ButtonGroup>
				<SplitButton size="lg">Publish</SplitButton>
				<HoldToConfirm size="lg">Hold to delete</HoldToConfirm>
			</div>
			<SlideUnlock bind:unlocked label="Slide to deploy" successLabel="Deployed" />
		</section>

		<!-- Forms -->
		<section id="forms" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Forms</h2>
				<p class="text-body text-secondary">Native controls first; composite fields are a row frame holding a ghost .input.</p>
			</div>
			<div class="grid-2 gap-md">
				<Input label="Email" type="email" bind:value={email} helperText="We never share it." />
				<Input label="Password" type="password" bind:value={password} clearable />
				<Input label="Handle" value="" placeholder="@you" error="That handle is taken" variant="outline" />
				<NumberInput label="Seats" bind:value={seats} min={1} max={20} />
			</div>
			<TextArea label="Bio" bind:value={bio} autoResize maxlength={160} />
			<div class="grid-2 gap-md">
				<Select label="Region" options={regions} bind:value={region} clearable />
				<Select label="Framework" options={frameworks} bind:value={framework} searchable clearable />
			</div>
			<SearchInput bind:value={query} placeholder="Search components…" />
			<div class="grid-2 gap-md">
				<div class="box gap-sm">
					<Checkbox label="I agree to the terms" description="You can revoke this at any time." bind:checked={agree} />
					<Checkbox label="Indeterminate" indeterminate />
					<Switch label="Email notifications" description="Weekly digest only." bind:checked={notify} />
				</div>
				<RadioGroup
					label="Plan"
					bind:value={plan}
					options={[
						{ value: 'free', label: 'Free', description: 'For side projects' },
						{ value: 'pro', label: 'Pro', description: 'For teams' },
						{ value: 'ent', label: 'Enterprise', disabled: true }
					]}
				/>
			</div>
			<Slider label="Volume" bind:value={volume} showValue />
			<RangeSlider label="Price range" bind:minVal={lo} bind:maxVal={hi} showValues formatValue={(v) => `$${v}`} />
			<div class="grid-2 gap-md">
				<PinInput label="Verification code" bind:value={pin} length={6} />
				<RotaryDial label="Gain" bind:value={gain} unit="%" />
			</div>
			<ColorPicker label="Accent" bind:value={color} />
			<TagInput label="Topics" bind:tags maxTags={5} />
			<FormField label="Project name" id="proj" required helperText="Lowercase, no spaces.">
				<Input id="proj" value="fractal-ui" />
			</FormField>
			<FileInput label="Attachments" accept=".png,.jpg,.pdf" maxSize={5_000_000} multiple />
		</section>

		<!-- Display -->
		<section id="display" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Display</h2>
				<p class="text-body text-secondary">Bars, rings and avatars are SVG geometry inked by text-* classes.</p>
			</div>
			<div class="row ycenter gap-sm wrap">
				<Badge>Primary</Badge>
				<Badge variant="success" dot>Live</Badge>
				<Badge variant="warning">Pending</Badge>
				<Badge variant="danger">Failed</Badge>
				<Badge variant="info">Beta</Badge>
				<Badge variant="surface">Draft</Badge>
				<Badge variant="outline">v2.1</Badge>
				<Tag removable>svelte</Tag>
				<Tag variant="primary">runes</Tag>
				<Kbd>⌘</Kbd><Kbd>K</Kbd>
			</div>
			<div class="row ycenter gap-sm wrap">
				<Avatar initials="AL" status="online" />
				<Avatar initials="GH" shape="rounded" status="busy" />
				<Avatar status="away" />
				<AvatarGroup excess={4}>
					<Avatar initials="AB" size="bs" />
					<Avatar initials="CD" size="bs" />
					<Avatar initials="EF" size="bs" />
				</AvatarGroup>
				<Spinner size="xl" tone="theme" />
				<SizeReadout width={1280} height={720} />
				<DotMatrix text="ONLINE" />
			</div>
			<Alert intent="info" title="Heads up" description="A new version of the design system is available." dismissible />
			<Alert intent="success" title="Deployed" description="Production is serving build #418." />
			<Alert intent="warning" title="Quota at 90%" description="Upgrade before the end of the cycle." />
			<Alert intent="danger" title="Build failed" description="3 type errors in src/lib/styler." />
			<Banner intent="info" dismissible>Scheduled maintenance on Sunday 02:00 UTC.</Banner>
			<Banner intent="success" variant="filled">All systems operational.</Banner>
			<Progress label="Uploading" value={45} showValue />
			<Progress label="Striped" value={70} tone="info" size="lg" striped animated />
			<Progress label="Indeterminate" indeterminate tone="warning" />
			<Meter label="Disk usage" value={82} low={30} high={75} optimum={10} showValue />
			<Meter label="Battery" value={64} low={20} high={80} optimum={90} showValue />
			<div class="grid-3 gap-md">
				<StatCard title="Revenue" value="$48,120" delta="+12.4%" timeframe="vs last month">
					{#snippet sparkline()}<Sparkline data={[4, 9, 7, 12, 10, 15, 18]} />{/snippet}
				</StatCard>
				<StatCard title="Churn" value="2.1%" delta="-0.4%" timeframe="30d" />
				<StatCard title="Seats" value="128" delta="0" timeframe="flat" />
			</div>
			<div class="row ycenter gap-md">
				<Counter value={counter} prefix="$" />
				<Button variant="secondary" size="md" onclick={() => (counter += 315)}>Add 315</Button>
			</div>
			<div class="box gap-sm">
				<div class="row ycenter gap-sm">
					<Skeleton variant="circular" />
					<div class="box gap-xs grow"><Skeleton width="40%" /><Skeleton lines={2} /></div>
				</div>
				<Skeleton variant="rounded" height="4em" />
			</div>
			<AspectRatio ratio="16/9" class="radius-md border">
				<svg viewBox="0 0 16 9" class="text-muted"><rect width="16" height="9" fill="currentColor" opacity="0.2" /></svg>
			</AspectRatio>
			<EmptyState title="No projects yet" description="Create your first project to get started.">
				{#snippet action()}<Button>New project</Button>{/snippet}
			</EmptyState>
		</section>

		<!-- Layout -->
		<section id="layout" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Layout</h2>
				<p class="text-body text-secondary">Cards ride .card's own axes; grids are fractalstyler's responsive .grid-N steps.</p>
			</div>
			<Card title="Deployment" description="Production · us-east-1" elevation="sm">
				{#snippet headerExtra()}<Badge variant="success" dot>Live</Badge>{/snippet}
				<Text variant="subtle">Last deployed 4 minutes ago by Ada.</Text>
				{#snippet footer()}<Button size="md">Open</Button><Button variant="ghost" size="md">Logs</Button>{/snippet}
			</Card>
			<div class="grid-2 gap-md">
				<ClickableCard title="Clickable card" description="Border lights up on hover." onclick={() => (picked = !picked)} />
				<SelectableCard title="Annual billing" description="Save 20%" bind:selected={picked} />
				<SelectableCard type="radio" title="Pro tier" description="Radio semantics" bind:selected={tier} indicatorPosition="left" />
				<Card variant="soft" padding="md" title="Soft card" />
			</div>
			<Stack direction="row" gap="sm" align="center" justify="between" class="pad-sm border radius-md">
				<span class="text-sm">Stack row · between</span><Badge variant="surface">end</Badge>
			</Stack>
			<Flex wrap gapX="lg" gapY="xs">
				{#each ['alpha', 'beta', 'gamma', 'delta', 'epsilon'] as t (t)}<Tag variant="outline">{t}</Tag>{/each}
			</Flex>
			<Grid columns="auto-fit" gap="sm">
				{#each [1, 2, 3, 4] as n (n)}<Card padding="sm" title="Auto-fit {n}" />{/each}
			</Grid>
			<BentoGrid columns={3}>
				<BentoCell colSpan={2} title="Wide cell" description="cspan-2"><Sparkline data={[3, 7, 5, 9, 6, 12, 10]} width={220} /></BentoCell>
				<BentoCell title="Cell" variant="secondary"><Counter value={42} size="2xl" /></BentoCell>
			</BentoGrid>
			<Divider label="Divider with label" />
			<div class="row ycenter h-lg"><span class="text-sm">Left</span><Divider orientation="vertical" /><span class="text-sm">Right</span></div>
			<DataTable
				columns={[
					{ key: 'name', label: 'Name', sortable: true },
					{ key: 'role', label: 'Role' },
					{ key: 'commits', label: 'Commits', sortable: true, align: 'right' }
				]}
				rows={people}
			/>
			<SplitPane bind:collapsed>
				{#snippet paneA()}<div class="pad-md text-body-sm">Pane A — drag or use the arrow keys on the divider.</div>{/snippet}
				{#snippet paneB()}<div class="pad-md text-body-sm">Pane B</div>{/snippet}
			</SplitPane>
			<Container size="prose" class="border-subtle radius-md pad-md">
				<Text variant="muted">Container size="prose" holds the 65ch reading measure.</Text>
			</Container>
			<Section eyebrow="Section" title="A titled section" subtitle="With an action on the right." spacing="md">
				{#snippet action()}<Button variant="secondary" size="md">Action</Button>{/snippet}
				<Text variant="subtle">Section body.</Text>
			</Section>
		</section>

		<!-- Navigation -->
		<section id="navigation" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Navigation</h2>
				<p class="text-body text-secondary">a.nav-link, .nav-section, the breadcrumb set and the segmented-control recipe.</p>
			</div>
			<Header sticky={false}>
				{#snippet brand()}<span class="page-heading-bs">Fractal</span>{/snippet}
				{#snippet center()}<TopNav bind:activeId={navActive} items={[{ id: 'overview', label: 'Overview', href: '#navigation' }, { id: 'docs', label: 'Docs', href: '#navigation' }, { id: 'pricing', label: 'Pricing', href: '#navigation', badge: 'new' }]} />{/snippet}
				{#snippet actions()}<ThemeToggle /><Button size="md" onclick={() => (mobileOpen = true)}>Menu</Button>{/snippet}
			</Header>
			<div class="grid-2 gap-md">
				<SideNav
					bind:activeId={sideActive}
					items={[
						{ id: 'inbox', label: 'Inbox', group: 'Mail', badge: 12 },
						{ id: 'drafts', label: 'Drafts', group: 'Mail' },
						{ id: 'cal', label: 'Calendar', group: 'Apps' },
						{ id: 'files', label: 'Files', group: 'Apps', disabled: true }
					]}
				/>
				<TreeList
					bind:expandedIds={tree}
					bind:selectedId={treeSel}
					items={[
						{ id: 'src', label: 'src', children: [{ id: 'lib', label: 'lib', children: [{ id: 'button', label: 'Button.svelte' }] }, { id: 'index', label: 'index.ts' }] },
						{ id: 'pkg', label: 'package.json' }
					]}
				/>
			</div>
			<Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Library', href: '#' }, { label: 'Styler', href: '#' }, { label: 'Navigation', href: '#' }, { label: 'Breadcrumb' }]} maxItems={3} />
			<Pagination bind:currentPage={page} totalPages={12} />
			<SegmentedControl bind:value={view} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'board', label: 'Board' }]} />
			<Tabs bind:activeTab={tab} tabs={[{ id: 'code', label: 'Code' }, { id: 'preview', label: 'Preview' }, { id: 'tests', label: 'Tests', badge: 3 }]}>
				<Text variant="subtle">Active tab: {tab}</Text>
			</Tabs>
			<Tabs variant="pill" tabs={[{ id: 'a', label: 'Pill A' }, { id: 'b', label: 'Pill B' }]} />
			<MorphingTabs bind:value={morph} items={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active', badge: 4 }, { id: 'archived', label: 'Archived' }]} />
			<MorphingTabs variant="underline" items={[{ id: 'one', label: 'Underline' }, { id: 'two', label: 'Morph' }, { id: 'three', label: 'Indicator' }]} />
			<Stepper bind:currentStep={step} clickable steps={[{ label: 'Account', description: 'Email & password' }, { label: 'Workspace' }, { label: 'Invite' }, { label: 'Done' }]} />
			<Stepper orientation="vertical" currentStep={2} steps={[{ label: 'Queued' }, { label: 'Building' }, { label: 'Failed', error: true }]} />
			<Dock items={[{ id: 'home', label: 'Home' }, { id: 'files', label: 'Files' }, { id: 'mail', label: 'Mail' }, { id: 'cal', label: 'Calendar' }, { id: 'term', label: 'Terminal' }]}>
				{#snippet itemSnippet({ item })}
					<Icon icon={item.id === 'home' ? luHouse : item.id === 'files' ? luFolder : item.id === 'mail' ? luBell : item.id === 'cal' ? luCalendar : luTerminal} />
				{/snippet}
			</Dock>
			<BottomNav bind:activeId={sideActive} items={[{ id: 'inbox', label: 'Inbox', badge: 3 }, { id: 'drafts', label: 'Drafts' }, { id: 'cal', label: 'Calendar' }]} />
			<MobileNav bind:open={mobileOpen} title="Menu">
				<a class="nav-link" href="#actions">Actions</a>
				<a class="nav-link" href="#forms">Forms</a>
				<a class="nav-link" href="#overlays">Overlays</a>
			</MobileNav>
		</section>

		<!-- Overlays -->
		<section id="overlays" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Overlays</h2>
				<p class="text-body text-secondary">Native dialog and popover; floating panels are placed by flex alignment, never offsets.</p>
			</div>
			<div class="row ycenter gap-sm wrap">
				<Button onclick={() => (dialogOpen = true)}>Dialog</Button>
				<Button variant="destructive" onclick={() => (alertOpen = true)}>Alert dialog</Button>
				<Button variant="secondary" onclick={() => (drawerOpen = true)}>Drawer</Button>
				<Button variant="secondary" onclick={() => (paletteOpen = true)}>
					{#snippet leading()}<Icon icon={luCommand} />{/snippet}Command palette
				</Button>
				<CenterMorphModal title="Center modal" description="Opens in a native dialog." />
			</div>
			<div class="row ycenter gap-sm wrap">
				<Popover bind:open={popOpen} label="Share">
					{#snippet trigger({ toggle })}<Button variant="outline" onclick={toggle}>Popover</Button>{/snippet}
					<span class="text-sm weight-600">Share link</span>
					<Input value="https://fractal.dev/s/abc" readonly size="md" />
				</Popover>
				<DropdownMenu
					bind:open={menuOpen}
					items={[
						{ id: 'dup', label: 'Duplicate', shortcut: '⌘D' },
						{ id: 'copy', label: 'Copy link' },
						{ separator: true },
						{ id: 'del', label: 'Delete', danger: true }
					]}
				>
					{#snippet trigger({ toggle })}<Button variant="outline" onclick={toggle}>Dropdown ▾</Button>{/snippet}
				</DropdownMenu>
				<Tooltip content="Tooltip on top">
					<Button variant="ghost">Hover me</Button>
				</Tooltip>
				<Tooltip content="Placed right" placement="right">
					<Button variant="ghost">And me</Button>
				</Tooltip>
			</div>
			<ContextMenu items={[{ id: 'open', label: 'Open' }, { id: 'rename', label: 'Rename' }, { id: 'rm', label: 'Delete', danger: true }]}>
				<div class="pad-lg border radius-md bg-sunken text-sm text-muted ta-c">Right-click this region</div>
			</ContextMenu>
			<div class="row ycenter gap-sm wrap">
				<Button variant="secondary" onclick={() => pushToast('success')}>Success toast</Button>
				<Button variant="secondary" onclick={() => pushToast('danger')}>Danger toast</Button>
			</div>
			<Toast title="Inline toast" message="Hover to pause the timer." intent="info" duration={0} />
			<ToastStack bind:toasts />

			<Dialog bind:open={dialogOpen} title="Rename project" description="Choose a short, memorable name.">
				<Input label="Name" value="fractal-ui" />
				{#snippet footer()}
					<Button variant="ghost" onclick={() => (dialogOpen = false)}>Cancel</Button>
					<Button onclick={() => (dialogOpen = false)}>Save</Button>
				{/snippet}
			</Dialog>
			<AlertDialog bind:open={alertOpen} title="Delete project?" description="This permanently removes the project and its deployments." confirmText="Delete" onconfirm={() => (alertOpen = false)} />
			<Drawer bind:open={drawerOpen} title="Filters" placement="right">
				<Checkbox label="Only active" checked />
				<Checkbox label="Include archived" />
				{#snippet footer()}<Button onclick={() => (drawerOpen = false)}>Apply</Button>{/snippet}
			</Drawer>
			<CommandPalette
				bind:open={paletteOpen}
				groups={[
					{ category: 'Files', items: [{ id: 'new', label: 'New file', shortcut: '⌘N' }, { id: 'open', label: 'Open…', description: 'Browse the workspace' }] },
					{ category: 'Actions', items: [{ id: 'copy', label: 'Copy link' }, { id: 'trash', label: 'Move to trash' }] }
				]}
			/>
		</section>

		<!-- Typography -->
		<section id="typography" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Typography</h2>
				<p class="text-body text-secondary">The semantic composites: .page-title, .page-heading-*, .text-body*.</p>
			</div>
			<Heading level={1}>Heading 1</Heading>
			<Heading level={2}>Heading 2</Heading>
			<Heading level={3}>Heading 3</Heading>
			<Heading level={6}>Heading 6</Heading>
			<Text variant="lead">Lead text sets up the section.</Text>
			<Text>Body copy with <Code>inline code</Code> and <Code variant="primary">primary</Code>.</Text>
			<Text variant="caption">Caption text</Text>
			<Blockquote quote="Simplicity is prerequisite for reliability." author="Edsger Dijkstra" citation="EWD498" />
			<CodeBlock filename="Button.svelte" language="svelte" showLineNumbers code={'<button data-variant="primary" data-size="md">\n\tSave\n</button>'} />
			<Accordion
				bind:value={acc}
				items={[
					{ id: 'a1', title: 'What is closed-world styling?', content: 'Every class must exist in the compiled stylesheet. No ad-hoc CSS.' },
					{ id: 'a2', title: 'How does it animate?', content: 'The fsx accordion collapses a grid row from 0fr to 1fr.' },
					{ id: 'a3', title: 'Disabled item', disabled: true }
				]}
			/>
			<Collapsible bind:open={collapsibleOpen} title="Collapsible">
				<p class="text-body-sm">Hidden content, inert while closed.</p>
			</Collapsible>
		</section>

		<!-- Motion -->
		<section id="motion" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Motion</h2>
				<p class="text-body text-secondary">SVG/SMIL, canvas and text changes; nothing writes CSS.</p>
			</div>
			<div class="row ycenter gap-sm wrap">
				<AnimatedButton>Animated</AnimatedButton>
				<MagneticButton variant="secondary">Magnetic</MagneticButton>
				<FloatingBadge>Online</FloatingBadge>
				<EqualizerBars />
				<TextScramble text="DECRYPTING SIGNAL" trigger="both" />
			</div>
			<div class="grid-2 gap-md">
				<GlowCard><span class="card-title">GlowCard</span><span class="text-body-sm text-secondary">Border lights under the pointer.</span></GlowCard>
				<SpotlightCard><span class="card-title">SpotlightCard</span><span class="text-body-sm text-secondary">Spotlight follows the pointer.</span></SpotlightCard>
				<AnimatedCard>
					{#snippet header()}<span class="card-title">AnimatedCard</span>{/snippet}
					Wash + shadow lift on hover.
				</AnimatedCard>
				<Card3D><div class="box gap-xs pad-lg"><span class="card-title">Card3D</span><span class="text-body-sm text-secondary">Glare only — no 3D transform.</span></div></Card3D>
			</div>
			<div class="relative box border radius-md">
				<BorderBeam />
				<div class="box pad-lg text-body-sm">BorderBeam travels round this box.</div>
			</div>
			<ShimmerEffect class="radius-md"><div class="pad-lg bg-sunken radius-md text-body-sm">ShimmerEffect sheen</div></ShimmerEffect>
			<RippleEffect class="border"><div class="pad-lg text-body-sm">Click for a ripple</div></RippleEffect>
			<ClickSpark class="border radius-md"><div class="pad-lg text-body-sm">Click for sparks</div></ClickSpark>
			<Marquee>
				{#each ['Svelte', 'SvelteKit', 'fractalstyler', 'fractalicons', 'Runes', 'SMIL'] as w (w)}<Badge variant="surface">{w}</Badge>{/each}
			</Marquee>
			<div class="grid-2 gap-md">
				<LidarSweep />
				<LidarSweep mode="linear" tone="info" label="LINEAR" />
			</div>
			<MagnetLines rows={4} columns={12} />
			<CanvasMotion ratio="3/2" />
			<div class="box gap-sm">
				<Button variant="secondary" onclick={() => confetti?.burst()}>Burst confetti</Button>
				<ConfettiBurst bind:this={confetti} ratio="16/9" class="border radius-md" />
			</div>
			<CardStack bind:activeIndex={stackIndex} items={[{ id: 'c1', title: 'First card', description: 'Swipe or use the arrows.', badge: 'New' }, { id: 'c2', title: 'Second card' }, { id: 'c3', title: 'Third card' }]} />
			<SplitReveal bind:revealed label="Hover to reveal">
				<span class="card-title">Revealed!</span><span class="text-body-sm text-secondary">Shutters are SVG rects.</span>
			</SplitReveal>
			<StaggerList items={staggerItems} stagger={150}>
				{#snippet itemSnippet({ item, index })}<div class="row ycenter gap-sm pad-sm border-subtle radius-sm text-sm"><span class="mono text-muted">{index + 1}</span>{item.label}</div>{/snippet}
			</StaggerList>
		</section>

		<!-- Blocks -->
		<section id="blocks" class="box gap-md py-lg bb">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Blocks</h2>
				<p class="text-body text-secondary">Compositions built from the same primitives.</p>
			</div>
			<HeroBlock badge="v1.2" title="Ship closed-world UI" description="Components styled only by fractalstyler classes.">
				{#snippet actions()}<Button size="lg">Get started</Button><Button size="lg" variant="outline">Docs</Button>{/snippet}
			</HeroBlock>
			<FeatureGrid
				columns={2}
				items={[
					{ title: 'Zero CSS', description: 'No style blocks, no inline styles.', badge: 'core' },
					{ title: 'Verified', description: 'Every class checked against the compiled sheet.' }
				]}
			/>
			<div class="grid-2 gap-md">
				<PricingCard tier="Starter" price="$0" features={['1 project', 'Community support']} />
				<PricingCard tier="Pro" price="$24" popular features={['Unlimited projects', 'Priority support', 'SSO']} />
			</div>
			<TerminalBlock title="zsh" animated lines={[{ command: 'pnpm add @fractaldesign/fractalstyler', output: '+ @fractaldesign/fractalstyler 1.2.0' }, { command: 'pnpm styler:check', output: '✔ 128 file(s) clean' }]} />
			<div class="box gap-sm">
				<ChatBubble role="system" message="Today" />
				<ChatBubble role="assistant" message="How can I help with your design system?" timestamp="10:02" />
				<ChatBubble role="user" message="Port the components to fractalstyler." timestamp="10:03" status="read" />
			</div>
			<Timeline
				align="alternate"
				items={[
					{ title: 'Kickoff', time: 'Mon', description: 'Scope agreed.' },
					{ title: 'Build', time: 'Wed', intent: 'info', active: true, description: 'Components in progress.' },
					{ title: 'Ship', time: 'Fri', intent: 'success' }
				]}
			/>
			<FlowCanvas ratio="16/9">
				<WorkflowNode title="Trigger" subtitle="On push" status="success" outputs={[{ id: 'o', label: 'event' }]} />
				<WorkflowNode title="Build" subtitle="pnpm build" status="running" selected inputs={[{ id: 'i', label: 'event' }]} outputs={[{ id: 'o', label: 'artifact' }]} />
			</FlowCanvas>
			<BeforeAfter>
				{#snippet before()}<div class="pad-xl text-body-sm">Before: scoped &lt;style&gt; blocks.</div>{/snippet}
				{#snippet after()}<div class="pad-xl text-body-sm text-theme">After: fractalstyler classes only.</div>{/snippet}
			</BeforeAfter>
		</section>

		<!-- Doc -->
		<section id="doc" class="box gap-md py-lg">
			<div class="box gap-xs">
				<h2 class="page-heading-xl">Documentation</h2>
			</div>
			<ComponentPreview title="Button" description="Primary call to action." code={'<Button>Save</Button>'}>
				<Button>Save</Button>
			</ComponentPreview>
			<PropsTable
				items={[
					{ name: 'variant', type: 'FsVariant', optional: true, default: "'primary'", description: 'Paint axis' },
					{ name: 'value', type: 'string', bindable: true, description: 'Bound value' }
				]}
			/>
		</section>
	</div>
</div>
