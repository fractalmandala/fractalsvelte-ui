<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luArrowLeft, luArrowRight, luCheck, luChevronRight } from '@fractaldesign/icons/lucide';
	import ApiTable from '../../../../docs-site/ApiTable.svelte';
	import CodeBlock from '../../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../../docs-site/DocPage.svelte';
	import Example from '../../../../docs-site/Example.svelte';
	import InstallTabs from '../../../../docs-site/InstallTabs.svelte';
	import Rich from '../../../../docs-site/Rich.svelte';
	import Section from '../../../../docs-site/Section.svelte';
	import { PACKAGE, bySlug } from '../../../../docs-site/registry.js';
	import type { TocItem } from '../../../../docs-site/Toc.svelte';
	import { kits } from '../../../../lib/components/kits.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const entry = $derived(data.entry);
	const doc = $derived(entry.doc);
	const api = $derived(entry.api);
	const kit = $derived(kits.find((k) => k.id === entry.kit));
	const paragraphs = $derived((doc?.description ?? '').split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean));
	const exampleId = (file: string) => `example-${file.replace(/\.svelte$/, '').replace(/^\d+-/, '')}`;

	const valueExports = $derived(api?.exports ?? [entry.name]);
	const typeExports = $derived(api?.typeExports ?? []);
	const importLine = $derived.by(() => {
		const names = [...valueExports, ...typeExports.map((t) => `type ${t}`)];
		const list = names.join(', ');
		return list.length > 60
			? `import {\n\t${names.join(',\n\t')}\n} from '${PACKAGE}';`
			: `import { ${list} } from '${PACKAGE}';`;
	});
	const styleImports = `import '@fractaldesign/fractalstyler/styles';\nimport '@fractaldesign/fractalsvelte-ui/styles';`;

	const parts = $derived(api?.parts ?? []);
	const related = $derived((doc?.related ?? []).map((slug) => ({ slug, entry: bySlug(slug) })));

	const toc = $derived.by(() => {
		const items: TocItem[] = [];
		if (doc?.features?.length) items.push({ id: 'features', label: 'Features' });
		items.push({ id: 'installation', label: 'Installation' }, { id: 'import', label: 'Import' });
		if (data.examples.length) {
			items.push({ id: 'examples', label: 'Examples' });
			for (const ex of data.examples) items.push({ id: exampleId(ex.file), label: ex.title, depth: 1 });
		}
		if (parts.length || doc?.api?.length) items.push({ id: 'api', label: 'API reference' });
		if (doc?.accessibility?.length) items.push({ id: 'accessibility', label: 'Accessibility' });
		if (doc?.keyboard?.length) items.push({ id: 'keyboard', label: 'Keyboard' });
		if (related.length) items.push({ id: 'related', label: 'Related' });
		return items;
	});
</script>

<DocPage title={entry.name} lead={doc?.summary} {toc}>
	{#snippet before()}
		<nav class="row ycenter wrap gap-xs text-sm text-muted" aria-label="Breadcrumb">
			<a href="/components" class="link-plain">Components</a>
			<Icon icon={luChevronRight} />
			<a href="/components#{entry.kit}" class="link-plain">{kit?.title ?? entry.kit}</a>
			<Icon icon={luChevronRight} />
			<span class="text-secondary" aria-current="page">{entry.name}</span>
		</nav>
	{/snippet}
	{#snippet meta()}
		<div class="row ycenter wrap gap-xs pt-xs">
			<span class={['tag text-xs soft', doc?.status === 'beta' ? 'warning' : 'success']}>{doc?.status ?? (doc ? 'stable' : 'draft')}</span>
			<span class="tag text-xs soft font-mono">{entry.kit}/{entry.slug}</span>
			{#if parts.length > 1}<span class="tag text-xs soft tabular-nums">{parts.length} parts</span>{/if}
		</div>
	{/snippet}

	{#if paragraphs.length}
		<div class="box gap-md text-body text-secondary lh16">
			{#each paragraphs as p, i (i)}<p><Rich text={p} /></p>{/each}
		</div>
	{/if}

	{#if doc?.features?.length}
		<Section id="features" title="Features">
			<ul class="grid-2 gap-sm">
				{#each doc.features as f, i (i)}
					<li class="row ytop gap-sm text-md text-secondary"><Icon icon={luCheck} class="text-theme shrink-0 mt-xs" /><span><Rich text={f} /></span></li>
				{/each}
			</ul>
		</Section>
	{/if}

	<Section id="installation" title="Installation">
		<InstallTabs />
		<p class="text-md text-secondary">Import the two stylesheets once, in your root layout:</p>
		<CodeBlock code={styleImports} lang="ts" title="src/routes/+layout.svelte" />
	</Section>

	<Section id="import" title="Import">
		<CodeBlock code={importLine} lang="ts" />
	</Section>

	{#if data.examples.length}
		<Section id="examples" title="Examples">
			<div class="box gap-2xl">
				{#each data.examples as ex (ex.key)}
					<Example example={ex} id={exampleId(ex.file)} />
				{/each}
			</div>
		</Section>
	{/if}

	{#if parts.length || doc?.api?.length}
		<Section id="api" title="API reference">
			<div class="box gap-xl">
				{#each parts as part (part.name)}
					<div class="box gap-sm">
						<h3 class="page-heading-bs row ycenter gap-sm"><code class="font-mono">{part.name}</code></h3>
						{#if part.name !== entry.name && doc?.parts?.[part.name]}
							<p class="text-md text-secondary"><Rich text={doc.parts[part.name]} /></p>
						{/if}
						<ApiTable {part} />
					</div>
				{/each}
				{#if doc?.api?.length}
					<div class="box gap-sm">
						<h3 class="page-heading-bs">Functions and values</h3>
						<div class="scroll-x border radius-bs">
							<table class="data-table">
								<thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
								<tbody>
									{#each doc.api as a (a.name)}
										<tr>
											<td><code class="font-mono text-sm weight-500">{a.name}</code></td>
											<td><code class="code-chip wrap-any">{a.type}</code></td>
											<td class="text-sm text-secondary"><Rich text={a.description} /></td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
		</Section>
	{/if}

	{#if doc?.accessibility?.length}
		<Section id="accessibility" title="Accessibility">
			<ul class="box gap-sm">
				{#each doc.accessibility as a, i (i)}
					<li class="row ytop gap-sm text-md text-secondary"><Icon icon={luCheck} class="text-success shrink-0 mt-xs" /><span><Rich text={a} /></span></li>
				{/each}
			</ul>
		</Section>
	{/if}

	{#if doc?.keyboard?.length}
		<Section id="keyboard" title="Keyboard">
			<div class="scroll-x border radius-bs">
				<table class="data-table">
					<thead><tr><th scope="col">Keys</th><th scope="col">Action</th></tr></thead>
					<tbody>
						{#each doc.keyboard as k, i (i)}
							<tr>
								<td>
									<span class="row wrap gap-xs">
										{#each k.keys.split(/\s*\/\s*/) as key, j (j)}<kbd class="code-chip">{key}</kbd>{/each}
									</span>
								</td>
								<td class="text-sm text-secondary"><Rich text={k.action} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Section>
	{/if}

	{#if related.length}
		<Section id="related" title="Related">
			<div class="row wrap gap-sm">
				{#each related as r (r.slug)}
					{#if r.entry}
						<a href={r.entry.href} class="button outline h-bs px-md mincurved text-sm">{r.entry.name}</a>
					{:else}
						<span class="tag soft text-sm text-muted">{r.slug} (coming)</span>
					{/if}
				{/each}
			</div>
		</Section>
	{/if}

	{#snippet footer()}
		<nav class="grid-2 gap-md pt-xl bt-sub" aria-label="More components">
			{#if data.prev}
				<a href={data.prev.href} class="link-parent box gap-xs border radius-bs pad-bs lift">
					<span class="row ycenter gap-xs text-sm text-muted"><Icon icon={luArrowLeft} /> Previous</span>
					<span class="link-title text-md weight-600">{data.prev.name}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if data.next}
				<a href={data.next.href} class="link-parent box xright gap-xs border radius-bs pad-bs lift">
					<span class="row ycenter gap-xs text-sm text-muted">Next <Icon icon={luArrowRight} /></span>
					<span class="link-title text-md weight-600">{data.next.name}</span>
				</a>
			{/if}
		</nav>
	{/snippet}
</DocPage>
