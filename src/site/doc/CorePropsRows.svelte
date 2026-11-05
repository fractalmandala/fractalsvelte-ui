<script lang="ts">
	// Component Prop Previews: renders one preview section per prop listed for the component
	// in src/site/data/component-previews.ts, using definitions from src/site/data/prop-definitions.ts.
	import { createRawSnippet, type Component, type Snippet } from 'svelte';
	import propsJson from './data/props.json';
	import { coreSamples } from './data/core-samples';
	import { componentPreviews } from '$site/data/component-previews';
	import { definitionFor, definitionHtml } from '$site/data/prop-definitions';
	import * as lucide from '@fractaldesign/icons/lucide';
	import Select from '$lib/components/forms/Select.svelte';

	interface Example {
		label: string;
		value: unknown;
		extra?: Record<string, unknown>;
	}
	interface PropMeta {
		name: string;
		type?: string;
		optional?: boolean;
		comment?: string | null;
	}
	interface Entry {
		props: PropMeta[];
		coreProps: Record<string, Example[]>;
	}

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
	const data = (propsJson as unknown as { props: Record<string, Entry> }).props;

	const samples = $derived(
		Object.fromEntries(
			Object.entries(coreSamples[path] ?? {}).filter(([k]) => k !== 'class' && k !== 'style')
		)
	);
	const Comp = $derived(components[`/src/lib/components/${path}.svelte`]);
	const entry = $derived(data[path]);
	const rows = $derived.by(() => {
		const coreMap = entry?.coreProps ?? {};
		const previewOrder = componentPreviews[path];
		if (!previewOrder) return Object.entries(coreMap);
		return previewOrder
			.filter((prop) => prop in coreMap)
			.map((prop) => [prop, coreMap[prop]] as [string, Example[]]);
	});
	const hasChildren = $derived(Boolean(entry?.props.some((p) => p.name === 'children')));
	const usesTextLabelAsChildren = $derived(
		hasChildren &&
			typeof (coreSamples[path]?.children as { $snippet?: unknown } | undefined)?.$snippet ===
				'string' &&
			Object.keys(coreSamples[path] ?? {}).length === 1
	);

	const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));
	const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
	const icon = (name: string) => {
		const d = (lucide as Record<string, unknown>)[name] as
			| { body?: string; viewBox?: string }
			| undefined;
		return d;
	};

	const FILL = createRawSnippet(() => ({
		render: () =>
			'<div class="full bg-panel border radius-sm row xcenter ycenter text-xs text-muted">media</div>'
	}));
	const STAR = createRawSnippet(() => ({ render: () => '<span class="row ycenter">★</span>' }));

	const trigger = (label: string) =>
		createRawSnippet<[{ open?: () => void; toggle?: () => void }]>((api) => ({
			render: () =>
				`<button type="button" class="row ycenter gap-sm shape size variant outline h-sm min">${label}</button>`,
			setup: (node) => {
				const go = () => (api()?.open ?? api()?.toggle)?.();
				node.addEventListener('click', go);
				return () => node.removeEventListener('click', go);
			}
		}));

	const DEFAULT_CHILDREN: Record<string, Snippet> = {
		'forms/FormField': fieldSample,
		'display/AspectRatio': FILL,
		'actions/IconButton': STAR
	};

	const CELL_STYLE: Record<string, string> = {
		'overlays/Anchor': 'padding: 3em 4.5em',
		'blocks/BeforeAfter': 'width: 14em',
		'display/AspectRatio': 'width: 7em',
		'layout/SplitPane': 'width: 16em; height: 6em'
	};

	const STYLE_KEYS = new Set([
		'variant',
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

		if (usesTextLabelAsChildren && prop !== 'children') {
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
			p.trigger = trigger('Open');
		for (const d of entry?.props ?? [])
			if (!d.optional && d.type?.includes('Snippet') && p[d.name] === undefined)
				p[d.name] = text(d.name);
		return p;
	}
</script>

{#snippet fieldSample()}
	<Select
		options={[
			{ value: 'in', label: 'India' },
			{ value: 'jp', label: 'Japan' }
		]}
		value="in"
	/>
{/snippet}

{#if Comp && rows.length}
	<div class="box gap-xl">
		{#each rows as [prop, examples] (prop)}
			{@const defText = definitionFor(prop, propComment(prop))}
			<div class="box gap-md">
				<header class="card-header">
					<h3 class="page-heading-bs tt-c">{prop}</h3>
					{#if defText}
						<p class="text-body-sm text-secondary">{@html definitionHtml(defText)}</p>
					{/if}
				</header>
				<div class="props-row radius-md row wrap gap-bs ycenter">
					{#each examples as ex (ex.label)}
						{#if usesTextLabelAsChildren && prop !== 'children'}
							<Comp {...propsFor(prop, ex)} />
						{:else}
							<div class="box gap-sm xcenter ta-c" style={CELL_STYLE[path]}>
								<Comp {...propsFor(prop, ex)} />
								<span class="text-xs text-muted">{ex.label}</span>
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
