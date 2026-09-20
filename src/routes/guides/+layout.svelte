<script lang="ts">
	import type { Snippet } from 'svelte';
	import DocsNav from '#lib/docs/DocsNav.svelte';
	import Chevdown from '#lib/icons/chevdown.svelte';
	import { guides } from '#lib/docs/guides.ts';
	import { page } from '$app/state';

	type TocItem = { id: string; label: string; level: 2 | 3 };

	let { children }: { children: Snippet } = $props();
	let tocOpen = $state(false);

	function slugify(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	let tocItems = $derived.by((): TocItem[] => {
		const pathname = page.url.pathname;
		const guideMatch = pathname.match(/^\/guides\/([^/]+)/);
		const guide = guideMatch ? guides.find((item) => item.slug === guideMatch[1]) : undefined;
		if (!guide) return [];
		return (guide.markdown.match(/^#{2,3}\s+.+$/gm) ?? []).map((heading) => {
			const match = heading.match(/^(#{2,3})\s+(.+)$/);
			const label = match?.[2] ?? heading;
			return { id: slugify(label), label, level: (match?.[1].length ?? 2) as 2 | 3 };
		});
	});

	// Close TOC drawer when changing routes
	$effect(() => {
		const _ = page.url.pathname;
		tocOpen = false;
	});

	// Handle click outside and Escape key for TOC dropdown
	$effect(() => {
		if (!tocOpen) return;

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				tocOpen = false;
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (tocOpen) {
				const target = e.target as HTMLElement | null;
				if (!target?.closest('.content-toc-dropdown')) {
					tocOpen = false;
				}
			}
		}

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('click', handleClickOutside);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<aside class="sidebar-left">
	<DocsNav />
</aside>
<section class="main-section">
	{#if tocItems.length > 0}
		<div class="content-toc-dropdown content-section narrow-full marg-bottom-md">
			<div class="toc-dropdown" class:open={tocOpen}>
				<button
					type="button"
					class="toc-trigger"
					aria-expanded={tocOpen}
					aria-haspopup="menu"
					onclick={() => (tocOpen = !tocOpen)}
				>
					<span>On this page</span>
					<span class="toc-trigger-icon" class:rotated={tocOpen}>
						<Chevdown />
					</span>
				</button>
				{#if tocOpen}
					<div class="toc-dropdown-menu" role="menu">
						<div class="toc-dropdown-header">On this page</div>
						<div class="box gap-3xs">
							{#each tocItems as item}
								<a
									class="toc-dropdown-link"
									class:level3={item.level === 3}
									data-depth={item.level}
									href={`#${item.id}`}
									onclick={() => (tocOpen = false)}
								>
									{item.label}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{@render children()}
</section>
<aside class="sidebar-right">
	{#if tocItems.length > 0}
		<nav class="box gap-md" aria-label="On this page">
			<div class="text-sm text-muted">On this page</div>
			<nav class="box xleft gap-sm" aria-label="Table of contents">
				{#each tocItems as item}
					<a
						class="text-sm text-secondary link-plain"
						data-depth={item.level}
						href={`#${item.id}`}
						onclick={() => (tocOpen = false)}
					>{item.label}</a>
				{/each}
			</nav>
		</nav>
	{/if}
</aside>
