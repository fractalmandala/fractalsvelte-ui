<script lang="ts">
	import type { PageData } from './$types';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import ButtonDemos from '#lib/components/ButtonDemos.svelte';
	import SliderDemos from '#lib/components/SliderDemos.svelte';
	import DropdownMenuDemos from '#lib/components/DropdownMenuDemos.svelte';
	import ContextMenuDemos from '#lib/components/ContextMenuDemos.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.component.name} — Fractalsvelte UI</title>
	<meta name="description" content={data.component.description} />
</svelte:head>

<article class="content-section narrow-full box gap-lg">
	<header class="box gap-2xs mb-lg">
		<h1 class="text-4xl weight-600">{data.component.name}</h1>
		<p class="text-muted">{data.component.description}</p>
	</header>

	<section class="box gap-md" aria-labelledby="preview-heading">
		<h2 id="preview-heading" class="text-xl weight-500">Interactive Playground</h2>
		<ComponentPreview slug={data.component.slug} />
	</section>

	{#if data.component.slug === 'button'}
		<section class="box gap-sm" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-xl weight-600">Demos</h2>
			<p class="text-muted">Nine focused recipes covering the Button's full surface. Copy any card's code as a starting point.</p>
			<ButtonDemos />
		</section>
	{:else if data.component.slug === 'slider'}
		<section class="box gap-sm" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-xl weight-600">Demos</h2>
			<SliderDemos />
		</section>
	{:else if data.component.slug === 'dropdown-menu'}
		<section class="box gap-sm" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-xl weight-600">Demos</h2>
			<DropdownMenuDemos />
		</section>
	{:else if data.component.slug === 'context-menu'}
		<section class="box gap-sm" aria-labelledby="demos-heading">
			<h2 id="demos-heading" class="text-xl weight-600">Demos</h2>
			<ContextMenuDemos />
		</section>
	{/if}

	<section class="prose" aria-labelledby="usage-heading">
		<h2 id="usage-heading">Usage</h2>
		{@html data.usageHtml}
	</section>

	<section class="prose" aria-labelledby="props-heading">
		<h2 id="props-heading">Props</h2>
		<div class="table-wrap">
			<table>
				<thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
				<tbody>
					{#each data.component.props as prop}
						<tr><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td><code>{prop.defaultValue}</code></td><td>{prop.description}</td></tr>
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
