<script lang="ts">
	// Component documentation page following the structure in AGENTS.md:
	// 1. Component Name, Component Description, Component Group
	// 2. Component Hero Demo (site/demos/<group>/<name>.svelte)
	// 3. Installation and Usage
	// 4. Component Prop Previews (site/data/component-previews.ts + site/data/prop-definitions.ts)
	// 5. Props Table
	import PropsDocTable from '$site/doc/PropsDocTable.svelte';
	import CorePropsRows from '$site/doc/CorePropsRows.svelte';
	import ComponentDemo from '$site/doc/ComponentDemo.svelte';
	import ComponentInstall from '$site/doc/ComponentInstall.svelte';

	let { data } = $props();
	const extendsList = $derived(data.entry.extendsList ?? []);
</script>

<svelte:head>
	<title>{data.entry.title} — fractalsvelte ui</title>
</svelte:head>

<header class="page-header gap-bs">
	{#if data.entry.category}
		<p class="text-sm text-muted tt-u">{data.entry.category}</p>
	{/if}
	<h1 class="page-title">{data.entry.title}</h1>
	{#if data.entry.description || extendsList.length}
		<p class="page-desc text-secondary lh16">
			{data.entry.description ?? ''}{#if extendsList.length}{' '}Also accepts <em>{extendsList.join(', ')}</em>.{/if}
		</p>
	{/if}
</header>
<article class="compdocs">
	<section class="page-section">
		<ComponentDemo path={data.entry.path} />
	</section>
	<section class="page-section">
		<h2 class="page-heading-xl">Installation and Usage</h2>
		<ComponentInstall name={data.entry.name} path={data.entry.path} />
	</section>
	<section class="page-section">
		<CorePropsRows path={data.entry.path}>{data.entry.name}</CorePropsRows>
	</section>
	<section class="page-section">
		<h2 class="page-heading-xl">Props Table</h2>
		<PropsDocTable path={data.entry.path} />
	</section>
</article>
