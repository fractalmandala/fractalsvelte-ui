<script lang="ts">
	// Component Prop Previews: renders one preview section per prop listed for the component
	// in src/site/data/component-previews.ts, using definitions from src/site/data/prop-definitions.ts.
	import { createRawSnippet, type Component, type Snippet } from 'svelte';
	import { coreSamples } from './data/core-samples';
	import { componentPreviews } from '$site/data/component-previews';
	import { definitionFor, definitionHtml } from '$site/data/prop-definitions';
	import {
		getLiveComponentByPath,
		getLiveExamplesForProp,
		type Example
	} from '$site/doc/live-components';
	import { docIcons } from './data/doc-icons';
	import Select from '#lib/components/core/Select.svelte';
	import Badge from '#lib/components/display/Badge.svelte';

	interface Props {
		/** Path under lib/components without extension, e.g. "actions/Button". */
		path: string;
		/** Props applied to every instance (merged over the samples). */
		base?: Record<string, unknown>;
		children?: Snippet;
	}

	let { path, base = {} }: Props = $props();

	const components = import.meta.glob<Component<any>>('$lib/components/**/*.svelte', {
		eager: true,
		import: 'default'
	});

	const entry = $derived(getLiveComponentByPath(path));

	const samples = $derived(
		Object.fromEntries(
			Object.entries(coreSamples[path] ?? coreSamples[path.split('/').pop() ?? ''] ?? {}).filter(
				([k]) => k !== 'class' && k !== 'style'
			)
		)
	);
	const Comp = $derived(components[`/src/lib/components/${path}.svelte`]);

	const rows = $derived.by(() => {
		const previewProps = componentPreviews[path] ?? componentPreviews[entry?.name ?? ''] ?? [];
		const propMetaMap = new Map((entry?.props ?? []).map((p) => [p.name, p]));
		return previewProps
			.map((prop) => {
				const examples = getLiveExamplesForProp(path, prop, propMetaMap.get(prop));
				return [prop, examples] as [string, Example[]];
			})
			.filter(([, examples]) => examples.length > 0);
	});

	const hasChildren = $derived(Boolean(entry?.props.some((p) => p.name === 'children')));
	const hasClass = $derived(Boolean(entry?.props.some((p) => p.name === 'class')));
	// Overlays open from a trigger: the trigger carries the value's name, so no caption is needed.
	const hasTrigger = $derived(Boolean(entry?.props.some((p) => p.name === 'trigger')) && path !== 'overlays/Anchor');
	// An overlay with `open` but no trigger of its own gets a button that opens that one cell.
	const opensByProp = $derived(!hasTrigger && path !== 'overlays/Anchor' && Boolean(entry?.props.some((p) => p.name === 'open')));
	let openCell = $state<string | null>(null);
	// These open on a gesture over their own content, so that content names the value and says how.
	const GESTURE: Record<string, string> = { 'core/Tooltip': 'Hover', 'core/ContextMenu': 'Right-click' };
	const gesture = $derived(GESTURE[path]);
	const region = (label: string) =>
		createRawSnippet(() => ({
			render: () => `<span class="row ycenter px-md h-lg border-dashed mincurved text-sm text-secondary">${label}</span>`
		}));
	const usesTextLabelAsChildren = $derived(
		hasChildren &&
			!hasCellStyle() &&
			typeof (samples.children as { $snippet?: unknown } | undefined)?.$snippet === 'string' &&
			Object.keys(samples).length === 1
	);

	const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));
	const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
	const icon = (name: string) => docIcons[name];

	const FILL = createRawSnippet(() => ({
		render: () =>
			'<div class="full bg-panel border radius-sm row xcenter ycenter text-xs text-muted">media</div>'
	}));
	const STAR = createRawSnippet(() => ({ render: () => '<span class="row ycenter">★</span>' }));

	const trigger = (label: string) =>
		createRawSnippet<[{ open?: () => void; toggle?: () => void }]>((api) => ({
			render: () =>
				`<button type="button" class="button inline-flex outline h-bs mincurved text-sm">${label}</button>`,
			setup: (node) => {
				const go = () => (api()?.open ?? api()?.toggle)?.();
				node.addEventListener('click', go);
				return () => node.removeEventListener('click', go);
			}
		}));

	const DEFAULT_CHILDREN: Record<string, Snippet> = {
		'forms/FormField': fieldSample,
		'display/AspectRatio': FILL,
		'core/AspectRatio': FILL,
		'actions/IconButton': STAR,
	};

	function hasCellStyle() {
		return Boolean(CELL_STYLE[path]);
	}

	const CELL_STYLE: Record<string, string> = {
		'overlays/Anchor': 'padding: 3em 4.5em',
		'display/Ribbon': 'position: relative; width: 9em; height: 5em',
		'display/Skeleton': 'width: 10em',
		'display/Divider': 'width: 12em; height: 3em',
		'display/Img': 'width: 9em',
		'display/Table': 'width: 100%',
		'display/Datatable': 'width: 100%',
		'display/Progress': 'width: 12em',
		'display/Meter': 'width: 12em',
		'display/Bar': 'width: 12em',
		'display/Banner': 'width: 100%',
		'layout/Grid': 'width: 18em',
		'layout/Stack': 'width: 16em',
		'layout/Container': 'width: 100%',
		'navigation/Tabs': 'width: 100%',
		'navigation/Header': 'width: 100%',
		'navigation/Stepper': 'width: 100%',
		'navigation/SideNav': 'width: 14em',
		'overlays/MenuList': 'width: 12em',
		'blocks/FeatureGrid': 'width: 100%',
		'blocks/Carousel': 'width: 100%',
		'blocks/Video': 'width: 16em',
		'blocks/Canvas': 'width: 14em',
		'blocks/FlowCanvas': 'width: 16em',
		'blocks/Waveform': 'width: 16em',
		'blocks/EmptyState': 'width: 18em',
		'blocks/ChatBubble': 'width: 18em',
		'typography/Blockquote': 'width: 20em',
		'forms/XYPad': 'width: 14em',
		'forms/FileUpload': 'width: 18em',
		'forms/TextArea': 'width: 16em',
		'forms/Fieldset': 'width: 18em',
		'blocks/BeforeAfter': 'width: 14em',
		'display/AspectRatio': 'width: 7em',
		'core/AspectRatio': 'width: 7em',
		'layout/SplitPane': 'width: 16em; height: 6em',
		'accordion/Accordion': 'text-align: start;',
		'Accordion': 'text-align: start;',
		'core/Accordion': 'text-align: start;',
		'Collapsible': 'width: 16rem',
		'core/Collapsible': 'width: 16rem'
	};

	const STYLE_KEYS = new Set([
		'variant',
		'iconVariant',
		'iconvariant',
		'size',
		'shape',
		'shadow',
		'surface',
		'border',
		'padding',
		'class',
		'style',
		'open',
		'disabled'
	]);
	const FALLBACK_TEXT: Record<string, string> = {
		'overlays/Tooltip': 'Hover me',
		'overlays/ContextMenu': 'Right-click here'
	};

	function propComment(propName: string): string | null | undefined {
		return entry?.props.find((p) => p.name === propName)?.comment;
	}

	function resolve(v: unknown, prop: string): unknown {
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			const o = v as Record<string, unknown>;
			if ('$snippet' in o) return text(String(o.$snippet));
			if ('$html' in o) {
				const h = String(o.$html);
				return createRawSnippet(() => ({ render: () => h }));
			}
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

		// a class-valued prop names itself on the component; a boolean keeps the sample text
		if (usesTextLabelAsChildren && prop !== 'children' && typeof ex.value === 'string') {
			p.children = text(capitalize(ex.label));
		}

		const contentful = Object.keys(samples).some((k) => !STYLE_KEYS.has(k));
		if (
			prop !== 'children' &&
			hasChildren &&
			p.children === undefined &&
			(DEFAULT_CHILDREN[path] || FALLBACK_TEXT[path] || !contentful)
		)
			p.children = DEFAULT_CHILDREN[path] ?? text(FALLBACK_TEXT[path] ?? 'Content');
		if (
			entry?.props.some((d) => d.name === 'trigger') &&
			p.trigger === undefined &&
			path !== 'overlays/Anchor'
		)
			p.trigger = trigger(ex.label);
		for (const d of entry?.props ?? [])
			if (!d.optional && d.type?.includes('Snippet') && p[d.name] === undefined)
				p[d.name] = text(d.name);
		if (gesture && prop !== 'children') p.children = region(`${gesture}: ${ex.label}`);
		// the cell centres its label; the component keeps its own text alignment
		if (hasClass) p.class = 'ta-l';
		return p;
	}
</script>

{#snippet fieldSample()}
	<Select label="Country" value="in">
		<option value="in">India</option>
		<option value="jp">Japan</option>
	</Select>
{/snippet}


{#if Comp && rows.length}
	<h2 class="page-heading-xl">Component Prop Previews</h2>
	<div class="box gap-2xl">
		{#each rows as [prop, examples] (prop)}
			{@const defText = definitionFor(prop, propComment(prop))}
			<div class="box gap-lg">
				<header class="box gap-sm">
					<h3 class="page-heading-lg tt-c">{prop}</h3>
					{#if defText}
						<p class="text-body text-secondary">{@html definitionHtml(defText)}</p>
					{/if}
				</header>
				<div class="props-row modern xinherit">
					{#each examples as ex (ex.label)}
						{#if usesTextLabelAsChildren && prop !== 'children' && typeof ex.value === 'string'}
							<Comp {...propsFor(prop, ex)} />
						{:else if hasTrigger || gesture}
							<Comp {...propsFor(prop, ex)} />
						{:else if opensByProp}
							{@const cell = `${prop}:${ex.label}`}
							<button type="button" class="button inline-flex outline h-bs mincurved text-sm" onclick={() => (openCell = cell)}>
								{ex.label}
							</button>
							<Comp {...propsFor(prop, ex)} open={openCell === cell} onclose={() => (openCell = null)} />
						{:else}
							<div class="box gap-sm xcenter ta-c" style={CELL_STYLE[path]}>
								<Comp {...propsFor(prop, ex)} />
								<Badge shape="mincurved" textsize="text-xs">{ex.label}</Badge>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
{:else if !Comp}
	<p>No component at lib/components/{path}.svelte</p>
{/if}

<style lang="sass">

.props-row
	display: flex
	flex-direction: row
	flex-wrap: wrap
	align-items: center
	justify-content: center
	column-gap: var(--space-bs)
	row-gap: var(--space-xl)
	border: 1px solid var(--border)
	padding: var(--space-xl) var(--space-2xl)
	min-height: 160px

</style>