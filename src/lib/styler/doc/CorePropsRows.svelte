<script lang="ts">
	// Doc template 1: one row per curated core prop (doc/data/core-props.ts, in
	// that order), rendering the component once per example value. Example values are
	// generated into doc/data/props.json by scripts/component-docs.mjs; sample content
	// comes from doc/data/core-samples.ts. Nothing here reads a demo.
	import { createRawSnippet, type Component, type Snippet } from 'svelte';
	import propsJson from './data/props.json';
	import { coreSamples } from './data/core-samples';
	import { definitionFor, definitionHtml } from './data/prop-definitions';
	import * as lucide from '@fractaldesign/icons/lucide';
	import Select from '../forms/Select.svelte';

	interface Example {
		label: string;
		value: unknown;
		extra?: Record<string, unknown>;
	}
	interface Entry {
		props: { name: string; type?: string; optional?: boolean }[];
		coreProps: Record<string, Example[]>;
	}

	interface Props {
		/** Path under lib/styler without extension, e.g. "actions/Button". */
		path: string;
		/** Props applied to every instance (merged over the samples). */
		base?: Record<string, unknown>;
		/** Ignored: rows supply their own sample content. */
		children?: Snippet;
	}

	let { path, base = {} }: Props = $props();

	const components = import.meta.glob<Component<any>>('../**/*.svelte', { eager: true, import: 'default' });
	const data = (propsJson as unknown as { props: Record<string, Entry> }).props;

	// Sample content from doc/data/core-samples.ts (never class or style).
	const samples = $derived(Object.fromEntries(Object.entries(coreSamples[path] ?? {}).filter(([k]) => k !== 'class' && k !== 'style')));
	const Comp = $derived(components[`../${path}.svelte`]);
	const entry = $derived(data[path]);
	const rows = $derived(Object.entries(entry?.coreProps ?? {}));
	const hasChildren = $derived(Boolean(entry?.props.some((p) => p.name === 'children')));

	const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));
	const icon = (name: string) => {
		const data = (lucide as Record<string, unknown>)[name] as { body?: string; viewBox?: string } | undefined;
		return data;
	};

	// Content a component shows when the row doesn't set children itself.
	const FILL = createRawSnippet(() => ({
		render: () => '<div class="full bg-panel border radius-sm row xcenter ycenter text-xs text-muted">media</div>'
	}));
	const STAR = createRawSnippet(() => ({ render: () => '<span class="row ycenter">★</span>' }));
	const TILES = createRawSnippet(() => ({
		render: () =>
			'<div style="display: contents">' +
			['One', 'Two', 'Three'].map((t) => `<div class="bg-panel border radius-sm pad-sm text-xs">${t}</div>`).join('') +
			'</div>'
	}));
	// Grids get six tiles, so 4, 5 and 6 columns read differently.
	const GRID_TILES = createRawSnippet(() => ({
		render: () =>
			'<div style="display: contents">' +
			['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((t) => `<div class="bg-panel border radius-sm pad-sm text-xs">${t}</div>`).join('') +
			'</div>'
	}));
	// Opens the overlay a row configures; labels it with the component name.
	const trigger = (label: string) =>
		createRawSnippet<[{ open?: () => void; toggle?: () => void }]>((api) => ({
			render: () => `<button type="button" class="btn el-variant el-size el-shape outline h-sm min">${label}</button>`,
			setup: (node) => {
				const go = () => (api().open ?? api().toggle)?.();
				node.addEventListener('click', go);
				return () => node.removeEventListener('click', go);
			}
		}));
	const DEFAULT_CHILDREN: Record<string, Snippet> = {
		'actions/ButtonGroup': createRawSnippet(() => ({
			render: () =>
				'<div style="display: contents">' +
				['Day', 'Week', 'Month'].map((t) => `<button type="button" class="btn el-variant el-size el-shape outline h-sm min">${t}</button>`).join('') +
				'</div>'
		})),
		'forms/FormField': fieldSample,
		'layout/Stack': TILES,
		'layout/Flex': TILES,
		'layout/Grid': GRID_TILES,
		'layout/BentoGrid': GRID_TILES,
		'display/AspectRatio': FILL,
		'actions/IconButton': STAR
	};

	// Per-component cell padding, for examples that draw outside their box.
	const CELL_STYLE: Record<string, string> = {
		'overlays/Anchor': 'padding: 3em 4.5em',
		'blocks/BeforeAfter': 'width: 14em',
		'display/AspectRatio': 'width: 7em',
		'layout/Divider': 'width: 8em; height: 3em',
		'layout/SplitPane': 'width: 16em; height: 6em'
	};

	const STYLE_KEYS = new Set(['variant', 'size', 'shape', 'shadow', 'surface', 'border', 'padding', 'class', 'style', 'open', 'disabled']);
	const FALLBACK_TEXT: Record<string, string> = {
		'overlays/Tooltip': 'Hover me',
		'overlays/ContextMenu': 'Right-click here'
	};

	function resolve(v: unknown, prop: string): unknown {
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			const o = v as Record<string, unknown>;
			if ('$snippet' in o) return text(String(o.$snippet));
			if ('$html' in o) { const h = String(o.$html); return createRawSnippet(() => ({ render: () => h })); }
			if ('$icon' in o) return icon(String(o.$icon));
			if ('$base' in o) return samples[prop];
			return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, resolve(x, k)]));
		}
		if (Array.isArray(v)) return v.map((x) => resolve(x, prop));
		return v;
	}

	function propsFor(prop: string, ex: Example) {
		const b = resolve(samples, '') as Record<string, unknown>;
		const p: Record<string, unknown> = { ...b, ...base, ...(resolve(ex.extra ?? {}, '') as object) };
		const v = resolve(ex.value, prop);
		if (v === undefined) delete p[prop];
		else p[prop] = v;
		// Sample children only when nothing else in the base gives the component content.
		const contentful = Object.keys(samples).some((k) => !STYLE_KEYS.has(k));
		if (prop !== 'children' && hasChildren && p.children === undefined && (DEFAULT_CHILDREN[path] || FALLBACK_TEXT[path] || !contentful))
			p.children = DEFAULT_CHILDREN[path] ?? text(FALLBACK_TEXT[path] ?? 'Content');
		if (entry?.props.some((d) => d.name === 'trigger') && p.trigger === undefined && path !== 'overlays/Anchor')
			p.trigger = trigger('Open');
		// Required snippets the row didn't supply get placeholder text.
		for (const d of entry?.props ?? [])
			if (!d.optional && d.type?.includes('Snippet') && p[d.name] === undefined) p[d.name] = text(d.name);
		return p;
	}
</script>

<!-- FormField hands its look to the control inside; Select is the control that reads all of it. -->
{#snippet fieldSample()}
	<Select options={[{ value: 'in', label: 'India' }, { value: 'jp', label: 'Japan' }]} value="in" />
{/snippet}

{#if Comp && rows.length}
	<div class="box gap-xl">
		{#each rows as [prop, examples] (prop)}
			<div class="box gap-md">
				<header class="card-header">
					<h3 class="page-heading-bs tt-c">{prop}</h3>
					<p class="text-body-sm text-secondary">{@html definitionHtml(definitionFor(prop, path).text)}</p>
				</header>
				<div class="props-row radius-md">
					{#each examples as ex (ex.label)}
						<div class="box gap-xs xcenter ta-c" style={CELL_STYLE[path]}>
							<Comp {...propsFor(prop, ex)} />
							<span class="text-xs text-muted">{ex.label}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{:else if !Comp}
	<p>No component at lib/styler/{path}.svelte</p>
{/if}
