<script lang="ts">
	import type { PageData } from './$types';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import ButtonDemos from '#lib/components/ButtonDemos.svelte';
	import SliderDemos from '#lib/components/SliderDemos.svelte';
	import DropdownMenuDemos from '#lib/components/DropdownMenuDemos.svelte';
	import ContextMenuDemos from '#lib/components/ContextMenuDemos.svelte';
	import Copy from '#lib/icons/copy.svelte';
	import Copied from '#lib/icons/copied.svelte';

	let { data }: { data: PageData } = $props();

	let usageCopied = $state(false);
	let usageTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyUsage() {
		try {
			await navigator.clipboard.writeText(data.component.usage);
			usageCopied = true;
			clearTimeout(usageTimer);
			usageTimer = setTimeout(() => (usageCopied = false), 2000);
		} catch {
			// Clipboard unavailable
		}
	}
</script>

<svelte:head>
	<title>{data.component.name} — Fractalsvelte UI</title>
	<meta name="description" content={data.component.description} />
</svelte:head>

<article class="content-section narrow-full gap-2xl box">
	<header class="page-header xleft ta-l box gap-sm mb-lg">
		<div class="breadcrumb mb-bs">
			<a class="breadcrumb-link ta-l" href="/components">Catalogue</a>
			<div class="breadcrumb-spacer">/</div>
			<a class="breadcrumb-link final" href={`/components/${data.categorySlug}`}>{data.component.category}</a>
		</div>
		<h1 class="text-4xl weight-700">{data.component.name}</h1>
		<p class="text-secondary text-lg">{data.component.description}</p>
	</header>

	<!--interactive playground-->
	<section class="box gap-md" aria-labelledby="preview-heading">
		<h2 id="preview-heading" class="text-2xl weight-500">Interactive Playground</h2>
		<ComponentPreview slug={data.component.slug} />
	</section>

	<!---demos for button, slider, dropdown menu, context menu-->
	{#if data.component.slug === 'button'}
		<section class="box gap-lg" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-2xl weight-600">Demos</h2>
			<ButtonDemos />
		</section>
	{:else if data.component.slug === 'slider'}
		<section class="box gap-lg" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-2xl weight-600">Demos</h2>
			<SliderDemos />
		</section>
	{:else if data.component.slug === 'dropdown-menu'}
		<section class="box gap-lg" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-2xl weight-600">Demos</h2>
			<DropdownMenuDemos />
		</section>
	{:else if data.component.slug === 'context-menu'}
		<section class="box gap-lg" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-2xl weight-600">Demos</h2>
			<ContextMenuDemos />
		</section>
	{/if}

	<section class="box gap-sm" aria-labelledby="usage-heading">
		<h2 id="usage-heading" class="text-xl weight-600">Usage</h2>
		<div class="playground-code-block">
			<div class="playground-code-header">
				<span>Svelte</span>
				<button
					type="button"
					class="is-icon"
					class:copied={usageCopied}
					onclick={copyUsage}
					aria-label="Copy usage code"
				>
					{#if usageCopied}
						<Copied />
					{:else}
						<Copy />
					{/if}
				</button>
			</div>
			<div class="playground-code-content">
				{@html data.usageHtml}
			</div>
		</div>
	</section>

	<section class="prose" aria-labelledby="props-heading">
		<h2 id="props-heading">Props</h2>
		<div class="table-wrap">
			<table>
				<colgroup>
					<col style="width: 18%; min-width: 110px;" />
					<col style="width: 42%; min-width: 220px;" />
					<col style="width: 14%; min-width: 90px;" />
					<col style="width: 26%; min-width: 200px;" />
				</colgroup>
				<thead>
					<tr>
						<th scope="col">Prop</th>
						<th scope="col">Type</th>
						<th scope="col">Default</th>
						<th scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
					{#each data.component.props as prop}
						<tr>
							<td class="table-prop">
								<code>{prop.name}</code>
							</td>
							<td class="table-type">
								{#if prop.type.includes(' | ')}
									{#each prop.type.split(' | ') as member, i}
										{#if i > 0}<span class="pipe">|</span>{/if}
										<code>{member}</code>
									{/each}
								{:else}
									<code>{prop.type}</code>
								{/if}
							</td>
							<td class="table-default">
								{#if prop.defaultValue === '—' || !prop.defaultValue}
									<span class="text-muted">—</span>
								{:else if prop.defaultValue === 'required'}
									<span class="table-badge-required">required</span>
								{:else}
									<code>{prop.defaultValue}</code>
								{/if}
							</td>
							<td class="table-desc">{prop.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="card pad-md box gap-xs" aria-labelledby="styling-heading">
		<strong id="styling-heading" class="text-md weight-600">Styling contract</strong>
		<p class="text-muted text-sm">All component styles consume the base theme tokens such as <code>--bg-surface</code>, <code>--border</code>, and <code>--theme-color</code>. Adjust those tokens to theme the whole library without rewriting component rules. Geometry hooks for this component are listed in the <a href="/guides/16-component-contracts">component contracts guide</a>; use a scoped <code>Theme</code> or an instance-level style override when you need a local exception.</p>
	</section>
</article>
