<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface FeatureItem {
		title: string;
		description: string;
		badge?: string;
		icon?: Snippet;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		columns?: 2 | 3 | 4;
		items?: FeatureItem[];
		bordered?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		columns = 3,
		items = [],
		bordered = true,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class="f-feature-grid {className}"
	data-columns={columns}
	data-bordered={bordered ? 'true' : undefined}
	{...restProps}
>
	{#each items as item}
		<div class="f-feature-card">
			<div class="f-feature-top">
				{#if item.icon}
					<div class="f-feature-icon">
						{@render item.icon()}
					</div>
				{/if}
				{#if item.badge}
					<span class="f-feature-badge">{item.badge}</span>
				{/if}
			</div>

			<h3 class="f-feature-title">{item.title}</h3>
			<p class="f-feature-desc">{item.description}</p>
		</div>
	{/each}

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-feature-grid {
			display: grid;
			gap: var(--f-space-xl);
			width: 100%;
			font-family: var(--f-font-sans);
			box-sizing: border-box;
		}

		.f-feature-grid[data-columns='2'] {
			grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		}

		.f-feature-grid[data-columns='3'] {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		}

		.f-feature-grid[data-columns='4'] {
			grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		}

		.f-feature-card {
			display: flex;
			flex-direction: column;
			padding: var(--f-space-xl);
			border-radius: var(--f-radius-lg);
			background: var(--f-surface);
			transition:
				transform var(--f-duration-normal) var(--f-ease-spring),
				box-shadow var(--f-duration-normal) var(--f-ease),
				border-color var(--f-duration-normal) var(--f-ease);
		}

		.f-feature-grid[data-bordered='true'] .f-feature-card {
			border: 1px solid var(--f-border);
			box-shadow: var(--f-shadow-xs);
		}

		.f-feature-grid[data-bordered='true'] .f-feature-card:hover {
			transform: translateY(-3px);
			box-shadow: var(--f-shadow-md);
			border-color: var(--f-border-strong);
		}

		.f-feature-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: var(--f-space-lg);
		}

		.f-feature-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 2.75rem;
			height: 2.75rem;
			border-radius: var(--f-radius-md);
			background: var(--f-primary-subtle);
			color: var(--f-primary);
			font-size: var(--f-text-xl);
		}

		.f-feature-badge {
			font-size: var(--f-text-xs);
			font-weight: 600;
			padding: 0.2rem 0.5rem;
			border-radius: var(--f-radius-full);
			background: var(--f-sunken);
			color: var(--f-text-muted);
		}

		.f-feature-title {
			margin: 0 0 var(--f-space-xs) 0;
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
			line-height: 1.3;
		}

		.f-feature-desc {
			margin: 0;
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			line-height: 1.6;
		}
	}
</style>
