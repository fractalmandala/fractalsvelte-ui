<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luSearch } from '@fractaldesign/icons/lucide';
	import DocPage from '../../docs-site/DocPage.svelte';
	import { components, kitGroups } from '../../docs-site/registry.js';

	const groups = kitGroups();
	const total = components().length;
	let query = $state('');

	const q = $derived(query.trim().toLowerCase());
	const filtered = $derived(
		groups
			.map((g) => ({
				...g,
				shown: g.components.filter((c) => !q || `${c.name} ${c.slug} ${c.summary} ${g.kit.title}`.toLowerCase().includes(q))
			}))
			.filter((g) => !q || g.shown.length > 0)
	);
	const matches = $derived(filtered.reduce((n, g) => n + g.shown.length, 0));
	const toc = groups.map((g) => ({ id: g.kit.id, label: g.kit.title }));
</script>

<DocPage
	title="Components"
	eyebrow="Library"
	lead="Every component in fractalsvelte-ui, by kit. Each page is generated from its folder: live examples, source, and API tables extracted from the code."
	{toc}
>
	{#snippet meta()}
		<label class="field row ycenter gap-sm border radius-md bg-input px-md h-xl mt-md measure-md">
			<Icon icon={luSearch} class="text-muted shrink-0" />
			<span class="sr-only">Filter components</span>
			<input class="bare grow text-md" type="search" placeholder="Filter {total} components…" bind:value={query} />
		</label>
		{#if q}<p class="text-sm text-muted tabular-nums" aria-live="polite">{matches} {matches === 1 ? 'match' : 'matches'}</p>{/if}
	{/snippet}

	{#each filtered as g (g.kit.id)}
		<section class="box gap-md" aria-labelledby={g.kit.id}>
			<div class="box gap-xs">
				<h2 id={g.kit.id} class="page-heading-lg anchored row ycenter gap-sm">
					{g.kit.title}<span class="tag soft text-xs tabular-nums">{g.components.length}</span>
				</h2>
				<p class="text-md text-secondary">{g.kit.description}</p>
			</div>
			{#if g.shown.length}
				<div class="card-grid gap-sm">
					{#each g.shown as c (c.href)}
						<a href={c.href} class="link-parent box gap-xs border radius-bs bg-surface pad-bs lift">
							<span class="link-title text-md weight-600">{c.name}</span>
							<span class="text-sm text-secondary clamp-2">{c.summary || 'Documentation in progress.'}</span>
						</a>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted border-dashed radius-bs pad-bs">This kit is being built.</p>
			{/if}
		</section>
	{:else}
		<p class="text-md text-secondary">No component matches “{query}”.</p>
	{/each}
</DocPage>
