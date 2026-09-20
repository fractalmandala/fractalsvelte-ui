<script lang="ts">
	import type { Snippet } from 'svelte';
	import DocsNav from '#lib/docs/DocsNav.svelte';
	import Chevdown from '#lib/icons/chevdown.svelte';
	import { page } from '$app/state';

	type TocItem = { id: string; label: string; level: 2 | 3 };

	let { children }: { children: Snippet } = $props();
	let tocOpen = $state(false);

	let tocItems = $derived.by((): TocItem[] => {
		const pathname = page.url.pathname;
		const componentMatch = pathname.match(/^\/components\/[^/]+\/([^/]+)/);
		if (componentMatch) {
			return [
				{ id: 'preview-heading', label: 'Live preview', level: 2 },
				{ id: 'usage-heading', label: 'Usage', level: 2 },
				{ id: 'props-heading', label: 'Props', level: 2 },
				{ id: 'styling-heading', label: 'Styling contract', level: 2 }
			];
		}
		return [];
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
