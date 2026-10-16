<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string | null;
		code?: string;
		children?: Snippet;
		controls?: Snippet;
	}

	let { title, description, code = '', children, controls }: Props = $props();

	let copied = $state(false);

	async function copyCode() {
		if (!code) return;
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy', err);
		}
	}
</script>

<div class="f-preview-card">
	<div class="f-preview-header">
		<div>
			<h2 class="f-preview-title">{title}</h2>
			{#if description}
				<p class="f-preview-desc">{description}</p>
			{/if}
		</div>
		{#if code}
			<button
				type="button"
				class="f-copy-btn"
				onclick={copyCode}
				aria-label="Copy code"
			>
				{#if copied}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					<span>Copied</span>
				{:else}
					<svg
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
						<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
					</svg>
					<span>Copy Code</span>
				{/if}
			</button>
		{/if}
	</div>

	<!-- Live interactive render stage -->
	<div class="f-preview-stage">
		{#if children}
			{@render children()}
		{/if}
	</div>

	<!-- Interactive controls panel if present -->
	{#if controls}
		<div class="f-preview-controls">
			{@render controls()}
		</div>
	{/if}

	<!-- Code snippet display -->
	{#if code}
		<div class="f-preview-code">
			<pre><code>{code}</code></pre>
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-preview-card {
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-lg);
			background: var(--f-surface);
			overflow: hidden;
			margin-bottom: 2rem;
			box-shadow: var(--f-shadow-sm);
		}

		.f-preview-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 1.25rem 1.5rem;
			border-bottom: 1px solid var(--f-border-subtle);
			gap: 1rem;
		}

		.f-preview-title {
			font-size: var(--f-text-xl);
			font-weight: 700;
			color: var(--f-text);
			margin: 0 0 0.35rem 0;
		}

		.f-preview-desc {
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			margin: 0;
			line-height: 1.5;
		}

		.f-copy-btn {
			display: inline-flex;
			align-items: center;
			gap: 0.375rem;
			padding: 0.4rem 0.75rem;
			font-size: var(--f-text-xs);
			font-weight: 600;
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-sm);
			background: var(--f-surface);
			color: var(--f-text);
			cursor: pointer;
			transition: background var(--f-duration-fast) var(--f-ease),
				color var(--f-duration-fast) var(--f-ease);
			flex-shrink: 0;
		}

		.f-copy-btn:hover {
			background: var(--f-hover);
			color: var(--f-primary);
		}

		.f-preview-stage {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 160px;
			padding: 2.5rem 1.5rem;
			background: var(--f-sunken);
			background-image: radial-gradient(var(--f-border) 1px, transparent 1px);
			background-size: 20px 20px;
			overflow-x: auto;
		}

		.f-preview-controls {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 1rem;
			padding: 1rem 1.5rem;
			background: var(--f-surface);
			border-top: 1px solid var(--f-border-subtle);
			border-bottom: 1px solid var(--f-border-subtle);
			font-size: var(--f-text-sm);
		}

		.f-preview-code {
			background: var(--f-bg);
			padding: 1rem 1.5rem;
			overflow-x: auto;
		}

		.f-preview-code pre {
			margin: 0;
			font-family: var(--f-font-mono);
			font-size: var(--f-text-xs);
			color: var(--f-text-muted);
			line-height: 1.6;
		}

		.f-preview-code code {
			font-family: inherit;
		}
	}
</style>
