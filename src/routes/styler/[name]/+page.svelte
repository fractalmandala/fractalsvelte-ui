<script lang="ts">
	import PropsTable from '$lib/components/doc/PropsTable.svelte';
	import DynamicPreview from './DynamicPreview.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const comp = $derived(data.component);

	let copiedSource = $state(false);
	let copiedImport = $state(false);

	const variantProps = $derived(
		comp.props.filter((p: any) =>
			['variant', 'size', 'shape', 'intent', 'placement', 'orientation', 'elevation', 'radius', 'role', 'status'].includes(p.name) ||
			(p.type && p.type.includes('|') && !p.type.includes('undefined') && !p.type.includes('HTML') && !p.type.includes('Snippet'))
		)
	);

	function parseUnionValues(typeStr: string): string[] {
		if (!typeStr) return [];
		return typeStr
			.split('|')
			.map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
			.filter((s) => s && s !== 'undefined' && s !== 'null' && !s.startsWith('{') && !s.includes('=>') && !s.includes('HTML'));
	}

	async function copyText(text: string, isSource: boolean) {
		try {
			await navigator.clipboard.writeText(text);
			if (isSource) {
				copiedSource = true;
				setTimeout(() => (copiedSource = false), 2000);
			} else {
				copiedImport = true;
				setTimeout(() => (copiedImport = false), 2000);
			}
		} catch (err) {
			console.error('Failed to copy', err);
		}
	}
</script>

<svelte:head>
	<title>{comp.name} — Fractal UI</title>
</svelte:head>

<div class="f-doc-page">
	<!-- Breadcrumb / Category header -->
	<div class="f-doc-meta">
		<a href="/" class="f-doc-back">Overview</a>
		<span class="f-doc-sep">/</span>
		<span class="f-doc-cat">{comp.category}</span>
		<span class="f-doc-sep">/</span>
		<span class="f-doc-current">{comp.name}</span>
	</div>

	<!-- Component Title & Description -->
	<header class="f-doc-header">
		<h1 class="f-doc-title">{comp.name}</h1>
		{#if comp.description}
			<p class="f-doc-summary">{comp.description}</p>
		{/if}
	</header>

	<!-- Import Code Snippet -->
	<section class="f-doc-section">
		<div class="f-section-title-row">
			<h2 class="f-section-heading">Import</h2>
			<button
				type="button"
				class="f-mini-copy-btn"
				onclick={() => copyText(comp.importSnippet, false)}
			>
				{copiedImport ? 'Copied!' : 'Copy Import'}
			</button>
		</div>
		<div class="f-code-card">
			<pre><code>{comp.importSnippet}</code></pre>
		</div>
	</section>

	<!-- Live Interactive Preview Section -->
	<section class="f-doc-section">
		<h2 class="f-section-heading">Interactive Preview</h2>
		<DynamicPreview name={comp.name} category={comp.category} />
	</section>

	<!-- Supported Design Variants Section -->
	{#if variantProps.length > 0}
		<section class="f-doc-section">
			<h2 class="f-section-heading">Supported Design Variants & Dimensions</h2>
			<div class="f-variants-grid">
				{#each variantProps as vp}
					<div class="f-variant-card">
						<div class="f-variant-card-header">
							<span class="f-variant-prop-name">{vp.name}</span>
							{#if vp.default}
								<span class="f-variant-default-label">Default: <code>{vp.default}</code></span>
							{/if}
						</div>
						<div class="f-variant-chips-wrap">
							{#each parseUnionValues(vp.type) as val}
								<span
									class="f-variant-chip"
									class:is-active-default={val === vp.default?.replace(/['"]/g, '')}
								>
									{val}
									{#if val === vp.default?.replace(/['"]/g, '')}
										<span class="f-chip-dot"></span>
									{/if}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Live Usage / Preview Section -->
	<section class="f-doc-section">
		<h2 class="f-section-heading">Usage</h2>
		<div class="f-code-card">
			<pre><code>{comp.usageSnippet}</code></pre>
		</div>
	</section>

	<!-- API Props Table -->
	<section class="f-doc-section">
		<h2 class="f-section-heading">API Reference</h2>

		{#if comp.extends?.base}
			<div class="f-extends-badge">
				Extends: <code>{comp.extends.base}</code>
				{#if comp.extends.omit?.length}
					(omits: {comp.extends.omit.map((o: string) => `'${o}'`).join(', ')})
				{/if}
			</div>
		{/if}

		<PropsTable items={comp.props} title="Properties" />

		{#if comp.snippets?.length}
			<PropsTable items={comp.snippets} title="Snippets" />
		{/if}

		{#if comp.types?.length}
			<div class="f-types-box">
				<h3 class="f-types-heading">Exported Types</h3>
				{#each comp.types as t}
					<div class="f-type-row">
						<code>export type {t.name} = {t.definition}</code>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Verbatim Source Code -->
	<section class="f-doc-section">
		<div class="f-section-title-row">
			<h2 class="f-section-heading">Source Code</h2>
			<button
				type="button"
				class="f-mini-copy-btn"
				onclick={() => copyText(comp.code, true)}
			>
				{copiedSource ? 'Copied Source!' : 'Copy Full Source'}
			</button>
		</div>
		<div class="f-source-card">
			<pre><code>{comp.code}</code></pre>
		</div>
	</section>
</div>

<style>
	.f-doc-page {
		max-width: 960px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 5rem 1.5rem;
		box-sizing: border-box;
	}

	.f-doc-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: var(--f-text-xs);
		color: var(--f-text-muted);
		margin-bottom: 1.25rem;
	}

	.f-doc-back {
		color: var(--f-primary);
		text-decoration: none;
		font-weight: 500;
	}

	.f-doc-back:hover {
		text-decoration: underline;
	}

	.f-doc-sep {
		color: var(--f-border-strong);
	}

	.f-doc-cat {
		text-transform: capitalize;
	}

	.f-doc-current {
		color: var(--f-text);
		font-weight: 600;
	}

	.f-doc-header {
		margin-bottom: 2.5rem;
	}

	.f-doc-title {
		font-size: var(--f-text-3xl);
		font-weight: 800;
		color: var(--f-text);
		letter-spacing: -0.03em;
		margin: 0 0 0.75rem 0;
	}

	.f-doc-summary {
		font-size: var(--f-text-lg);
		color: var(--f-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	.f-doc-section {
		margin-bottom: 2.5rem;
	}

	.f-section-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.f-section-heading {
		font-size: var(--f-text-xl);
		font-weight: 700;
		color: var(--f-text);
		margin: 0;
	}

	.f-mini-copy-btn {
		font-size: var(--f-text-xs);
		font-weight: 600;
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-sm);
		background: var(--f-surface);
		color: var(--f-text);
		cursor: pointer;
		transition: background var(--f-duration-fast) var(--f-ease),
			color var(--f-duration-fast) var(--f-ease);
	}

	.f-mini-copy-btn:hover {
		background: var(--f-hover);
		color: var(--f-primary);
	}

	.f-code-card {
		background: var(--f-sunken);
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-md);
		padding: 1rem 1.25rem;
		overflow-x: auto;
	}

	.f-code-card pre {
		margin: 0;
		font-family: var(--f-font-mono);
		font-size: var(--f-text-sm);
		color: var(--f-text);
	}

	.f-extends-badge {
		margin-bottom: 1rem;
		font-size: var(--f-text-xs);
		color: var(--f-text-muted);
	}

	.f-extends-badge code {
		font-family: var(--f-font-mono);
		background: var(--f-sunken);
		padding: 0.15rem 0.35rem;
		border-radius: var(--f-radius-xs);
		color: var(--f-primary);
	}

	.f-types-box {
		margin-top: 1.5rem;
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-md);
		padding: 1rem 1.25rem;
		background: var(--f-surface);
	}

	.f-types-heading {
		font-size: var(--f-text-base);
		font-weight: 600;
		color: var(--f-text);
		margin: 0 0 0.75rem 0;
	}

	.f-type-row {
		font-size: var(--f-text-xs);
		color: var(--f-text-muted);
		padding: 0.35rem 0;
		border-bottom: 1px solid var(--f-border-subtle);
	}

	.f-type-row:last-child {
		border-bottom: none;
	}

	.f-type-row code {
		font-family: inherit;
		color: var(--f-primary);
	}

	.f-source-card {
		background: var(--f-bg);
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-lg);
		padding: 1.25rem;
		overflow-x: auto;
		max-height: 520px;
		box-shadow: var(--f-shadow-sm);
	}

	.f-source-card pre {
		margin: 0;
		font-family: var(--f-font-mono);
		font-size: var(--f-text-xs);
		color: var(--f-text);
		line-height: 1.6;
	}

	/* Variants Grid */
	.f-variants-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.f-variant-card {
		padding: 1.25rem;
		background: var(--f-surface);
		border: 1px solid var(--f-border);
		border-radius: var(--f-radius-md);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.f-variant-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.f-variant-default-label {
		font-size: var(--f-text-xs);
		color: var(--f-text-muted);
	}

	.f-variant-default-label code {
		font-family: var(--f-font-mono);
		color: var(--f-text);
	}

	.f-variant-chips-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.f-variant-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.6rem;
		border-radius: var(--f-radius-sm);
		background: var(--f-sunken);
		border: 1px solid var(--f-border-subtle);
		font-size: var(--f-text-xs);
		color: var(--f-text);
	}

	.f-variant-chip.is-active-default {
		background: var(--f-primary-subtle);
		border-color: var(--f-primary);
		color: var(--f-primary);
		font-weight: 600;
	}

	.f-chip-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--f-primary);
	}
</style>
