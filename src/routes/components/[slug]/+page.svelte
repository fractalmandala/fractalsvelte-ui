<script lang="ts">
	// The shared doc template: the same page for every component in components.json.
	import PropsDocTable from '$lib/styler/doc/PropsDocTable.svelte';
	import CorePropsRows from '$lib/styler/doc/CorePropsRows.svelte';
	import ComponentDemo from '$lib/styler/doc/ComponentDemo.svelte';
	import ComponentInstall from '$lib/styler/doc/ComponentInstall.svelte';
	import propsJson from '$lib/styler/doc/data/props.json';

	let { data } = $props();
	const extendsList = $derived(
		(propsJson.props as Record<string, { extends: string[] }>)[data.entry.path]?.extends ?? []
	);
</script>

<svelte:head>
	<title>{data.entry.title} — fractalsvelte ui</title>
</svelte:head>

<header class="page-header">
	<h1 class="page-title">{data.entry.title}</h1>
	{#if data.entry.description || extendsList.length}
		<p class="page-desc text-secondary">
			{data.entry.description ?? ''}{#if extendsList.length}{' '}Also accepts <em>{extendsList.join(', ')}</em>.{/if}
		</p>
	{/if}
</header>
<article class="compdocs">
	<section class="page-section">
		<ComponentDemo path={data.entry.path} />
	</section>
	<section class="page-section">
		<h2>Installation</h2>
		<ComponentInstall name={data.entry.name} path={data.entry.path} />
	</section>
	<section class="page-section">
				<h2>Core props</h2>
	<CorePropsRows path={data.entry.path}>{data.entry.name}</CorePropsRows>
	</section>
	<section class="page-section">
			<h2>Props</h2>
	<PropsDocTable path={data.entry.path} />
	</section>
</article>
