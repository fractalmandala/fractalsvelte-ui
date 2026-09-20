<script lang="ts">
	import type { PageData } from './$types';
	import Badge from '#lib/components/Badge.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.category} Components — Fractalsvelte UI</title>
	<meta name="description" content={`Explore ${data.components.length} ${data.category} components in Fractalsvelte UI.`} />
</svelte:head>

<article class="content-section narrow-full">
	<header class="page-header box gap-sm mb-2xl">
		<h1 class="text-4xl weight-700">{data.category}</h1>
		<p class="text-secondary text-lg">Explore {data.components.length} {data.category.toLowerCase()} components with real-time interactive playgrounds and copy-ready code recipes.</p>
	</header>

	<div class="grid-3 stay2 gap-md">
		{#each data.components as component}
			<a class="box gap-xs card sunken border-subtle radius-sm pad-bs xleft" href={`/components/${data.categorySlug}/${component.slug}`}>
				<header class="box gap-sm">
				<p class="text-lg weight-600 lh12">{component.name}</p>
				<span class="text-muted text-md">{component.description}</span>
				</header>
				<footer class="mt-sm">
					<div aria-hidden="true" class="text-theme text-xl">→</div>
				</footer>
			</a>
		{/each}
	</div>
</article>
