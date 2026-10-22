<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface BreadcrumbItem {
		label: string;
		href?: string;
		current?: boolean;
	}

	export interface Props extends HTMLAttributes<HTMLElement> {
		/** Array of breadcrumb trail steps */
		items?: BreadcrumbItem[];
		/** Maximum number of breadcrumb steps displayed before middle truncation (0 disables truncation) */
		maxItems?: number;
		/** Additional CSS classes */
		class?: string;
		/** Custom children slot for manual breadcrumb items */
		children?: Snippet;
		/** Custom separator icon snippet */
		separator?: Snippet;
		/** Optional home root icon snippet */
		home?: Snippet;
	}

	let {
		items = [],
		maxItems = 0,
		class: className = '',
		children,
		separator,
		home,
		...restProps
	}: Props = $props();

	let expanded = $state(false);

	const visibleItems = $derived.by(() => {
		if (expanded || maxItems <= 0 || items.length <= maxItems) {
			return { collapsed: false, leading: items, trailing: [] };
		}
		// Show first item, ellipsis, and last (maxItems - 1) items
		const leading = items.slice(0, 1);
		const trailing = items.slice(-(maxItems - 1));
		return { collapsed: true, leading, trailing };
	});
</script>

<nav
	class="f-breadcrumb {className}"
	aria-label="Breadcrumbs"
	{...restProps}
>
	<ol class="f-breadcrumb-list">
		{#if home}
			<li class="f-breadcrumb-item">
				<span class="f-breadcrumb-home">
					{@render home()}
				</span>
			</li>
			{#if items.length > 0}
				<li class="f-breadcrumb-separator" aria-hidden="true">
					{#if separator}
						{@render separator()}
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					{/if}
				</li>
			{/if}
		{/if}

		{#if visibleItems.collapsed}
			{#each visibleItems.leading as entry (entry.label + entry.href)}
				<li class="f-breadcrumb-item">
					{#if entry.href}
						<a href={entry.href} class="f-breadcrumb-link">
							{entry.label}
						</a>
					{:else}
						<span class="f-breadcrumb-text">{entry.label}</span>
					{/if}
				</li>
			{/each}

			<li class="f-breadcrumb-separator" aria-hidden="true">
				{#if separator}
					{@render separator()}
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m9 18 6-6-6-6" />
					</svg>
				{/if}
			</li>

			<li class="f-breadcrumb-item">
				<button
					type="button"
					class="f-breadcrumb-ellipsis"
					aria-label="Show all breadcrumb items"
					onclick={() => (expanded = true)}
				>
					&hellip;
				</button>
			</li>

			{#each visibleItems.trailing as entry, idx (entry.label + entry.href)}
				<li class="f-breadcrumb-separator" aria-hidden="true">
					{#if separator}
						{@render separator()}
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					{/if}
				</li>
				{@const isLast = idx === visibleItems.trailing.length - 1}
				{@const isCurrent = entry.current ?? isLast}
				<li class="f-breadcrumb-item">
					{#if isCurrent}
						<span class="f-breadcrumb-current" aria-current="page">
							{entry.label}
						</span>
					{:else if entry.href}
						<a href={entry.href} class="f-breadcrumb-link">
							{entry.label}
						</a>
					{:else}
						<span class="f-breadcrumb-text">{entry.label}</span>
					{/if}
				</li>
			{/each}
		{:else}
			{#each items as entry, idx (entry.label + entry.href)}
				{@const isLast = idx === items.length - 1}
				{@const isCurrent = entry.current ?? isLast}
				{#if idx > 0}
					<li class="f-breadcrumb-separator" aria-hidden="true">
						{#if separator}
							{@render separator()}
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						{/if}
					</li>
				{/if}

				<li class="f-breadcrumb-item">
					{#if isCurrent}
						<span class="f-breadcrumb-current" aria-current="page">
							{entry.label}
						</span>
					{:else if entry.href}
						<a href={entry.href} class="f-breadcrumb-link">
							{entry.label}
						</a>
					{:else}
						<span class="f-breadcrumb-text">{entry.label}</span>
					{/if}
				</li>
			{/each}
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</ol>
</nav>

<style>
	@layer fractalsvelte-ui.components {
		.f-breadcrumb {
			display: flex;
			align-items: center;
			box-sizing: border-box;
		}

		.f-breadcrumb-list {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: var(--f-space-xs);
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.f-breadcrumb-item {
			display: inline-flex;
			align-items: center;
			font-size: var(--f-text-sm);
		}

		.f-breadcrumb-separator {
			display: inline-flex;
			align-items: center;
			color: var(--f-text-subtle);
			user-select: none;
		}

		.f-breadcrumb-link {
			color: var(--f-text-muted);
			text-decoration: none;
			transition: color var(--f-duration-fast) var(--f-ease);
		}

		.f-breadcrumb-link:hover {
			color: var(--f-text);
			text-decoration: underline;
		}

		.f-breadcrumb-link:focus-visible {
			outline: 2px solid var(--f-ring);
			outline-offset: 2px;
			border-radius: var(--f-radius-xs);
		}

		.f-breadcrumb-text {
			color: var(--f-text-muted);
		}

		.f-breadcrumb-current {
			color: var(--f-text);
			font-weight: 600;
		}

		.f-breadcrumb-ellipsis {
			background: var(--f-sunken);
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-xs);
			color: var(--f-text-muted);
			font-size: var(--f-text-xs);
			cursor: pointer;
			padding: 0 4px;
			line-height: 1.2;
			transition: background var(--f-duration-fast) var(--f-ease);
		}

		.f-breadcrumb-ellipsis:hover {
			background: var(--f-hover);
			color: var(--f-text);
		}

		.f-breadcrumb-home {
			display: inline-flex;
			align-items: center;
			color: var(--f-text-muted);
		}
	}
</style>
