<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import '$lib/styles/tokens.css';
	import '$lib/styles/index.sass'
	import ThemeToggle from '$lib/components/doc/ThemeToggle.svelte';
	import manifest from '$lib/documentation/manifest.styler.json';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let searchQuery = $state('');

	const isRawCanvas = $derived(
		page.url.pathname.startsWith('/canvas') ||
		page.url.pathname.startsWith('/raw') ||
		page.url.searchParams.has('raw') ||
		page.url.searchParams.has('canvas')
	);

	const categories = [
		{ id: 'actions', name: 'Actions & Buttons', icon: '⚡' },
		{ id: 'forms', name: 'Forms & Inputs', icon: '📝' },
		{ id: 'display', name: 'Data Display', icon: '📊' },
		{ id: 'layout', name: 'Layout & Bento', icon: '📐' },
		{ id: 'navigation', name: 'Navigation & Shells', icon: '🧭' },
		{ id: 'overlays', name: 'Overlays & Dialogs', icon: '🪟' },
		{ id: 'typography', name: 'Typography & Code', icon: '✍️' },
		{ id: 'motion', name: 'Motion & Animations', icon: '✨' },
		{ id: 'blocks', name: 'UI Blocks & Diagrams', icon: '🧩' }
	];

	const componentsByCategory = $derived.by(() => {
		const map: Record<string, typeof manifest.components> = {};
		for (const cat of categories) {
			map[cat.id] = [];
		}

		const q = searchQuery.toLowerCase().trim();
		for (const c of manifest.components) {
			if (c.category === 'doc') continue;
			if (q && !c.name.toLowerCase().includes(q)) continue;
			if (!map[c.category]) map[c.category] = [];
			map[c.category].push(c);
		}
		return map;
	});
</script>

{#if isRawCanvas}
	{@render children?.()}
{:else}
<div class="f-app-layout">
	<!-- Global Top Navigation Header -->
	<header class="f-app-header">
		<div class="f-header-brand">
			<a href="/" class="f-logo-link">
				<span class="f-logo-mark">F</span>
				<span class="f-logo-text">Fractal <strong>UI</strong></span>
			</a>
			<span class="f-version-badge">v0.1.0</span>
			<span class="f-runes-badge">Svelte 5 Runes</span>
		</div>

		<div class="f-header-search">
			<svg
				class="f-search-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Filter 106+ components..."
				class="f-search-input"
			/>
		</div>

		<div class="f-header-actions">
			<a href="#tokens" class="f-header-link">Tokens</a>
			<ThemeToggle />
		</div>
	</header>

	<div class="f-app-body">
		<!-- Sidebar Directory -->
		<aside class="f-app-sidebar">
			<div class="f-sidebar-scroll">
				{#each categories as cat}
					{@const list = componentsByCategory[cat.id] || []}
					{#if list.length > 0}
						<div class="f-sidebar-group">
							<div class="f-group-title">
								<span class="f-group-icon">{cat.icon}</span>
								<span>{cat.name}</span>
								<span class="f-group-count">{list.length}</span>
							</div>

							<ul class="f-group-list">
								{#each list as c}
									<li>
										<a href="/styler/{c.name}" class="f-nav-item">
											{c.name}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		</aside>

		<!-- Main Workspace -->
		<main class="f-app-main">
			{@render children?.()}
		</main>
	</div>
</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		font-family: var(--f-font-sans);
		background-color: var(--f-bg);
		color: var(--f-text);
		-webkit-font-smoothing: antialiased;
	}

	.f-app-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.f-app-header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
		padding: 0 1.5rem;
		background: var(--f-surface);
		border-bottom: 1px solid var(--f-border);
		backdrop-filter: blur(8px);
	}

	.f-header-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.f-logo-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--f-text);
	}

	.f-logo-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: var(--f-primary);
		color: var(--f-primary-text);
		font-weight: 800;
		border-radius: var(--f-radius-sm);
		font-size: 1rem;
	}

	.f-logo-text {
		font-size: var(--f-text-lg);
		letter-spacing: -0.02em;
	}

	.f-version-badge {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--f-text-muted);
		background: var(--f-sunken);
		padding: 2px 6px;
		border-radius: var(--f-radius-xs);
		border: 1px solid var(--f-border);
	}

	.f-runes-badge {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--f-primary);
		background: var(--f-primary-subtle);
		padding: 2px 6px;
		border-radius: var(--f-radius-xs);
	}

	.f-header-search {
		position: relative;
		display: flex;
		align-items: center;
		width: 320px;
	}

	.f-search-icon {
		position: absolute;
		left: 10px;
		color: var(--f-text-muted);
		pointer-events: none;
	}

	.f-search-input {
		width: 100%;
		height: 34px;
		padding: 0 10px 0 32px;
		background: var(--f-sunken);
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-md);
		color: var(--f-text);
		font-family: inherit;
		font-size: var(--f-text-xs);
		outline: none;
		transition: border-color var(--f-duration-fast) var(--f-ease);
	}

	.f-search-input:focus {
		border-color: var(--f-primary);
	}

	.f-header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.f-header-link {
		font-size: var(--f-text-sm);
		font-weight: 500;
		color: var(--f-text-muted);
		text-decoration: none;
	}

	.f-header-link:hover {
		color: var(--f-primary);
	}

	.f-app-body {
		display: flex;
		flex: 1;
	}

	.f-app-sidebar {
		width: 270px;
		border-right: 1px solid var(--f-border);
		background: var(--f-surface);
		flex-shrink: 0;
		position: sticky;
		top: 60px;
		height: calc(100vh - 60px);
		overflow: hidden;
	}

	.f-sidebar-scroll {
		height: 100%;
		overflow-y: auto;
		padding: 1.25rem 1rem 3rem 1rem;
		box-sizing: border-box;
	}

	.f-sidebar-group {
		margin-bottom: 1.5rem;
	}

	.f-group-title {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: var(--f-text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--f-text-muted);
		margin-bottom: 0.5rem;
		padding: 0 0.5rem;
	}

	.f-group-count {
		margin-left: auto;
		font-size: 0.7rem;
		font-weight: 600;
		background: var(--f-hover);
		color: var(--f-text-subtle);
		padding: 1px 5px;
		border-radius: var(--f-radius-xs);
	}

	.f-group-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.f-nav-item {
		display: block;
		padding: 0.35rem 0.65rem;
		font-size: var(--f-text-sm);
		color: var(--f-text);
		text-decoration: none;
		border-radius: var(--f-radius-sm);
		transition: background var(--f-duration-fast) var(--f-ease),
			color var(--f-duration-fast) var(--f-ease);
	}

	.f-nav-item:hover {
		background: var(--f-hover);
		color: var(--f-primary);
	}

	.f-app-main {
		flex: 1;
		min-width: 0;
		background: var(--f-bg);
	}

	@media (max-width: 768px) {
		.f-app-sidebar {
			display: none;
		}
		.f-header-search {
			display: none;
		}
	}
</style>
