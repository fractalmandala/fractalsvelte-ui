<script lang="ts">
	import { components, categories } from '#lib/docs/catalogue.ts';
	import Badge from '#lib/components/Badge.svelte';
</script>

<svelte:head>
	<title>Components — Fractalsvelte UI</title>
	<meta name="description" content="Explore the full component library: accessible UI primitives and high-value motion components." />
</svelte:head>

<article class="content-section narrow-full box gap-lg">
	<header class="box gap-2xs pad-bottom-xs border-bottom">
		<span class="eyebrow">Catalogue</span>
		<h1 class="text-4xl weight-600">Components</h1>
		<p class="text-muted">Explore {components.length} accessible UI primitives, motion surfaces, and layout components with real-time interactive playgrounds.</p>
	</header>

	{#each categories as category}
		{@const categoryComponents = components.filter((c) => c.category === category)}
		{#if categoryComponents.length > 0}
			<section class="box gap-sm">
				<h2 class="text-xl weight-600">{category}</h2>
				<div class="card-grid gap-sm">
					{#each categoryComponents as component}
						<a class="card pad-md box gap-2xs hover-card" href={`/components/${component.slug}`}>
							<div class="row ycenter xbetween">
								<strong class="text-md weight-600">{component.name}</strong>
								<Badge variant="accent">{component.slug}</Badge>
							</div>
							<p class="text-muted text-sm">{component.description}</p>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</article>
