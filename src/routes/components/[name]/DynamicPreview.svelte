<script lang="ts">
	import * as Lib from '$lib';

	interface Props {
		name: string;
		category: string;
	}

	let { name, category }: Props = $props();

	// Interactive states
	let btnLoading = $state(false);
	let animatedClickCount = $state(0);
	let magneticClickCount = $state(0);
	let inputValue = $state('fractal@design.system');
	let switchChecked = $state(true);
	let checkboxChecked = $state(true);
	let sliderValue = $state(65);
	let rangeMin = $state(25);
	let rangeMax = $state(75);
	let pinValue = $state('8492');
	let numberValue = $state(5);
	let colorValue = $state('#6366f1');
	let selectValue = $state('svelte');
	let radioValue = $state('pro');
	let activeTab = $state('overview');
	let currentStep = $state(1);
	let currentPage = $state(3);
	let dialogOpen = $state(false);
	let alertDialogOpen = $state(false);
	let drawerOpen = $state(false);
	let popoverOpen = $state(false);
	let segmentedValue = $state('day');

	// Navigation & Shell states
	let appShellCollapsed = $state(false);
	let mobileNavOpen = $state(false);
	let bottomNavActive = $state('home');
	let topNavActive = $state('popular');
	let sideNavActive = $state('actions');

	// Overlays & Advanced states
	let commandPaletteOpen = $state(false);
	let holdConfirmedCount = $state(0);
	let tagsList = $state(['Svelte 5', 'Runes', 'Zero-Tailwind', 'Design-Tokens']);
	let scrambleTarget = $state('QUANTUM RUNES ONLINE');
	let beforeAfterPos = $state(50);
	let toastCounter = $state(0);
	let activeToasts = $state<{ id: string; title: string; message: string; intent?: any; duration: number }[]>([]);
	let confettiRef: any = $state();
	let slideUnlocked = $state(false);
	let rotaryVal = $state(45);
	let eqPlaying = $state(true);
	let morphTabVal = $state('tab1');
	let morphModalOpen = $state(false);
	let dotText = $state('READY');
	let dockClicked = $state('Dashboard');
	let cardStackIdx = $state(0);
	let counterVal = $state(1337);
	let splitRevealed = $state(false);
	let staggerItems = $state([
		{ id: '1', title: 'Compile Pipeline', status: 'Optimal', latency: '12ms' },
		{ id: '2', title: 'Zero Drift Gate', status: 'Passed', latency: '4ms' },
		{ id: '3', title: 'Edge CDN Mesh', status: 'Synced', latency: '18ms' }
	]);
	let routeScreen = $state(1);
	let routeTransitionType = $state<'drill' | 'sheet' | 'zoom' | 'fade'>('drill');
	let heroExpanded = $state(false);

	function triggerToast(intent: 'info' | 'success' | 'warning' | 'danger') {
		const id = `toast-${++toastCounter}`;
		const titles = {
			info: 'System Update',
			success: 'Changes Deployed',
			warning: 'Quota Warning',
			danger: 'Deployment Failed'
		};
		const msgs = {
			info: 'Syncing AST metadata across 106 components.',
			success: 'All verification checks passed with zero drift.',
			warning: 'API usage has reached 85% of monthly allowance.',
			danger: 'Connection timed out while querying database.'
		};
		activeToasts = [...activeToasts, { id, title: titles[intent], message: msgs[intent], intent, duration: 3500 }];
	}

	const selectOptions = [
		{ label: 'Svelte 5 Runes', value: 'svelte' },
		{ label: 'TypeScript Strict', value: 'typescript' },
		{ label: 'Vite Ecosystem', value: 'vite' },
		{ label: 'Scoped Tokens', value: 'tokens' }
	];

	const radioOptions = [
		{ label: 'Starter Tier', value: 'starter', description: 'Free forever for open source' },
		{ label: 'Pro Developer', value: 'pro', description: 'Advanced blocks and canvas features' },
		{ label: 'Enterprise Core', value: 'enterprise', description: 'Custom SLA and design system audit' }
	];

	const tabsData = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'props', label: 'API Specs' },
		{ id: 'changelog', label: 'Changelog' }
	];

	const stepperSteps = [
		{ label: 'Tokens', description: 'Color & spacing' },
		{ label: 'Components', description: 'Runes architecture' },
		{ label: 'Quality Gate', description: 'Zero drift verification' },
		{ label: 'Release', description: 'Production distribution' }
	];

	const commandPaletteGroups = [
		{
			category: 'Navigation',
			items: [
				{ id: 'home', label: 'Go to Overview', description: 'Return to home landing page', shortcut: 'G H' },
				{ id: 'btn', label: 'View Button Component', description: 'Actions category', shortcut: 'G B' },
				{ id: 'cards', label: 'Explore 3D Tilt Card', description: 'Motion category', shortcut: 'G C' }
			]
		},
		{
			category: 'Theme & Appearance',
			items: [
				{ id: 'dark', label: 'Toggle Light / Dark Mode', description: 'Switch active color scheme', shortcut: '⌘D' },
				{ id: 'pro', label: 'Switch to Pro UI Theme', description: 'Linear-inspired dark aesthetic', shortcut: 'T P' },
				{ id: 'beui', label: 'Switch to BeUI Theme', description: 'Vibrant modern aesthetic', shortcut: 'T B' }
			]
		},
		{
			category: 'Documentation',
			items: [
				{ id: 'ast', label: 'Inspect AST Manifest', description: '106 components mapped with 0 drift' },
				{ id: 'tokens', label: 'Open Design Tokens CSS', description: 'View --f-* token dictionary' }
			]
		}
	];

	const sampleTableRows = [
		{ id: '1', name: 'Button', category: 'Actions', status: 'Stable', runes: 'Yes', rating: 4.9 },
		{ id: '2', name: 'BentoGrid', category: 'Layout', status: 'Enhanced', runes: 'Yes', rating: 5.0 },
		{ id: '3', name: 'CommandPalette', category: 'Overlays', status: 'Active', runes: 'Yes', rating: 4.8 },
		{ id: '4', name: 'MagneticButton', category: 'Motion', status: 'New', runes: 'Yes', rating: 4.9 },
		{ id: '5', name: 'ToastStack', category: 'Overlays', status: 'New', runes: 'Yes', rating: 5.0 }
	];

	const sampleTableCols: Lib.DataColumn[] = [
		{ key: 'name', label: 'Component', sortable: true },
		{ key: 'category', label: 'Category', sortable: true },
		{ key: 'status', label: 'Status', sortable: true },
		{ key: 'runes', label: 'Runes Ready' },
		{ key: 'rating', label: 'Rating', sortable: true, align: 'right' }
	];

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Components', href: '/components/Button' },
		{ label: 'Active', href: '#' }
	];

	const treeItems = [
		{
			id: '1',
			label: 'src',
			children: [
				{
					id: '2',
					label: 'lib',
					children: [
						{ id: '3', label: 'components' },
						{ id: '4', label: 'tokens.css' }
					]
				},
				{ id: '5', label: 'routes' }
			]
		}
	];
</script>

<div class="f-live-stage">
	<!-- =================== ACTIONS =================== -->
	{#if name === 'Button'}
		<div class="f-preview-column">
			<div class="f-variants-title">Variants Matrix</div>
			<div class="f-demo-row">
				<Lib.Button variant="primary">Primary</Lib.Button>
				<Lib.Button variant="secondary">Secondary</Lib.Button>
				<Lib.Button variant="soft">Soft</Lib.Button>
				<Lib.Button variant="outline">Outline</Lib.Button>
				<Lib.Button variant="ghost">Ghost</Lib.Button>
				<Lib.Button variant="destructive">Destructive</Lib.Button>
			</div>

			<div class="f-variants-title">Sizes & States</div>
			<div class="f-demo-row">
				<Lib.Button size="xs">XS Size</Lib.Button>
				<Lib.Button size="sm">SM Size</Lib.Button>
				<Lib.Button size="md">MD Size</Lib.Button>
				<Lib.Button size="lg">LG Size</Lib.Button>
				<Lib.Button size="xl">XL Size</Lib.Button>
				<Lib.Button shape="pill" variant="primary">Pill Shape</Lib.Button>
				<Lib.Button disabled>Disabled</Lib.Button>
				<Lib.Button variant="primary" loading={btnLoading} onclick={() => { btnLoading = true; setTimeout(() => btnLoading = false, 1500); }}>
					{btnLoading ? 'Saving...' : 'Click to Load'}
				</Lib.Button>
			</div>
		</div>

	{:else if name === 'IconButton'}
		<div class="f-preview-column">
			<div class="f-variants-title">Variants & Shapes</div>
			<div class="f-demo-row">
				<Lib.IconButton label="Heart action" variant="soft">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
				</Lib.IconButton>
				<Lib.IconButton label="Star action" variant="primary">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
				</Lib.IconButton>
				<Lib.IconButton label="Trash action" variant="destructive" shape="pill">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
				</Lib.IconButton>
				<Lib.IconButton label="Settings" variant="secondary" shape="square">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
				</Lib.IconButton>
			</div>
		</div>

	{:else if name === 'ButtonGroup'}
		<div class="f-demo-row">
			<Lib.ButtonGroup>
				<Lib.Button variant="outline">Left</Lib.Button>
				<Lib.Button variant="outline">Center</Lib.Button>
				<Lib.Button variant="outline">Right</Lib.Button>
			</Lib.ButtonGroup>
		</div>

	{:else if name === 'SplitButton'}
		<div class="f-demo-row">
			<Lib.SplitButton
				variant="primary"
				onclick={() => {}}
				ondropdown={() => {}}
			>
				Publish Changes
			</Lib.SplitButton>
			<Lib.SplitButton
				variant="secondary"
				shape="pill"
			>
				Save Draft
			</Lib.SplitButton>
		</div>

	{:else if name === 'LinkButton'}
		<div class="f-demo-row">
			<Lib.LinkButton href="/" variant="primary">
				Internal Link
			</Lib.LinkButton>
			<Lib.LinkButton href="https://svelte.dev" variant="outline" external>
				External Docs
			</Lib.LinkButton>
		</div>

	{:else if name === 'CloseButton'}
		<div class="f-demo-row">
			<Lib.CloseButton />
			<Lib.CloseButton />
		</div>

	{:else if name === 'CopyButton'}
		<div class="f-demo-row">
			<Lib.CopyButton text="pnpm add @fractaldesign/fractalsvelte-ui" label="Copy Command" copiedLabel="Copied Command!" />
		</div>

	{:else if name === 'HoldToConfirm'}
		<div class="f-preview-column">
			<div class="f-demo-row">
				<Lib.HoldToConfirm
					holdTime={1200}
					variant="destructive"
					onconfirm={() => holdConfirmedCount++}
				>
					Hold to Delete Cluster
				</Lib.HoldToConfirm>
				<Lib.HoldToConfirm
					holdTime={1000}
					variant="primary"
					shape="pill"
					onconfirm={() => holdConfirmedCount++}
				>
					Hold to Deploy
				</Lib.HoldToConfirm>
			</div>
			<div style="font-size: 0.85rem; color: var(--f-text-muted); text-align: center;">
				Press and hold button for 1.2s to trigger confirm action. Completed confirmations: <strong>{holdConfirmedCount}</strong>
			</div>
		</div>

	<!-- =================== FORMS =================== -->
	{:else if name === 'Input'}
		<div class="f-preview-column" style="max-width: 380px; width: 100%;">
			<Lib.Input label="Email Address" bind:value={inputValue} placeholder="name@domain.com" helperText="We never share your email." clearable />
			<Lib.Input label="Password" type="password" value="secretpass123" />
			<Lib.Input label="Invalid Field" value="broken-input" error="Please enter a valid format" />
		</div>

	{:else if name === 'TextArea'}
		<div style="max-width: 400px; width: 100%;">
			<Lib.TextArea label="Project Notes" placeholder="Type notes here..." maxlength={200} showCount rows={3} autoResize />
		</div>

	{:else if name === 'Checkbox'}
		<div style="display: flex; flex-direction: column; gap: 0.75rem;">
			<Lib.Checkbox bind:checked={checkboxChecked} label="Enable real-time updates" description="Receive push notifications for critical changes" />
			<Lib.Checkbox indeterminate label="Indeterminate tri-state checkbox" />
			<Lib.Checkbox disabled label="Disabled checkbox option" />
		</div>

	{:else if name === 'Radio'}
		<div style="display: flex; gap: 1.5rem;">
			<Lib.Radio name="demo_radio" value="opt1" checked label="Option Alpha" />
			<Lib.Radio name="demo_radio" value="opt2" label="Option Beta" />
			<Lib.Radio name="demo_radio" value="opt3" disabled label="Disabled" />
		</div>

	{:else if name === 'RadioGroup'}
		<div style="max-width: 420px; width: 100%;">
			<Lib.RadioGroup options={radioOptions} bind:value={radioValue} label="Choose Subscription Plan" />
		</div>

	{:else if name === 'Switch'}
		<div style="display: flex; align-items: center; gap: 2rem;">
			<Lib.Switch bind:checked={switchChecked} label="Dark Mode Sync" />
			<Lib.Switch size="sm" checked label="Compact Switch" />
			<Lib.Switch disabled label="Disabled Switch" />
		</div>

	{:else if name === 'Select'}
		<div style="max-width: 340px; width: 100%;">
			<Lib.Select options={selectOptions} bind:value={selectValue} label="Primary Framework" />
		</div>

	{:else if name === 'Slider'}
		<div style="max-width: 360px; width: 100%;">
			<Lib.Slider label="Volume Level" bind:value={sliderValue} min={0} max={100} showValue />
		</div>

	{:else if name === 'RangeSlider'}
		<div style="max-width: 360px; width: 100%;">
			<Lib.RangeSlider label="Price Window" bind:minVal={rangeMin} bind:maxVal={rangeMax} min={0} max={100} />
		</div>

	{:else if name === 'PinInput'}
		<div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
			<Lib.PinInput length={4} bind:value={pinValue} />
			<span style="font-size: 0.8rem; color: var(--f-text-muted);">Entered Code: <code>{pinValue}</code></span>
		</div>

	{:else if name === 'NumberInput'}
		<div style="max-width: 220px;">
			<Lib.NumberInput label="Quantity" bind:value={numberValue} min={1} max={100} step={1} />
		</div>

	{:else if name === 'SearchInput'}
		<div style="max-width: 340px; width: 100%;">
			<Lib.SearchInput placeholder="Search tokens & components..." />
		</div>

	{:else if name === 'ColorPicker'}
		<Lib.ColorPicker label="Brand Accent" bind:value={colorValue} />

	{:else if name === 'FileInput'}
		<div style="max-width: 420px; width: 100%;">
			<Lib.FileInput label="Upload Assets" description="Drag & drop PNG, SVG, or JSON" />
		</div>

	{:else if name === 'FormField'}
		<div style="max-width: 340px; width: 100%;">
			<Lib.FormField label="Full Name" required helperText="As it appears on your passport">
				<Lib.Input placeholder="Amrit Patel" />
			</Lib.FormField>
		</div>

	{:else if name === 'TagInput'}
		<div style="max-width: 420px; width: 100%;">
			<Lib.TagInput bind:tags={tagsList} placeholder="Type tag and press Enter..." />
			<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--f-text-muted);">
				Active tags: {tagsList.join(', ')}
			</div>
		</div>

	<!-- =================== DISPLAY =================== -->
	{:else if name === 'Badge'}
		<div class="f-preview-column">
			<div class="f-variants-title">Variants Matrix</div>
			<div class="f-demo-row">
				<Lib.Badge variant="primary" dot>Primary</Lib.Badge>
				<Lib.Badge variant="success" dot>Success</Lib.Badge>
				<Lib.Badge variant="warning" dot>Warning</Lib.Badge>
				<Lib.Badge variant="danger" dot>Danger</Lib.Badge>
				<Lib.Badge variant="info" dot>Info</Lib.Badge>
				<Lib.Badge variant="surface">Surface</Lib.Badge>
				<Lib.Badge variant="outline">Outline</Lib.Badge>
			</div>
			<div class="f-variants-title">Sizes</div>
			<div class="f-demo-row">
				<Lib.Badge size="sm">Small</Lib.Badge>
				<Lib.Badge size="md">Medium</Lib.Badge>
				<Lib.Badge size="lg">Large</Lib.Badge>
			</div>
		</div>

	{:else if name === 'Tag'}
		<div class="f-demo-row">
			<Lib.Tag removable>Svelte 5</Lib.Tag>
			<Lib.Tag removable>Runes</Lib.Tag>
			<Lib.Tag variant="primary">Design Tokens</Lib.Tag>
			<Lib.Tag variant="outline">Scoped CSS</Lib.Tag>
		</div>

	{:else if name === 'Avatar'}
		<div class="f-demo-row" style="align-items: center;">
			<Lib.Avatar initials="AP" alt="Amrit Patel" size="lg" status="online" />
			<Lib.Avatar initials="DM" alt="DeepMind Team" size="md" status="busy" />
			<Lib.Avatar initials="SK" alt="SvelteKit Core" size="sm" status="away" />
			<Lib.Avatar initials="FD" alt="Fractal Design" size="xs" shape="rounded" />
		</div>

	{:else if name === 'AvatarGroup'}
		<Lib.AvatarGroup limit={3}>
			<Lib.Avatar initials="AR" alt="Alex River" />
			<Lib.Avatar initials="SC" alt="Sam Chen" />
			<Lib.Avatar initials="TS" alt="Taylor Swift" />
			<Lib.Avatar initials="JL" alt="Jordan Lee" />
		</Lib.AvatarGroup>

	{:else if name === 'Kbd'}
		<div class="f-demo-row">
			<Lib.Kbd>⌘</Lib.Kbd>
			<Lib.Kbd>K</Lib.Kbd>
			<span style="font-size: 0.85rem; color: var(--f-text-muted); margin: 0 0.5rem;">or</span>
			<Lib.Kbd>Ctrl</Lib.Kbd>
			<Lib.Kbd>P</Lib.Kbd>
			<Lib.Kbd>Shift</Lib.Kbd>
			<Lib.Kbd>↵</Lib.Kbd>
		</div>

	{:else if name === 'Alert'}
		<div style="max-width: 500px; width: 100%; display: flex; flex-direction: column; gap: 0.75rem;">
			<Lib.Alert intent="info" title="System Synchronization" description="All 106 components verified with zero drift." />
			<Lib.Alert intent="success" title="Build Successful" description="SvelteKit 3 production SSR build passed cleanly." />
			<Lib.Alert intent="warning" title="Deprecation Notice" description="Legacy syntax migrated to Svelte 5 runes." />
			<Lib.Alert intent="danger" title="Validation Failed" description="Found 0 errors and 0 warnings." />
		</div>

	{:else if name === 'Banner'}
		<div style="width: 100%; max-width: 600px;">
			<Lib.Banner intent="info">
				Fractal UI v0.1.0 is officially released with Svelte 5 Runes!
			</Lib.Banner>
		</div>

	{:else if name === 'Progress'}
		<div style="max-width: 380px; width: 100%; display: flex; flex-direction: column; gap: 1rem;">
			<Lib.Progress value={78} max={100} showValue label="Sync Progress" />
			<Lib.Progress indeterminate label="Indeterminate Activity" />
		</div>

	{:else if name === 'Meter'}
		<div style="max-width: 380px; width: 100%;">
			<Lib.Meter value={85} min={0} max={100} low={30} high={80} optimum={90} label="Storage Quota" />
		</div>

	{:else if name === 'Spinner'}
		<div class="f-demo-row" style="align-items: center;">
			<Lib.Spinner size="sm" />
			<Lib.Spinner size="md" />
			<Lib.Spinner size="lg" />
		</div>

	{:else if name === 'Skeleton'}
		<div style="width: 300px; display: flex; flex-direction: column; gap: 0.75rem;">
			<Lib.Skeleton height="1.75rem" width="60%" />
			<Lib.Skeleton height="1rem" width="100%" />
			<Lib.Skeleton height="1rem" width="85%" />
		</div>

	{:else if name === 'EmptyState'}
		<div style="max-width: 420px; width: 100%;">
			<Lib.EmptyState title="No items found" description="Try adjusting your search criteria or clear current filters." />
		</div>

	{:else if name === 'StatCard'}
		<div style="width: 300px;">
			<Lib.StatCard title="Active Runes Components" value="106" delta="+100%" deltaType="increase" timeframe="vs legacy Svelte 4" />
		</div>

	{:else if name === 'AspectRatio'}
		<div style="width: 340px;">
			<Lib.AspectRatio ratio="16/9">
				<div style="width: 100%; height: 100%; background: var(--f-primary-subtle); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--f-primary);">
					16:9 Aspect Frame
				</div>
			</Lib.AspectRatio>
		</div>

	{:else if name === 'Sparkline'}
		<div class="f-demo-row" style="align-items: center; gap: 2rem;">
			<div style="display: flex; flex-direction: column; gap: 0.25rem;">
				<span style="font-size: 0.75rem; color: var(--f-text-muted);">Throughput</span>
				<Lib.Sparkline data={[15, 28, 22, 35, 48, 42, 60, 75]} width={140} height={36} color="var(--f-primary)" />
			</div>
			<div style="display: flex; flex-direction: column; gap: 0.25rem;">
				<span style="font-size: 0.75rem; color: var(--f-text-muted);">Latency</span>
				<Lib.Sparkline data={[65, 50, 48, 55, 30, 25, 20, 18]} width={140} height={36} color="var(--f-info)" />
			</div>
		</div>

	<!-- =================== LAYOUT =================== -->
	{:else if name === 'Card'}
		<div class="f-preview-column" style="max-width: 440px; width: 100%;">
			<div class="f-variants-title">Surface & Outline Variants</div>
			<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
				<Lib.Card title="Surface Card" description="Elevated container with standard border">
					Pure scoped CSS provides style encapsulation and fast SSR rendering.
				</Lib.Card>
				<Lib.Card variant="sunken" title="Sunken Card" description="Subtle recessed surface background">
					Ideal for secondary detail panels and form sections.
				</Lib.Card>
			</div>
		</div>

	{:else if name === 'SelectableCard'}
		<div style="max-width: 340px; width: 100%;">
			<Lib.SelectableCard title="Enterprise Cluster" description="High availability with 99.99% uptime guarantee." selected={true} />
		</div>

	{:else if name === 'ClickableCard'}
		<div style="max-width: 340px; width: 100%;">
			<Lib.ClickableCard title="Interactive Exploration" description="Hover for lift feedback and press for smooth scale." />
		</div>

	{:else if name === 'Container'}
		<div style="width: 100%; max-width: 500px; border: 1px dashed var(--f-border); padding: 1rem; border-radius: 8px;">
			<Lib.Container size="sm">
				<p style="margin: 0; text-align: center; color: var(--f-text-muted);">Constrained Container with fluid padding</p>
			</Lib.Container>
		</div>

	{:else if name === 'Stack'}
		<Lib.Stack gap="md">
			<Lib.Badge variant="primary">Stack Item 1</Lib.Badge>
			<Lib.Badge variant="surface">Stack Item 2</Lib.Badge>
			<Lib.Badge variant="outline">Stack Item 3</Lib.Badge>
		</Lib.Stack>

	{:else if name === 'Flex'}
		<div style="width: 100%; max-width: 400px;">
			<Lib.Flex gap="md" align="center" justify="between">
				<Lib.Badge variant="primary">Flex Start</Lib.Badge>
				<Lib.Badge variant="surface">Flex End</Lib.Badge>
			</Lib.Flex>
		</div>

	{:else if name === 'Grid'}
		<div style="width: 100%; max-width: 420px;">
			<Lib.Grid columns={2} gap="sm">
				<div style="padding: 1rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 6px; text-align: center;">Cell 1</div>
				<div style="padding: 1rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 6px; text-align: center;">Cell 2</div>
			</Lib.Grid>
		</div>

	{:else if name === 'BentoGrid' || name === 'BentoCell'}
		<div class="f-bento-preview-wrap">
			<Lib.BentoGrid columns={3} gap="md">
				<Lib.BentoCell colSpan={2} variant="surface" glow>
					<div style="padding: 1.5rem;">
						<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
							<span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--f-primary); letter-spacing: 0.05em;">Core Engine</span>
							<Lib.Badge variant="primary" dot>Production</Lib.Badge>
						</div>
						<h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; color: var(--f-text);">Primary Bento Module</h3>
						<p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--f-text-muted); line-height: 1.5;">
							Spans 2 columns dynamically with gradient border glow and token padding.
						</p>
						<div style="display: flex; gap: 1rem; align-items: center;">
							<Lib.Sparkline data={[12, 19, 25, 22, 38, 45, 60, 58, 75]} width={160} height={36} color="var(--f-primary)" />
							<span style="font-size: 0.8rem; font-weight: 600; color: var(--f-success);">+38.2% throughput</span>
						</div>
					</div>
				</Lib.BentoCell>

				<Lib.BentoCell colSpan={1} variant="raised">
					<div style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
						<div>
							<div style="font-size: 0.75rem; color: var(--f-text-muted); margin-bottom: 0.5rem;">Total Library</div>
							<div style="font-size: 2rem; font-weight: 800; color: var(--f-text); line-height: 1;">106+</div>
						</div>
						<div style="margin-top: 1rem;">
							<Lib.Progress value={85} size="sm" />
						</div>
					</div>
				</Lib.BentoCell>

				<Lib.BentoCell colSpan={1} variant="sunken">
					<div style="padding: 1.25rem;">
						<h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem; color: var(--f-text);">Auto-Sync Mode</h4>
						<p style="margin: 0 0 0.75rem 0; font-size: 0.8rem; color: var(--f-text-muted);">Real-time reactive state updates.</p>
						<Lib.Switch checked={true} size="sm" label="Enabled" />
					</div>
				</Lib.BentoCell>

				<Lib.BentoCell colSpan={2} variant="surface">
					<div style="padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
						<div>
							<h4 style="margin: 0 0 0.25rem 0; font-size: 0.95rem; color: var(--f-text);">Multi-Theme System</h4>
							<p style="margin: 0; font-size: 0.8rem; color: var(--f-text-muted);">Switch between Fractal, Pro UI, BeUI, Halaska & Cyber.</p>
						</div>
						<Lib.Badge variant="outline">5 Aesthetics</Lib.Badge>
					</div>
				</Lib.BentoCell>
			</Lib.BentoGrid>
		</div>

	{:else if name === 'Section'}
		<div style="width: 100%; max-width: 520px; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px;">
			<Lib.Section title="Design Engineering" subtitle="Foundations of modern reactive component architectures">
				<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Clean containment with semantic header hierarchy.</p>
			</Lib.Section>
		</div>

	{:else if name === 'Divider'}
		<div style="width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 1rem;">
			<Lib.Divider label="OR CONTINUE WITH" />
			<Lib.Divider />
		</div>

	{:else if name === 'SplitPane'}
		<div style="width: 100%; max-width: 540px; height: 220px; border: 1px solid var(--f-border); border-radius: 8px; overflow: hidden;">
			<Lib.SplitPane split={45}>
				{#snippet paneA()}
					<div style="padding: 1rem; background: var(--f-surface); height: 100%;">
						<h5 style="margin: 0 0 0.5rem 0;">Pane A (Code)</h5>
						<code style="font-size: 0.75rem; color: var(--f-primary);">const state = $state(0);</code>
					</div>
				{/snippet}
				{#snippet paneB()}
					<div style="padding: 1rem; background: var(--f-sunken); height: 100%;">
						<h5 style="margin: 0 0 0.5rem 0;">Pane B (Output)</h5>
						<p style="margin: 0; font-size: 0.8rem; color: var(--f-text-muted);">Drag the middle divider bar to resize panes.</p>
					</div>
				{/snippet}
			</Lib.SplitPane>
		</div>

	{:else if name === 'DataTable'}
		<div style="width: 100%; max-width: 600px;">
			<Lib.DataTable columns={sampleTableCols} rows={sampleTableRows} />
		</div>

	<!-- =================== NAVIGATION =================== -->
	{:else if name === 'AppShell'}
		<div style="width: 100%; max-width: 640px; height: 300px; border: 1px solid var(--f-border); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
			<div style="height: 44px; background: var(--f-surface); border-bottom: 1px solid var(--f-border); display: flex; align-items: center; justify-content: space-between; padding: 0 1rem;">
				<div style="font-weight: 700; font-size: 0.9rem; color: var(--f-primary);">AppShell Demo</div>
				<Lib.Button size="xs" variant="outline" onclick={() => appShellCollapsed = !appShellCollapsed}>
					{appShellCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
				</Lib.Button>
			</div>
			<div style="flex: 1; display: flex; overflow: hidden;">
				<div style="width: {appShellCollapsed ? '54px' : '150px'}; transition: width 0.2s ease; background: var(--f-sunken); border-right: 1px solid var(--f-border); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
					<div style="padding: 0.4rem; border-radius: 4px; background: var(--f-primary-subtle); color: var(--f-primary); font-size: 0.8rem; font-weight: 600; text-align: center;">
						{appShellCollapsed ? '📊' : '📊 Analytics'}
					</div>
					<div style="padding: 0.4rem; border-radius: 4px; font-size: 0.8rem; color: var(--f-text-muted); text-align: center;">
						{appShellCollapsed ? '⚙️' : '⚙️ Settings'}
					</div>
				</div>
				<div style="flex: 1; padding: 1.25rem; background: var(--f-bg); overflow-y: auto;">
					<h4 style="margin: 0 0 0.5rem 0;">Main Content Viewport</h4>
					<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">
						AppShell provides layout synchronization across sticky headers, collapsible sidebars, and nested routes.
					</p>
				</div>
			</div>
		</div>

	{:else if name === 'Header'}
		<div style="width: 100%; max-width: 640px; border: 1px solid var(--f-border); border-radius: 8px; overflow: hidden;">
			<Lib.Header>
				{#snippet brand()}
					<div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--f-primary);">
						<div style="width: 22px; height: 22px; border-radius: 6px; background: var(--f-primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">F</div>
						<span>FractalUI</span>
					</div>
				{/snippet}
				{#snippet center()}
					<div style="width: 180px;">
						<Lib.SearchInput placeholder="Quick search..." />
					</div>
				{/snippet}
				{#snippet actions()}
					<div style="display: flex; align-items: center; gap: 0.5rem;">
						<Lib.Button size="xs" variant="ghost">Docs</Lib.Button>
						<Lib.Button size="xs" variant="primary">Deploy</Lib.Button>
					</div>
				{/snippet}
			</Lib.Header>
		</div>

	{:else if name === 'TopNav'}
		<div style="width: 100%; max-width: 540px; padding: 0.5rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px;">
			<Lib.TopNav
				items={[
					{ id: 'all', label: 'All Components' },
					{ id: 'popular', label: 'Popular' },
					{ id: 'motion', label: 'Motion' },
					{ id: 'blocks', label: 'UI Blocks' }
				]}
				bind:activeId={topNavActive}
			/>
		</div>

	{:else if name === 'SideNav'}
		<div style="width: 220px; height: 280px; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px; overflow: hidden;">
			<Lib.SideNav
				items={[
					{ id: 'intro', label: 'Introduction', group: 'Getting Started' },
					{ id: 'tokens', label: 'Tokens CSS', group: 'Getting Started' },
					{ id: 'actions', label: 'Actions', group: 'Components', badge: '8' },
					{ id: 'forms', label: 'Forms', group: 'Components', badge: '16' },
					{ id: 'motion', label: 'Motion', group: 'Components', badge: '13' }
				]}
				bind:activeId={sideNavActive}
			/>
		</div>

	{:else if name === 'BottomNav'}
		<div style="width: 100%; max-width: 360px; border: 1px solid var(--f-border); border-radius: 16px; overflow: hidden; background: var(--f-surface); box-shadow: var(--f-shadow-md);">
			<div style="padding: 1.5rem; text-align: center;">
				<h4 style="margin: 0 0 0.25rem 0;">Mobile Navigation Bar</h4>
				<p style="margin: 0; font-size: 0.8rem; color: var(--f-text-muted);">Active: <strong>{bottomNavActive}</strong></p>
			</div>
			<Lib.BottomNav
				items={[
					{ id: 'home', label: 'Home' },
					{ id: 'search', label: 'Search' },
					{ id: 'activity', label: 'Activity', badge: '4' },
					{ id: 'profile', label: 'Profile' }
				]}
				bind:activeId={bottomNavActive}
			/>
		</div>

	{:else if name === 'MobileNav'}
		<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
			<Lib.Button variant="primary" onclick={() => mobileNavOpen = true}>
				Open Mobile Navigation Drawer
			</Lib.Button>
			<Lib.MobileNav
				bind:open={mobileNavOpen}
				title="Fractal Navigation"
			>
				<div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem;">
					<a href="/" style="color: var(--f-primary); text-decoration: none; font-weight: 600;">Overview</a>
					<a href="/components/Button" style="color: var(--f-text); text-decoration: none;">Components</a>
					<a href="#tokens" style="color: var(--f-text); text-decoration: none;">Tokens</a>
					<a href="#themes" style="color: var(--f-text); text-decoration: none;">Themes</a>
				</div>
			</Lib.MobileNav>
		</div>

	{:else if name === 'Breadcrumb'}
		<Lib.Breadcrumb items={breadcrumbItems} />

	{:else if name === 'Pagination'}
		<Lib.Pagination totalPages={10} bind:currentPage={currentPage} />

	{:else if name === 'Stepper'}
		<div style="width: 100%; max-width: 500px;">
			<Lib.Stepper steps={stepperSteps} currentStep={currentStep} />
			<div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem;">
				<Lib.Button size="xs" variant="outline" disabled={currentStep <= 0} onclick={() => currentStep--}>Previous</Lib.Button>
				<Lib.Button size="xs" variant="primary" disabled={currentStep >= stepperSteps.length - 1} onclick={() => currentStep++}>Next Step</Lib.Button>
			</div>
		</div>

	{:else if name === 'Tabs'}
		<div style="width: 100%; max-width: 480px;">
			<Lib.Tabs tabs={tabsData} bind:activeTab={activeTab}>
				<div style="padding: 1.25rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px; margin-top: 0.5rem;">
					<p style="margin: 0; color: var(--f-text);">Active View: <strong>{activeTab}</strong></p>
				</div>
			</Lib.Tabs>
		</div>

	{:else if name === 'SegmentedControl'}
		<Lib.SegmentedControl
			options={[
				{ label: 'Day', value: 'day' },
				{ label: 'Week', value: 'week' },
				{ label: 'Month', value: 'month' },
				{ label: 'Year', value: 'year' }
			]}
			bind:value={segmentedValue}
		/>

	{:else if name === 'TreeList'}
		<div style="width: 240px; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px; padding: 0.75rem;">
			<Lib.TreeList items={treeItems} />
		</div>

	<!-- =================== OVERLAYS =================== -->
	{:else if name === 'Dialog'}
		<div>
			<Lib.Button variant="primary" onclick={() => dialogOpen = true}>Trigger Modal Dialog</Lib.Button>
			<Lib.Dialog bind:open={dialogOpen} title="Svelte 5 Dialog" description="Accessible modal window with backdrop click and escape key support.">
				<p style="color: var(--f-text); font-size: 0.9rem;">This dialog was opened via reactive $bindable(open) rune state.</p>
				<div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
					<Lib.Button variant="secondary" onclick={() => dialogOpen = false}>Close</Lib.Button>
				</div>
			</Lib.Dialog>
		</div>

	{:else if name === 'AlertDialog'}
		<div>
			<Lib.Button variant="destructive" onclick={() => alertDialogOpen = true}>Delete Repository</Lib.Button>
			<Lib.AlertDialog
				bind:open={alertDialogOpen}
				title="Confirm Deletion"
				description="Are you absolutely sure? This action cannot be reversed."
				confirmText="Yes, delete it"
				confirmVariant="destructive"
				onconfirm={() => alertDialogOpen = false}
			/>
		</div>

	{:else if name === 'Drawer'}
		<div>
			<Lib.Button variant="outline" onclick={() => drawerOpen = true}>Open Side Drawer</Lib.Button>
			<Lib.Drawer bind:open={drawerOpen} placement="right" title="Drawer Panel">
				<p style="color: var(--f-text); font-size: 0.9rem;">Slide-over navigation or details drawer.</p>
			</Lib.Drawer>
		</div>

	{:else if name === 'Popover'}
		<Lib.Popover bind:open={popoverOpen}>
			{#snippet trigger({ toggle })}
				<Lib.Button variant="soft" onclick={toggle}>Toggle Popover</Lib.Button>
			{/snippet}
			<div style="padding: 1rem; width: 220px;">
				<h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">Popover Content</h4>
				<p style="margin: 0; font-size: 0.8rem; color: var(--f-text-muted);">Positioned anchored floating element with z-index: var(--f-z-popover).</p>
			</div>
		</Lib.Popover>

	{:else if name === 'Tooltip'}
		<div class="f-demo-row">
			<Lib.Tooltip content="Helpful contextual tooltip" placement="top">
				<Lib.Button variant="secondary">Hover Top</Lib.Button>
			</Lib.Tooltip>
			<Lib.Tooltip content="Bottom positioned tooltip" placement="bottom">
				<Lib.Button variant="outline">Hover Bottom</Lib.Button>
			</Lib.Tooltip>
		</div>

	{:else if name === 'DropdownMenu'}
		<Lib.DropdownMenu
			items={[
				{ id: 'edit', label: 'Edit Project' },
				{ id: 'duplicate', label: 'Duplicate Entry' },
				{ id: 'delete', label: 'Delete Item', danger: true }
			]}
		>
			{#snippet trigger({ toggle })}
				<Lib.Button variant="outline" onclick={toggle}>Open Menu ▾</Lib.Button>
			{/snippet}
		</Lib.DropdownMenu>

	{:else if name === 'CommandPalette'}
		<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
			<Lib.Button variant="primary" size="lg" onclick={() => commandPaletteOpen = true}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
				Open Command Palette (⌘K)
			</Lib.Button>
			<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">
				Press <Lib.Kbd>⌘</Lib.Kbd> <Lib.Kbd>K</Lib.Kbd> anywhere or click the button above to launch.
			</p>
			<Lib.CommandPalette
				bind:open={commandPaletteOpen}
				groups={commandPaletteGroups}
				placeholder="Type a command or search components..."
				onselect={() => commandPaletteOpen = false}
			/>
		</div>

	{:else if name === 'Toast' || name === 'ToastStack'}
		<div class="f-preview-column">
			<div class="f-demo-row">
				<Lib.Button size="sm" variant="primary" onclick={() => triggerToast('info')}>Toast Info</Lib.Button>
				<Lib.Button size="sm" variant="secondary" onclick={() => triggerToast('success')}>Toast Success</Lib.Button>
				<Lib.Button size="sm" variant="soft" onclick={() => triggerToast('warning')}>Toast Warning</Lib.Button>
				<Lib.Button size="sm" variant="destructive" onclick={() => triggerToast('danger')}>Toast Danger</Lib.Button>
			</div>
			<div style="font-size: 0.85rem; color: var(--f-text-muted); text-align: center;">
				Click buttons to spawn stacked toast alerts with auto-dismiss timers and progress bars.
			</div>
			<Lib.ToastStack bind:toasts={activeToasts} position="bottom-right" />
		</div>

	{:else if name === 'ContextMenu'}
		<Lib.ContextMenu
			items={[
				{ id: 'inspect', label: 'Inspect Component' },
				{ id: 'copy', label: 'Copy Svelte Import', shortcut: '⌘C' },
				{ id: 'source', label: 'View Source Code' },
				{ id: 'sep', label: '', separator: true },
				{ id: 'delete', label: 'Remove Node', danger: true }
			]}
		>
			<div style="width: 100%; max-width: 440px; padding: 2.5rem 1.5rem; background: var(--f-surface); border: 2px dashed var(--f-border); border-radius: 8px; text-align: center; cursor: context-menu;">
				<h4 style="margin: 0 0 0.5rem 0; color: var(--f-text);">Right-Click Anywhere Inside Here</h4>
				<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">
					Triggers anchored context menu with keyboard shortcuts and items.
				</p>
			</div>
		</Lib.ContextMenu>

	<!-- =================== TYPOGRAPHY =================== -->
	{:else if name === 'Heading'}
		<div style="display: flex; flex-direction: column; gap: 0.5rem;">
			<Lib.Heading level={2}>H2 Primary Heading</Lib.Heading>
			<Lib.Heading level={3} gradient>H3 Gradient Accent Heading</Lib.Heading>
			<Lib.Heading level={4}>H4 Section Title</Lib.Heading>
		</div>

	{:else if name === 'Text'}
		<div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 440px;">
			<Lib.Text variant="lead">Lead paragraph introducing the design system foundation.</Lib.Text>
			<Lib.Text variant="body">Regular body text rendered with balanced typography tracking and token colors.</Lib.Text>
			<Lib.Text variant="muted">Muted secondary annotation text.</Lib.Text>
		</div>

	{:else if name === 'Code'}
		<Lib.Text>
			Install the package using <Lib.Code>pnpm add @fractaldesign/fractalsvelte-ui</Lib.Code> to get started.
		</Lib.Text>

	{:else if name === 'CodeBlock'}
		<div style="width: 100%; max-width: 480px;">
			<Lib.CodeBlock code={`import { Button, Card3D } from '@fractaldesign/fractalsvelte-ui';\n\n<Button variant="primary">Launch</Button>`} language="svelte" />
		</div>

	{:else if name === 'Blockquote'}
		<div style="max-width: 460px;">
			<Lib.Blockquote author="Rich Harris" citation="Creator of Svelte">
				Svelte 5 runes bring fine-grained reactivity directly into the language, making state synchronization effortless and explicit.
			</Lib.Blockquote>
		</div>

	{:else if name === 'Accordion'}
		<div style="width: 100%; max-width: 480px;">
			<Lib.Accordion items={[
				{ id: '1', title: 'Why zero Tailwind?', content: 'Pure scoped CSS provides zero build overhead, 100% style isolation, and instant runtime theme switching via custom properties.' },
				{ id: '2', title: 'How does the AST doc pipeline work?', content: 'A TypeScript AST scanner extracts props, types, and defaults with zero human maintenance, verified by a strict drift gate.' },
				{ id: '3', title: 'Can I use this with SvelteKit 3?', content: 'Yes! Fractal UI is engineered specifically for SvelteKit 3 with full SSR and static generation compatibility.' }
			]} />
		</div>

	{:else if name === 'Collapsible'}
		<div style="width: 100%; max-width: 440px;">
			<Lib.Collapsible title="Click to reveal details">
				<p style="padding: 1rem; margin: 0; background: var(--f-surface); border-radius: 6px; font-size: 0.9rem; color: var(--f-text-muted);">
					Smooth height animation reveals nested content cleanly.
				</p>
			</Lib.Collapsible>
		</div>

	<!-- =================== MOTION =================== -->
	{:else if name === 'AnimatedButton'}
		<div class="f-preview-column">
			<div class="f-demo-row">
				<Lib.AnimatedButton variant="primary" onclick={() => animatedClickCount++}>
					Spring Bounce & Ripple
				</Lib.AnimatedButton>
				<Lib.AnimatedButton variant="secondary" shape="pill" onclick={() => animatedClickCount++}>
					Pill Spring
				</Lib.AnimatedButton>
				<Lib.AnimatedButton variant="destructive" onclick={() => animatedClickCount++}>
					Destructive Micro-Scale
				</Lib.AnimatedButton>
			</div>
			<div style="font-size: 0.85rem; color: var(--f-text-muted); text-align: center;">
				Press and click buttons to observe tactile spring scaling and ripple wave. Clicks: <Lib.Badge variant="primary">{animatedClickCount}</Lib.Badge>
			</div>
		</div>

	{:else if name === 'MagneticButton'}
		<div class="f-preview-column">
			<div class="f-demo-row">
				<Lib.MagneticButton variant="primary" strength={0.4} range={120} onclick={() => magneticClickCount++}>
					Magnetic Button
				</Lib.MagneticButton>
				<Lib.MagneticButton variant="secondary" shape="pill" strength={0.3} range={100} onclick={() => magneticClickCount++}>
					Pill Magnet
				</Lib.MagneticButton>
			</div>
			<div style="font-size: 0.85rem; color: var(--f-text-muted); text-align: center;">
				Move your cursor within 120px of the button to see the magnetic pull. Clicks: <strong>{magneticClickCount}</strong>
			</div>
		</div>

	{:else if name === 'BorderBeam'}
		<div style="position: relative; width: 280px; padding: 2rem 1.5rem; background: var(--f-surface); border-radius: 12px; border: 1px solid var(--f-border); overflow: hidden; text-align: center;">
			<Lib.BorderBeam size={180} duration={8} />
			<h4 style="margin: 0 0 0.5rem 0; color: var(--f-text);">Border Beam Active</h4>
			<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Continuous rotating luminous perimeter ray.</p>
		</div>

	{:else if name === 'ConfettiBurst'}
		<div style="position: relative; width: 320px; height: 180px; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;">
			<Lib.ConfettiBurst bind:this={confettiRef} />
			<Lib.Button variant="primary" onclick={() => confettiRef?.burst()}>
				🎉 Trigger Confetti
			</Lib.Button>
			<span style="font-size: 0.75rem; color: var(--f-text-muted);">Click to trigger physics particle explosion</span>
		</div>

	{:else if name === 'AnimatedCard'}
		<div style="width: 300px;">
			<Lib.AnimatedCard>
				<h4 style="margin: 0 0 0.5rem 0; color: var(--f-text);">Hover Elevation</h4>
				<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Subtle elevation translation with glow border.</p>
			</Lib.AnimatedCard>
		</div>

	{:else if name === 'Card3D'}
		<div style="width: 300px;">
			<Lib.Card3D>
				<div style="padding: 2rem 1.5rem; text-align: center;">
					<h4 style="margin: 0 0 0.5rem 0; color: var(--f-text);">3D Gyro Tilt</h4>
					<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Move your cursor over this card to watch dynamic 3D perspective tracking.</p>
				</div>
			</Lib.Card3D>
		</div>

	{:else if name === 'GlowCard'}
		<div style="width: 300px;">
			<Lib.GlowCard glowColor="rgba(99, 102, 241, 0.4)">
				<div style="padding: 1.5rem;">
					<h4 style="margin: 0 0 0.5rem 0; color: var(--f-text);">Radial Spotlight</h4>
					<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Border glows according to pointer coordinates.</p>
				</div>
			</Lib.GlowCard>
		</div>

	{:else if name === 'ShimmerEffect'}
		<div style="width: 100%; max-width: 440px;">
			<Lib.ShimmerEffect duration={2.5}>
				<div style="padding: 1.5rem 2rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px;">
					<h4 style="margin: 0 0 0.5rem 0; color: var(--f-text);">Shimmer Light Sweep</h4>
					<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Continuous linear light sweep across child elements.</p>
				</div>
			</Lib.ShimmerEffect>
		</div>

	{:else if name === 'Marquee'}
		<div style="width: 100%; max-width: 500px; overflow: hidden; border: 1px solid var(--f-border); border-radius: 8px; padding: 0.75rem 0;">
			<Lib.Marquee speed={25}>
				<span style="margin: 0 1.5rem; font-weight: 600; color: var(--f-primary);">SVELTE 5 RUNES</span>
				<span style="margin: 0 1.5rem; font-weight: 600; color: var(--f-text);">ZERO TAILWIND</span>
				<span style="margin: 0 1.5rem; font-weight: 600; color: var(--f-success);">PURE DESIGN TOKENS</span>
				<span style="margin: 0 1.5rem; font-weight: 600; color: var(--f-info);">106 COMPONENTS</span>
			</Lib.Marquee>
		</div>

	{:else if name === 'TextScramble'}
		<div class="f-preview-column">
			<div style="font-size: 1.5rem; font-family: var(--f-font-mono); font-weight: 700; color: var(--f-primary); min-height: 2.5rem; display: flex; align-items: center; justify-content: center;">
				<Lib.TextScramble text={scrambleTarget} trigger="mount" />
			</div>
			<div class="f-demo-row">
				<Lib.Button size="sm" variant="outline" onclick={() => scrambleTarget = scrambleTarget === 'QUANTUM RUNES ONLINE' ? 'SYSTEM PROTOCOL VERIFIED' : 'QUANTUM RUNES ONLINE'}>
					Re-Scramble Text
				</Lib.Button>
			</div>
		</div>

	{:else if name === 'RippleEffect'}
		<Lib.RippleEffect color="rgba(16, 185, 129, 0.35)">
			<div style="padding: 1.5rem 2.5rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: 8px; text-align: center;">
				<h4 style="margin: 0 0 0.25rem 0;">Click for Origin Ripple</h4>
				<p style="margin: 0; font-size: 0.8rem; color: var(--f-text-muted);">Dynamic radial wave expands from cursor origin</p>
			</div>
		</Lib.RippleEffect>

	{:else if name === 'FloatingBadge'}
		<Lib.FloatingBadge variant="primary" pulse>
			Subtle Breathing Motion
		</Lib.FloatingBadge>

	{:else if name === 'CanvasMotion'}
		<div style="width: 100%; max-width: 520px; height: 240px; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid var(--f-border);">
			<Lib.CanvasMotion particleCount={50} particleColor="rgba(16, 185, 129, 0.7)" lineColor="rgba(16, 185, 129, 0.2)" />
			<div style="position: absolute; bottom: 10px; left: 12px; pointer-events: none; font-size: 0.75rem; color: var(--f-text-muted); background: var(--f-surface); padding: 3px 6px; border-radius: 4px; border: 1px solid var(--f-border);">
				Hover or move pointer to interact with constellation
			</div>
		</div>

	<!-- =================== BLOCKS =================== -->
	{:else if name === 'WorkflowNode'}
		<div style="width: 300px;">
			<Lib.WorkflowNode
				title="AST Scanner Node"
				subtitle="TypeScript Compiler API"
				status="idle"
				inputs={[{ id: 'i1', label: 'Svelte Source' }]}
				outputs={[{ id: 'o1', label: 'manifest.json' }]}
			/>
		</div>

	{:else if name === 'FlowCanvas'}
		<div style="width: 100%; max-width: 600px; height: 300px; border: 1px solid var(--f-border); border-radius: 8px; overflow: hidden; position: relative;">
			<Lib.FlowCanvas>
				<div style="position: absolute; left: 50px; top: 40px;">
					<Lib.WorkflowNode title="Input Node" subtitle="Trigger Event" status="success" />
				</div>
				<div style="position: absolute; left: 320px; top: 90px;">
					<Lib.WorkflowNode title="Output Node" subtitle="State Pipeline" status="idle" />
				</div>
			</Lib.FlowCanvas>
		</div>

	{:else if name === 'HeroBlock'}
		<div style="width: 100%; max-width: 540px;">
			<Lib.HeroBlock
				badge="Component Library"
				title="Modern Svelte 5 Runes"
				description="High-performance, zero-Tailwind UI blocks designed for enterprise SvelteKit applications."
			/>
		</div>

	{:else if name === 'PricingCard'}
		<div style="width: 300px;">
			<Lib.PricingCard
				tier="Pro Team"
				price="$49"
				interval="/month"
				description="For production engineering teams"
				popular={true}
				features={[
					'All 106 components',
					'AST-verified documentation',
					'Commercial license',
					'Direct Slack channel'
				]}
				ctaText="Upgrade to Pro"
			/>
		</div>

	{:else if name === 'FeatureGrid'}
		<div style="width: 100%; max-width: 620px;">
			<Lib.FeatureGrid
				columns={3}
				items={[
					{ title: 'Svelte 5 Runes', description: 'Engineered entirely with $state, $derived, and snippets.', badge: 'v5.57' },
					{ title: 'Zero Tailwind', description: 'Pure scoped CSS with light and dark mode design tokens.', badge: 'Scoped' },
					{ title: 'AST Doc Gate', description: 'Zero maintenance API reference verified by automated check.', badge: 'Zero Drift' }
				]}
			/>
		</div>

	{:else if name === 'TerminalBlock'}
		<div style="width: 100%; max-width: 480px;">
			<Lib.TerminalBlock
				title="bash — 80x24"
				lines={[
					{ command: 'pnpm create svelte@latest my-app' },
					{ command: 'pnpm add @fractaldesign/fractalsvelte-ui' },
					{ output: 'Documentation gate PASSED (106 components verified).' }
				]}
			/>
		</div>

	{:else if name === 'ChatBubble'}
		<div style="width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 0.75rem;">
			<Lib.ChatBubble
				message="Can I use this component library without installing Tailwind CSS?"
				role="user"
				timestamp="10:42 AM"
			/>
			<Lib.ChatBubble
				message="Absolutely. Every component uses 100% scoped CSS variables and pure data attributes."
				role="assistant"
				timestamp="10:43 AM"
			/>
		</div>

	{:else if name === 'Timeline'}
		<div style="max-width: 380px;">
			<Lib.Timeline
				items={[
					{ title: 'Project Initialized', time: 'Phase 1', description: 'Tokens and types established' },
					{ title: '106 Components Built', time: 'Phase 2', description: 'Svelte 5 runes implemented' },
					{ title: 'Documentation Gate', time: 'Phase 3', description: 'Zero drift verification passed' }
				]}
			/>
		</div>

	{:else if name === 'BeforeAfter'}
		<div style="width: 100%; max-width: 500px;">
			<Lib.BeforeAfter bind:position={beforeAfterPos} beforeLabel="Default Theme" afterLabel="Pro UI Theme">
				{#snippet before()}
					<div style="padding: 2rem; background: #0c0c0e; color: #10b981; font-weight: 700; font-size: 1.25rem;">
						Fractal Emerald Aesthetic
					</div>
				{/snippet}
				{#snippet after()}
					<div style="padding: 2rem; background: #090a0f; color: #6366f1; font-weight: 700; font-size: 1.25rem;">
						Pro Indigo Aesthetic
					</div>
				{/snippet}
			</Lib.BeforeAfter>
		</div>

	{:else if name === 'SlideUnlock'}
		<div class="f-preview-column">
			<Lib.SlideUnlock
				bind:unlocked={slideUnlocked}
				label="Slide to confirm"
				successLabel="Action confirmed!"
			/>
			<div class="f-demo-row">
				<Lib.Button size="sm" variant="outline" onclick={() => (slideUnlocked = false)}>
					Reset Slider
				</Lib.Button>
				<Lib.Badge variant={slideUnlocked ? 'success' : 'outline'}>
					{slideUnlocked ? 'State: Unlocked' : 'State: Locked'}
				</Lib.Badge>
			</div>
		</div>

	{:else if name === 'RotaryDial'}
		<div class="f-demo-row" style="gap: 2rem;">
			<Lib.RotaryDial bind:value={rotaryVal} size="sm" label="Gain" unit="dB" />
			<Lib.RotaryDial bind:value={rotaryVal} size="md" label="Volume" unit="%" />
			<Lib.RotaryDial bind:value={rotaryVal} size="lg" label="Frequency" unit="Hz" />
		</div>

	{:else if name === 'EqualizerBars'}
		<div class="f-preview-column">
			<div class="f-demo-row" style="gap: 2.5rem; align-items: flex-end;">
				<Lib.EqualizerBars bars={5} size="sm" playing={eqPlaying} intent="primary" />
				<Lib.EqualizerBars bars={8} size="md" playing={eqPlaying} intent="success" />
				<Lib.EqualizerBars bars={12} size="lg" playing={eqPlaying} intent="warning" />
			</div>
			<div class="f-demo-row">
				<Lib.Button size="sm" variant="outline" onclick={() => (eqPlaying = !eqPlaying)}>
					{eqPlaying ? 'Pause Equalizer' : 'Play Equalizer'}
				</Lib.Button>
			</div>
		</div>

	{:else if name === 'LidarSweep'}
		<div class="f-demo-row" style="gap: 2rem;">
			<Lib.LidarSweep mode="radar" label="RADAR TRACKING" intent="primary" />
			<Lib.LidarSweep mode="linear" label="TERRAIN LIDAR" intent="success" />
		</div>

	{:else if name === 'DotMatrix'}
		<div class="f-preview-column">
			<div class="f-demo-row" style="gap: 1.5rem;">
				<Lib.DotMatrix text={dotText} color="green" glow />
				<Lib.DotMatrix text="12:45" color="amber" glow />
				<Lib.DotMatrix text="LIVE" color="cyan" glow />
			</div>
			<div class="f-demo-row">
				<Lib.Button size="sm" variant="outline" onclick={() => (dotText = dotText === 'READY' ? 'ONLINE' : 'READY')}>
					Cycle Text
				</Lib.Button>
			</div>
		</div>

	{:else if name === 'SizeReadout'}
		<div class="f-preview-column">
			<div class="f-demo-row" style="gap: 1rem;">
				<Lib.SizeReadout width={384} height={216} label="FRAME 1" />
				<Lib.SizeReadout width={1920} height={1080} copied="PNG" />
				<Lib.SizeReadout width={640} height={480} count={4} />
			</div>
		</div>

	{:else if name === 'MorphingTabs'}
		<div class="f-preview-column">
			<Lib.MorphingTabs
				bind:value={morphTabVal}
				items={[
					{ id: 'tab1', label: 'All Projects', badge: '12' },
					{ id: 'tab2', label: 'Active Tasks', badge: '5' },
					{ id: 'tab3', label: 'Deployment Logs' },
					{ id: 'tab4', label: 'Archive' }
				]}
			/>
			<div class="f-demo-row">
				<Lib.Badge variant="primary">Active Tab: {morphTabVal}</Lib.Badge>
			</div>
		</div>

	{:else if name === 'CenterMorphModal'}
		<div class="f-preview-column">
			<Lib.CenterMorphModal
				bind:open={morphModalOpen}
				triggerLabel="Open Morph Modal"
				title="Fluid Expanding Dialog"
				description="Scales and morphs smoothly with spring physics from origin."
			>
				{#snippet children({ close })}
					<p style="margin: 0 0 1rem 0; color: var(--f-text-muted);">
						This modal window animates fluidly into the center of the viewport with backdrop blur and escape key dismissal.
					</p>
					<div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
						<Lib.Button variant="outline" onclick={close}>Cancel</Lib.Button>
						<Lib.Button variant="primary" onclick={close}>Accept</Lib.Button>
					</div>
				{/snippet}
			</Lib.CenterMorphModal>
		</div>

	{:else if name === 'Dock'}
		<div class="f-preview-column">
			<Lib.Dock
				items={[
					{ id: '1', label: 'Finder', onclick: () => (dockClicked = 'Finder') },
					{ id: '2', label: 'Terminal', onclick: () => (dockClicked = 'Terminal') },
					{ id: '3', label: 'Code Editor', onclick: () => (dockClicked = 'Code Editor') },
					{ id: '4', label: 'Browser', onclick: () => (dockClicked = 'Browser') },
					{ id: '5', label: 'Settings', onclick: () => (dockClicked = 'Settings') }
				]}
			/>
			<div class="f-demo-row">
				<Lib.Badge variant="primary">Last Clicked: {dockClicked}</Lib.Badge>
			</div>
		</div>

	{:else if name === 'CardStack'}
		<div class="f-preview-column">
			<Lib.CardStack
				bind:activeIndex={cardStackIdx}
				items={[
					{ id: 'c1', badge: 'PROPRIETARY', title: 'Quantum Runes Engine', description: 'Zero-overhead reactive primitives natively compiled by Svelte 5.' },
					{ id: 'c2', badge: 'ZERO DEPS', title: 'Pure Web Animations', description: 'Fluid spring physics and transitions without GSAP or Motion bloat.' },
					{ id: 'c3', badge: 'TOKEN SCALE', title: 'Precision Theming', description: 'Instantaneous style pivoting across 5 enterprise design system looks.' },
					{ id: 'c4', badge: 'ZERO DRIFT', title: 'AST Manifest Gate', description: 'Continuous documentation synchronization directly from AST source.' }
				]}
			/>
		</div>

	{:else if name === 'Counter'}
		<div class="f-preview-column">
			<div class="f-demo-row" style="gap: 3rem; align-items: baseline;">
				<Lib.Counter value={counterVal} prefix="$" size="lg" />
				<Lib.Counter value={Math.round(counterVal * 1.5)} suffix=" req/s" size="md" />
			</div>
			<div class="f-demo-row">
				<Lib.Button size="sm" variant="outline" onclick={() => (counterVal = Math.floor(Math.random() * 9000) + 1000)}>
					Randomize Counter
				</Lib.Button>
				<Lib.Button size="sm" variant="primary" onclick={() => (counterVal += 100)}>
					+100
				</Lib.Button>
			</div>
		</div>

	{:else if name === 'ClickSpark'}
		<div class="f-preview-column">
			<Lib.ClickSpark sparkCount={12} sparkRadius={28} sparkSize={12}>
				<div style="padding: 2.5rem 3.5rem; background: var(--f-surface); border: 2px dashed var(--f-primary); border-radius: var(--f-radius-xl); cursor: pointer; text-align: center;">
					<h4 style="margin: 0 0 0.5rem 0;">Click Anywhere Inside</h4>
					<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">
						Sparks radiate outward from exact pointer click coordinates.
					</p>
				</div>
			</Lib.ClickSpark>
		</div>

	{:else if name === 'MagnetLines'}
		<div class="f-preview-column">
			<Lib.MagnetLines rows={7} columns={7} />
			<span style="font-size: 0.8rem; color: var(--f-text-muted);">Move cursor across the grid to deflect vector lines.</span>
		</div>

	{:else if name === 'SpotlightCard'}
		<div class="f-demo-row" style="gap: 1.5rem;">
			<Lib.SpotlightCard style="max-width: 320px;">
				<Lib.Badge variant="primary">SPOTLIGHT</Lib.Badge>
				<h4 style="margin: 0.75rem 0 0.5rem 0;">Flashlight Cursor</h4>
				<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted); line-height: 1.5;">
					Dynamic radial illumination follows cursor coordinates across the surface and border.
				</p>
			</Lib.SpotlightCard>
		</div>

	{:else if name === 'SplitReveal'}
		<div style="width: 100%; max-width: 500px;">
			<Lib.SplitReveal bind:revealed={splitRevealed} label="HOVER OR CLICK TO SPLIT">
				{#snippet revealedContent()}
					<div style="text-align: center;">
						<Lib.Badge variant="success">REVEALED</Lib.Badge>
						<h4 style="margin: 0.5rem 0; color: var(--f-primary);">Hidden Content Unveiled</h4>
						<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Dual shutters slide outward with spring easing.</p>
					</div>
				{/snippet}
			</Lib.SplitReveal>
		</div>

	{:else if name === 'StaggerList'}
		<div style="width: 100%; max-width: 420px;">
			<Lib.StaggerList items={staggerItems}>
				{#snippet itemSnippet({ item })}
					<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--f-surface); border: 1px solid var(--f-border); border-radius: var(--f-radius-md);">
						<div>
							<div style="font-weight: 600; font-size: 0.9rem;">{item.title}</div>
							<div style="font-size: 0.75rem; color: var(--f-text-muted);">{item.latency}</div>
						</div>
						<Lib.Badge variant="success">{item.status}</Lib.Badge>
					</div>
				{/snippet}
			</Lib.StaggerList>
		</div>

	{:else if name === 'RouteTransition'}
		<div class="f-preview-column" style="width: 100%; max-width: 480px;">
			<div class="f-demo-row" style="gap: 0.5rem; justify-content: center;">
				<Lib.Button size="sm" variant={routeTransitionType === 'drill' ? 'primary' : 'outline'} onclick={() => (routeTransitionType = 'drill')}>
					Drill
				</Lib.Button>
				<Lib.Button size="sm" variant={routeTransitionType === 'sheet' ? 'primary' : 'outline'} onclick={() => (routeTransitionType = 'sheet')}>
					Sheet
				</Lib.Button>
				<Lib.Button size="sm" variant={routeTransitionType === 'zoom' ? 'primary' : 'outline'} onclick={() => (routeTransitionType = 'zoom')}>
					Zoom
				</Lib.Button>
				<Lib.Button size="sm" variant={routeTransitionType === 'fade' ? 'primary' : 'outline'} onclick={() => (routeTransitionType = 'fade')}>
					Fade
				</Lib.Button>
			</div>

			<div style="width: 100%; height: 200px; border: 1px solid var(--f-border); border-radius: var(--f-radius-xl); overflow: hidden; background: var(--f-surface); box-shadow: var(--f-shadow-lg);">
				<Lib.RouteTransition key={routeScreen} type={routeTransitionType}>
					{#if routeScreen === 1}
						<div style="padding: 1.5rem; height: 100%; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
							<div>
								<Lib.Badge variant="primary">SCREEN 1</Lib.Badge>
								<h4 style="margin: 0.5rem 0 0.25rem 0;">Analytics Dashboard</h4>
								<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Real-time performance metrics and event logs.</p>
							</div>
							<Lib.Button size="sm" variant="primary" onclick={() => (routeScreen = 2)}>
								Next Screen →
							</Lib.Button>
						</div>
					{:else if routeScreen === 2}
						<div style="padding: 1.5rem; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background: var(--f-surface-raised); box-sizing: border-box;">
							<div>
								<Lib.Badge variant="success">SCREEN 2</Lib.Badge>
								<h4 style="margin: 0.5rem 0 0.25rem 0;">Transaction Details</h4>
								<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Verified edge settlement and audit logs.</p>
							</div>
							<div style="display: flex; gap: 0.5rem;">
								<Lib.Button size="sm" variant="outline" onclick={() => (routeScreen = 1)}>
									← Back
								</Lib.Button>
								<Lib.Button size="sm" variant="primary" onclick={() => (routeScreen = 3)}>
									Configure →
								</Lib.Button>
							</div>
						</div>
					{:else}
						<div style="padding: 1.5rem; height: 100%; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
							<div>
								<Lib.Badge variant="warning">SCREEN 3</Lib.Badge>
								<h4 style="margin: 0.5rem 0 0.25rem 0;">Security Settings</h4>
								<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted);">Hardware key authorization and session limits.</p>
							</div>
							<Lib.Button size="sm" variant="outline" onclick={() => (routeScreen = 1)}>
								← Reset to Start
							</Lib.Button>
						</div>
					{/if}
				</Lib.RouteTransition>
			</div>
		</div>

	{:else if name === 'SharedElement'}
		<div class="f-preview-column">
			{#if !heroExpanded}
				<Lib.SharedElement name="hero-sample">
					<div
						role="button"
						tabindex="0"
						onclick={() => (heroExpanded = true)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (heroExpanded = true)}
						style="width: 280px; padding: 1.25rem; border-radius: var(--f-radius-lg); background: var(--f-surface); border: 1px solid var(--f-border); cursor: pointer; box-shadow: var(--f-shadow-md);"
					>
						<Lib.Badge variant="primary">HERO CARD</Lib.Badge>
						<h4 style="margin: 0.5rem 0 0.25rem 0;">Compact Preview</h4>
						<p style="margin: 0; font-size: 0.8rem; color: var(--f-text-muted);">Click to trigger WAAPI FLIP morph into expanded state.</p>
					</div>
				</Lib.SharedElement>
			{:else}
				<Lib.SharedElement name="hero-sample">
					<div
						style="width: 360px; padding: 2rem; border-radius: var(--f-radius-2xl); background: var(--f-surface-raised); border: 2px solid var(--f-primary); box-shadow: var(--f-shadow-xl);"
					>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
							<Lib.Badge variant="success">EXPANDED HERO</Lib.Badge>
							<Lib.Button size="sm" variant="outline" onclick={() => (heroExpanded = false)}>Close</Lib.Button>
						</div>
						<h3 style="margin: 0 0 0.5rem 0;">Spatial FLIP Morph</h3>
						<p style="margin: 0; font-size: 0.85rem; color: var(--f-text-muted); line-height: 1.6;">
							This card smoothly interpolated its geometry, position, and border radius directly using Web Animations API.
						</p>
					</div>
				</Lib.SharedElement>
			{/if}
		</div>

	{:else}
		<div class="f-fallback-preview">
			<Lib.Badge variant="primary">{name}</Lib.Badge>
			<p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--f-text-muted);">
				Component ready for import from <code>@fractaldesign/fractalsvelte-ui</code>
			</p>
		</div>
	{/if}
</div>

<style>
	.f-live-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		width: 100%;
		padding: 2.5rem 1.5rem;
		background: var(--f-sunken);
		background-image: radial-gradient(var(--f-border) 1px, transparent 1px);
		background-size: 20px 20px;
		border-radius: var(--f-radius-md);
		border: 1px solid var(--f-border);
		box-sizing: border-box;
		overflow: visible;
	}

	.f-preview-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		width: 100%;
	}

	.f-variants-title {
		font-size: var(--f-text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--f-text-muted);
		align-self: flex-start;
	}

	.f-demo-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
	}

	.f-bento-preview-wrap {
		width: 100%;
		max-width: 680px;
	}

	.f-fallback-preview {
		text-align: center;
	}
</style>
