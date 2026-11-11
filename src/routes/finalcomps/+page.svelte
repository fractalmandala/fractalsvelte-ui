<script lang="ts">
	import '$site/styles/canvas.sass';
	import { createRawSnippet, onMount, type Component, type Snippet } from 'svelte';
	import VastCanvas from '$site/VastCanvas.svelte';
	import { camera } from '$site/utils/camera.svelte';
	import {
		Variants,
		Shapes,
		Sizes,
		Shadows,
		Surfaces,
		ThemeColors,
		Messages,
		TextSizes
	} from '$lib/types.js';
	import { coreSamples } from '$site/doc/data/core-samples';
	import { docIcons } from '$site/doc/data/doc-icons';
	import CodeSnippet from '$site/doc/CodeSnippet.svelte';
	import Select from '#lib/components/core/Select.svelte';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import Button from '#lib/components/core/Button.svelte';
	import Icon from '$lib/components/core/Icon.svelte';
	import {
		klGrid2x2,
		klMaximize2,
		klMinus,
		klPlus,
		klRotateCcw
	} from '$lib/icons/keylinestroke';

	type AxisName = 'variant' | 'shape' | 'size' | 'shadow';

	const DEFAULT_AXIS_VALUES: Record<AxisName, readonly string[]> = {
		variant: Variants,
		shape: Shapes,
		size: Sizes,
		shadow: Shadows
	};

	const TYPE_UNIONS: Record<string, readonly string[]> = {
		Variant: Variants,
		Shape: Shapes,
		Size: Sizes,
		Shadow: Shadows,
		Surface: Surfaces,
		ThemeColor: ThemeColors,
		Message: Messages,
		TextSize: TextSizes,
		AvatarShape: ['circle', 'rounded', 'square'],
		TagColor: [...Surfaces, ...ThemeColors, ...Messages],
		ContainerSize: ['half', 'wide', 'full', 'fluid', 'prose'],
		TabsVariant: ['underline', 'pill', 'bordered'],
		TopNavVariant: ['underline', 'pills', 'subtle'],
		DialogSize: ['prose', 'full']
	};

	const AXES: AxisName[] = ['variant', 'shape', 'size', 'shadow'];

	interface CompItem {
		name: string;
		relPath: string;
		axes: { name: AxisName; values: readonly string[] }[];
		hasChildren: boolean;
		hasTrigger: boolean;
		Comp: Component<Record<string, unknown>>;
		Demo?: Component;
		demoSource: string;
	}

	const modules = import.meta.glob<{ default: Component<Record<string, unknown>> }>(
		'$lib/components/**/*.svelte',
		{ eager: true }
	);
	const rawSources = import.meta.glob<string>('$lib/components/**/*.svelte', {
		query: '?raw',
		import: 'default',
		eager: true
	});
	const siteDemos = import.meta.glob<Component>('/src/site/demos/**/*.svelte', {
		import: 'default',
		eager: true
	});
	const siteDemoSources = import.meta.glob<string>('/src/site/demos/**/*.svelte', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	function resolveTypeValues(
		typeStr: string,
		src: string,
		fallback: readonly string[]
	): readonly string[] {
		const trimmed = typeStr.trim();

		const excludeMatch = trimmed.match(/^Exclude<\s*(\w+)\s*,\s*(.+)\s*>$/);
		if (excludeMatch) {
			const baseValues = TYPE_UNIONS[excludeMatch[1]] ?? fallback;
			const dropped = new Set([...excludeMatch[2].matchAll(/'([^']+)'/g)].map((m) => m[1]));
			return baseValues.filter((v) => !dropped.has(v));
		}

		let expanded = trimmed;
		if (!(expanded in TYPE_UNIONS)) {
			const localAlias = src.match(new RegExp(`type\\s+${escapeRe(expanded)}\\s*=\\s*([^;\\n]+)`));
			if (localAlias) expanded = localAlias[1].trim();
		}

		const parts = expanded
			.split('|')
			.map((p) => p.trim())
			.filter(Boolean);
		const out: string[] = [];
		for (const part of parts) {
			if (part in TYPE_UNIONS) {
				out.push(...TYPE_UNIONS[part]);
			} else if (/^'[^']*'$/.test(part)) {
				out.push(part.slice(1, -1));
			}
		}

		return out.length > 0 ? Array.from(new Set(out)) : fallback;
	}

	function parseComponentMeta(src: string): {
		axes: { name: AxisName; values: readonly string[] }[];
		hasChildren: boolean;
		hasTrigger: boolean;
	} {
		const propsMatch = src.match(/interface\s+Props\b[\s\S]*?\{([\s\S]*?)\}/);
		const body = propsMatch ? propsMatch[1] : src;
		const axes: { name: AxisName; values: readonly string[] }[] = [];

		for (const axis of AXES) {
			const m = body.match(new RegExp(`\\b${axis}\\s*\\??\\s*:\\s*([^;\\n]+)`));
			if (m) {
				axes.push({
					name: axis,
					values: resolveTypeValues(m[1], src, DEFAULT_AXIS_VALUES[axis])
				});
			}
		}

		const hasChildren = /\bchildren\s*\??\s*:/.test(body) || /\{@render\s+children\b/.test(src);
		const hasTrigger = /\btrigger\s*\??\s*:/.test(body);
		return { axes, hasChildren, hasTrigger };
	}

	function fallbackDemoSource(name: string, relPath: string, hasChildren: boolean): string {
		const sample = coreSamples[relPath] ?? {};
		const childObj = sample.children as { $snippet?: string } | undefined;
		const childText = childObj?.$snippet ?? name;
		const body = hasChildren ? `<${name}>${childText}</${name}>` : `<${name} />`;
		return `<script lang="ts">\n\timport ${name} from '$lib/components/${relPath}.svelte';\n<\/script>\n\n${body}`;
	}

	const compItems: CompItem[] = Object.entries(modules)
		.map(([fullPath, mod]) => {
			const relPath = fullPath
				.replace(/^.*\/components\//, '')
				.replace(/\.svelte$/, '');
			const segments = relPath.split('/');
			const name = segments[segments.length - 1];
			const raw = rawSources[fullPath] ?? '';
			const { axes, hasChildren, hasTrigger } = parseComponentMeta(raw);
			const demoKey = `/src/site/demos/${relPath}.svelte`;
			const Demo = siteDemos[demoKey];
			const demoSource =
				siteDemoSources[demoKey]?.trim() ?? fallbackDemoSource(name, relPath, hasChildren);
			return {
				name,
				relPath,
				axes,
				hasChildren,
				hasTrigger,
				Comp: mod.default,
				Demo,
				demoSource
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	const textSnippet = (t: string): Snippet =>
		createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

	const STAR = createRawSnippet(() => ({ render: () => '<span class="row ycenter">★</span>' }));
	const FILL = createRawSnippet(() => ({
		render: () =>
			'<div class="full bg-panel border radius-sm row xcenter ycenter text-xs text-muted">media</div>'
	}));

	const triggerSnippet = (label: string) =>
		createRawSnippet<[{ open?: () => void; toggle?: () => void }]>((api) => ({
			render: () =>
				`<button type="button" class="row ycenter gap-sm outline h-sm mincurved">${label}</button>`,
			setup: (node) => {
				const go = () => (api()?.open ?? api()?.toggle)?.();
				node.addEventListener('click', go);
				return () => node.removeEventListener('click', go);
			}
		}));

	const EXTRA_SAMPLES: Record<string, Record<string, unknown>> = {
		'display/Bar': { fraction: 0.65 },
		'forms/SliderTrack': { width: 180, height: 24, values: [0.45] },
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
		'overlays/Popover': {
			children: { $snippet: 'Popover content' }
		},
		'typography/CodeSnippet': {
			language: 'ts',
			code: "const greeting: string = 'hello';"
		}
	};

	const iconData = (name: string) => docIcons[name];

	function resolveSampleValue(v: unknown): unknown {
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			const o = v as Record<string, unknown>;
			if ('$snippet' in o) return textSnippet(String(o.$snippet));
			if ('$html' in o) {
				const h = String(o.$html);
				return createRawSnippet(() => ({ render: () => h }));
			}
			if ('$icon' in o) return iconData(String(o.$icon));
			return Object.fromEntries(
				Object.entries(o).map(([k, val]) => [k, resolveSampleValue(val)])
			);
		}
		if (Array.isArray(v)) return v.map((item) => resolveSampleValue(item));
		return v;
	}

	function buildProps(
		item: CompItem,
		overrides: Record<string, unknown> = {}
	): Record<string, unknown> {
		const rawSample = {
			...(EXTRA_SAMPLES[item.relPath] ?? {}),
			...(coreSamples[item.relPath] ?? {})
		};
		const filtered = Object.fromEntries(
			Object.entries(rawSample).filter(([k]) => k !== 'class' && k !== 'style')
		);
		const resolved = resolveSampleValue(filtered) as Record<string, unknown>;
		const props: Record<string, unknown> = { ...resolved, ...overrides };

		if (item.relPath === 'actions/IconButton' && props.children === undefined) {
			props.children = STAR;
		} else if (item.relPath === 'display/AspectRatio' && props.children === undefined) {
			props.children = FILL;
		} else if (item.relPath === 'forms/FormField' && props.children === undefined) {
			props.children = fieldSample;
		} else if (item.hasChildren && props.children === undefined) {
			props.children = textSnippet(item.name);
		}

		if (item.hasTrigger && props.trigger === undefined && item.relPath !== 'overlays/Anchor') {
			props.trigger = triggerSnippet('Open');
		}

		return props;
	}

	let isDragging = $state(false);
	let viewport: HTMLDivElement;
	let plane: HTMLDivElement;
	let last = { x: 0, y: 0 };
	let dragId: number | null = null;

	const WIDTHS_KEY = 'finalcomps-card-widths';
	const POSITIONS_KEY = 'finalcomps-card-positions';
	const CARD_MIN = 280;
	const CARD_MAX = 1600;
	let widths = $state<Record<string, number>>({});
	let positions = $state<Record<string, { x: number; y: number }>>({});
	let zIndices = $state<Record<string, number>>({});
	let topZ = $state(2);

	let resizingKey: string | null = null;
	let resizeStart = { x: 0, w: 0 };

	let draggingCardKey = $state<string | null>(null);
	let cardDragId: number | null = null;
	let cardDragLast = { x: 0, y: 0 };

	function defaultWidth(item: CompItem) {
		return item.axes.length > 0 ? 760 : 480;
	}

	function cardWidth(item: CompItem) {
		return widths[item.relPath] ?? defaultWidth(item);
	}

	function cardPos(item: CompItem) {
		return positions[item.relPath] ?? { x: 0, y: 0 };
	}

	function handleResizeDown(e: PointerEvent, item: CompItem) {
		e.stopPropagation();
		e.preventDefault();
		resizingKey = item.relPath;
		resizeStart = { x: e.clientX, w: cardWidth(item) };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handleResizeMove(e: PointerEvent) {
		if (resizingKey === null) return;
		const dx = (e.clientX - resizeStart.x) / camera.zoom;
		widths[resizingKey] = Math.min(CARD_MAX, Math.max(CARD_MIN, Math.round(resizeStart.w + dx)));
	}

	function handleResizeUp() {
		if (resizingKey === null) return;
		localStorage.setItem(WIDTHS_KEY, JSON.stringify($state.snapshot(widths)));
		resizingKey = null;
	}

	function resetWidth(key: string) {
		delete widths[key];
		localStorage.setItem(WIDTHS_KEY, JSON.stringify($state.snapshot(widths)));
	}

	function handleCardPointerDown(e: PointerEvent, item: CompItem) {
		if (e.button !== 0 || e.altKey) return;
		const target = e.target as Element;
		if (target.closest(INTERACTIVE) || target.closest('.card-resizer')) return;
		e.stopPropagation();
		e.preventDefault();
		draggingCardKey = item.relPath;
		cardDragId = e.pointerId;
		cardDragLast = { x: e.clientX, y: e.clientY };
		topZ += 1;
		zIndices[item.relPath] = topZ;
		if (!positions[item.relPath]) {
			positions[item.relPath] = { x: 0, y: 0 };
		}
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handleCardPointerMove(e: PointerEvent, item: CompItem) {
		if (draggingCardKey !== item.relPath || e.pointerId !== cardDragId) return;
		const dx = (e.clientX - cardDragLast.x) / camera.zoom;
		const dy = (e.clientY - cardDragLast.y) / camera.zoom;
		const cur = positions[item.relPath] ?? { x: 0, y: 0 };
		positions[item.relPath] = {
			x: Math.round(cur.x + dx),
			y: Math.round(cur.y + dy)
		};
		cardDragLast = { x: e.clientX, y: e.clientY };
	}

	function handleCardPointerUp(e: PointerEvent, item: CompItem) {
		if (draggingCardKey !== item.relPath || e.pointerId !== cardDragId) return;
		draggingCardKey = null;
		cardDragId = null;
		const el = e.currentTarget as HTMLElement;
		if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
		localStorage.setItem(POSITIONS_KEY, JSON.stringify($state.snapshot(positions)));
	}

	function resetCardPosition(key: string) {
		delete positions[key];
		localStorage.setItem(POSITIONS_KEY, JSON.stringify($state.snapshot(positions)));
	}

	function resetAllPositions() {
		positions = {};
		localStorage.removeItem(POSITIONS_KEY);
	}

	const INTERACTIVE =
		'input, textarea, select, button, a[href], label, [contenteditable], [role="slider"], [role="switch"], [role="button"], [role="tab"], [role="option"], [role="combobox"], [draggable="true"], [data-canvas-controls]';

	onMount(() => {
		try {
			widths = JSON.parse(localStorage.getItem(WIDTHS_KEY) ?? '{}');
		} catch {
			widths = {};
		}
		try {
			positions = JSON.parse(localStorage.getItem(POSITIONS_KEY) ?? '{}');
		} catch {
			positions = {};
		}
		viewport.scrollLeft = 0;
		viewport.scrollTop = 0;
		viewport.addEventListener('wheel', handleWheel, { passive: false });
		return () => viewport.removeEventListener('wheel', handleWheel);
	});

	function handleScroll() {
		if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
		if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
	}

	function handlePointerDown(e: PointerEvent) {
		const overControl = (e.target as Element).closest(INTERACTIVE);
		const pan = e.button === 1 || (e.button === 0 && (e.altKey || !overControl));
		if (!pan) return;
		e.preventDefault();
		isDragging = true;
		dragId = e.pointerId;
		last = { x: e.clientX, y: e.clientY };
		viewport.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || e.pointerId !== dragId) return;
		camera.pan(e.clientX - last.x, e.clientY - last.y);
		last = { x: e.clientX, y: e.clientY };
	}

	function handlePointerUp(e: PointerEvent) {
		if (e.pointerId !== dragId) return;
		isDragging = false;
		dragId = null;
		if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		if (e.ctrlKey || e.metaKey) {
			const rect = viewport.getBoundingClientRect();
			const vx = e.clientX - rect.left;
			const vy = e.clientY - rect.top;
			const clampedDelta = Math.max(-60, Math.min(60, e.deltaY));
			camera.zoomAt(Math.exp(-clampedDelta * 0.002), vx, vy);
		} else {
			camera.pan(-e.deltaX, -e.deltaY);
		}
	}
</script>

{#snippet fieldSample()}
	<Select label="Country" value="in">
		<option value="in">India</option>
		<option value="jp">Japan</option>
	</Select>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={viewport}
	class="viewport-container"
	class:dragging={isDragging}
	onscroll={handleScroll}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	role="region"
	aria-label="Final components canvas viewport"
>
	<VastCanvas />

	<div
		bind:this={plane}
		class="infinite-plane"
		style="transform: translate({camera.x}px, {camera.y}px) scale({camera.zoom});"
	>
		{#each compItems as item (item.relPath)}
			{@const Comp = item.Comp}
			{@const Demo = item.Demo}
			{@const pos = cardPos(item)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<section
				class="component-island"
				class:card-dragging={draggingCardKey === item.relPath}
				style="width: {cardWidth(item)}px; transform: translate({pos.x}px, {pos.y}px); z-index: {zIndices[item.relPath] ?? 1};"
				onpointerdown={(e) => handleCardPointerDown(e, item)}
				onpointermove={(e) => handleCardPointerMove(e, item)}
				onpointerup={(e) => handleCardPointerUp(e, item)}
				onpointercancel={(e) => handleCardPointerUp(e, item)}
			>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<header
					class="island-header"
					title="Drag to move component block, double-click to reset position"
					ondblclick={() => resetCardPosition(item.relPath)}
				>
					<span class="island-title">{item.name}</span>
					<span class="island-path">{item.relPath}</span>
				</header>

				<div class="cards-stack">
					<div class="demo-card">
						<div class="card-label">default</div>
						<div class="card-body">
							<Comp {...buildProps(item)} />
						</div>
					</div>

					{#each item.axes as axis (axis.name)}
						<div class="demo-card">
							<div class="card-label">{axis.name}</div>
							<div class="prop-values-row">
								{#each axis.values as val (val)}
									<div class="prop-cell">
										<Comp {...buildProps(item, { [axis.name]: val })} />
										<span class="prop-value-label">{val}</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}

					<div class="demo-card box gap-md">
						<div class="card-label">demo</div>
						<div class="card-body">
							{#if Demo}
								<Demo />
							{:else}
								<Comp {...buildProps(item)} />
							{/if}
						</div>
						<CodeSnippet code={item.demoSource} language="svelte" />
					</div>
				</div>

				<button
					type="button"
					class="card-resizer"
					aria-label="Resize {item.name} card. Drag to resize, double-click to reset."
					onpointerdown={(e) => handleResizeDown(e, item)}
					onpointermove={handleResizeMove}
					onpointerup={handleResizeUp}
					ondblclick={() => resetWidth(item.relPath)}
				></button>
			</section>
		{/each}
	</div>

	<div class="canvas-controls" data-canvas-controls>
		<IconButton
			variant="ghost"
			size="h-md"
			label="Zoom out"
			onclick={() => camera.zoomStep(-0.15, viewport)}
		>
			<Icon icon={klMinus} />
		</IconButton>
		<Button
			variant="ghost"
			size="h-md"
			class="tabular-nums"
			onclick={() => camera.zoomTo(1, viewport)}
		>
			{Math.round(camera.zoom * 100)}%
		</Button>
		<IconButton
			variant="ghost"
			size="h-md"
			label="Zoom in"
			onclick={() => camera.zoomStep(0.15, viewport)}
		>
			<Icon icon={klPlus} />
		</IconButton>
		<IconButton
			variant="ghost"
			size="h-md"
			label="Auto fit"
			onclick={() => camera.fitToView(viewport, plane)}
		>
			<Icon icon={klMaximize2} />
		</IconButton>
		<IconButton
			variant="ghost"
			size="h-md"
			label="Reset block positions"
			onclick={resetAllPositions}
		>
			<Icon icon={klGrid2x2} />
		</IconButton>
		<IconButton
			variant="ghost"
			size="h-md"
			label="Reset view"
			onclick={() => camera.reset()}
		>
			<Icon icon={klRotateCcw} />
		</IconButton>
	</div>
</div>
