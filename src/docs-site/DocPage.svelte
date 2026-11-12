<script lang="ts">
	import type { Snippet } from 'svelte';
	import Rich from './Rich.svelte';
	import Toc, { type TocItem } from './Toc.svelte';

	interface Props {
		/** The page title (also the document title). */
		title: string;
		/** The lead paragraph under the title; `code` spans allowed. */
		lead?: string;
		/** A small label above the title. */
		eyebrow?: string;
		/** The right-rail table of contents. */
		toc?: TocItem[];
		/** Above the title (a breadcrumb). */
		before?: Snippet;
		/** Extra header content under the lead (badges, a filter). */
		meta?: Snippet;
		/** The page body. */
		children: Snippet;
		/** Footer content (prev / next). */
		footer?: Snippet;
	}

	let { title, lead, eyebrow, toc = [], before, meta, children, footer }: Props = $props();
</script>

<svelte:head>
	<title>{title} · fractalsvelte-ui</title>
	{#if lead}<meta name="description" content={lead.replace(/`/g, '')} />{/if}
</svelte:head>

<main class="main-section min0">
	<article class="content-section narrow-half box gap-2xl pt-2xl pb-3xl">
		<header class="page-header gap-sm">
			{#if before}{@render before()}{/if}
			{#if eyebrow}<p class="text-sm text-theme weight-500">{eyebrow}</p>{/if}
			<h1 class="page-title ls-tight-lg">{title}</h1>
			{#if lead}<p class="page-desc text-secondary lh15 measure-xl"><Rich text={lead} /></p>{/if}
			{#if meta}{@render meta()}{/if}
		</header>
		{@render children()}
		{#if footer}{@render footer()}{/if}
	</article>
</main>
<aside class="sidebar-right">
	<Toc items={toc} />
</aside>
