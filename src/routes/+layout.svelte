<script lang="ts">
	import '#lib/styles/index.sass';
	import { components, categories } from '#lib/docs/catalogue.js';
	import { guides } from '#lib/docs/guides.js';
	import { page } from '$app/state';
	import { MotionConfig } from '@humanspeak/svelte-motion';
	import Menu from '$lib/icons/menu.svelte';
	import Chevdown from '$lib/icons/chevdown.svelte';

	let openSidebarSection = $state<string | null>(null);
	let mobileNavOpen = $state(false);
	let tocOpen = $state(false);
	let { children } = $props();
	type TocItem = { id: string; label: string; level: 2 | 3 };

	function slugify(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	let tocItems = $derived.by((): TocItem[] => {
		const pathname = page.url.pathname;
		const componentMatch = pathname.match(/^\/components\/([^/]+)/);
		if (componentMatch)
			return [
				{ id: 'preview-heading', label: 'Live preview', level: 2 },
				{ id: 'usage-heading', label: 'Usage', level: 2 },
				{ id: 'props-heading', label: 'Props', level: 2 },
				{ id: 'styling-heading', label: 'Styling contract', level: 2 }
			];
		const guideMatch = pathname.match(/^\/guides\/([^/]+)/);
		const guide = guideMatch ? guides.find((item) => item.slug === guideMatch[1]) : undefined;
		return (guide?.markdown.match(/^#{2,3}\s+.+$/gm) ?? []).map((heading) => {
			const match = heading.match(/^(#{2,3})\s+(.+)$/);
			const label = match?.[2] ?? heading;
			return { id: slugify(label), label, level: (match?.[1].length ?? 2) as 2 | 3 };
		});
	});

	// Automatically open current category/docs section
	$effect(() => {
		const pathname = page.url.pathname;
		if (pathname.startsWith('/guides')) {
			if (openSidebarSection === null) openSidebarSection = 'docs';
		} else {
			const comp = components.find((c) => pathname === `/components/${c.slug}`);
			if (comp && openSidebarSection === null) {
				openSidebarSection = comp.category;
			}
		}
	});

	// Close drawers and menus when changing routes
	$effect(() => {
		const _ = page.url.pathname;
		mobileNavOpen = false;
		tocOpen = false;
	});

	// Handle click outside and Escape key
	$effect(() => {
		if (!tocOpen && !mobileNavOpen) return;

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				tocOpen = false;
				mobileNavOpen = false;
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

	function toggleSidebarSection(section: string) {
		openSidebarSection = openSidebarSection === section ? null : section;
	}

	function closeMobileNav() {
		mobileNavOpen = false;
	}

	function closeToc() {
		tocOpen = false;
	}
</script>

<svelte:head>
	<title>Fractalsvelte UI — Svelte components</title>
	<meta
		name="description"
		content="A considered SvelteKit component library documented in its own interface."
	/>
</svelte:head>

{#snippet navTree(onSelect?: () => void)}
	<nav class="docs-nav navtree" aria-label="Documentation navigation">
		<div class="navtree-group">
			<a
				class="navtree-link"
				aria-current={page.url.pathname === '/' ? 'page' : undefined}
				href="/"
				onclick={onSelect}
			>
				<span>Introduction</span>
			</a>
		</div>
		<div class="navtree-group">
			<button
				class="navtree-link"
				type="button"
				aria-expanded={openSidebarSection === 'docs'}
				onclick={() => toggleSidebarSection('docs')}
			>
				<span>Docs</span>
				<span class="navtree-chevron" class:open={openSidebarSection === 'docs'}>
					<Chevdown />
				</span>
			</button>
			{#if openSidebarSection === 'docs'}
				<div class="navtree-sub">
					<a
						class="navtree-link level2"
						class:active={page.url.pathname === '/guides'}
						aria-current={page.url.pathname === '/guides' ? 'page' : undefined}
						href="/guides"
						onclick={onSelect}
					>Overview</a>
					{#each guides as guide}
						<a
							class="navtree-link level2"
							class:active={page.url.pathname === `/guides/${guide.slug}`}
							aria-current={page.url.pathname === `/guides/${guide.slug}`
								? 'page'
								: undefined}
							href={`/guides/${guide.slug}`}
							onclick={onSelect}
						>{guide.title}</a>
					{/each}
				</div>
			{/if}
		</div>
		{#each categories as category}
			<div class="navtree-group">
				<button
					class="navtree-link"
					class:active={components.some(
						(component) =>
							component.category === category &&
							page.url.pathname === `/components/${component.slug}`
					)}
					type="button"
					aria-expanded={openSidebarSection === category}
					onclick={() => toggleSidebarSection(category)}
				>
					<span>{category}</span>
					<span class="navtree-chevron" class:open={openSidebarSection === category}>
						<Chevdown />
					</span>
				</button>
				{#if openSidebarSection === category}
					<div class="navtree-sub">
						{#each components.filter((component) => component.category === category) as component}
							<a
								class="navtree-link level2"
								class:active={page.url.pathname === `/components/${component.slug}`}
								aria-current={page.url.pathname === `/components/${component.slug}`
									? 'page'
									: undefined}
								href={`/components/${component.slug}`}
								onclick={onSelect}
							>{component.name}</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>
{/snippet}

<MotionConfig reducedMotion="user">
	<div class="app-shell">
		<header class="app-header">
			<a class="row ycenter gap-xs xleft" href="/">
				<img class="logomotif" src="/images/logomotif.png" alt="motif" />
				<img class="logotype" src="/images/logotype-d.png" alt="logotype" />
			</a>

			<div class="row ycenter gap-xs">
				<nav class="primary-nav row ycenter gap-sm" aria-label="Primary navigation">
					<a class="text-md" href="/">Introduction</a>
					<a class="text-md" href="/components/button">Components</a>
					<a class="text-md" href="/guides">Guides</a>
				</nav>
				<button
					class="is-icon mobile-menu"
					type="button"
					aria-label="Toggle navigation menu"
					aria-expanded={mobileNavOpen}
					onclick={() => (mobileNavOpen = !mobileNavOpen)}
				>
					<Menu />
				</button>
			</div>
		</header>

		<div
			class="mobile-nav-backdrop"
			class:open={mobileNavOpen}
			onclick={closeMobileNav}
			aria-hidden="true"
		></div>

		<aside
			class="mobile-nav-panel"
			class:open={mobileNavOpen}
			aria-label="Mobile navigation"
			aria-hidden={!mobileNavOpen}
		>
			<div class="mobile-nav-header row ycenter xright pad-md shrink-0">
				<button
					type="button"
					class="is-icon text-secondary"
					aria-label="Close menu"
					onclick={closeMobileNav}
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<div class="mobile-nav-body grow pad-md">
				{@render navTree(closeMobileNav)}
			</div>
		</aside>

		<main class="app-main">
			<aside class="sidebar-left">
				{@render navTree()}
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
												onclick={closeToc}
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
				{#if tocItems.length}
					<nav class="box gap-md" aria-label="On this page">
						<div class="text-sm text-muted">On this page</div>
						<nav class="box xleft gap-sm" aria-label="Table of contents">
							{#each tocItems as item}
								<a class="text-sm text-secondary link-plain" data-depth={item.level} href={`#${item.id}`} onclick={closeToc}
									>{item.label}</a
								>
							{/each}
						</nav>
					</nav>
				{/if}
			</aside>
		</main>
	</div>
</MotionConfig>
