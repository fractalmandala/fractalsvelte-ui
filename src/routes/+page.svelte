<script lang="ts">
	import { components, categories } from '#lib/docs/catalogue.js';
</script>

<svelte:head><title>Fractalsvelte UI — Svelte components</title></svelte:head>

<section class="content-section narrow-full">
<section class="hero mb-xl">
	<div class="box gap-sm">
		<h1 class="text-4xl weight-500">Small components.<br>One deliberate visual language.</h1>
		<p class="text-bs text-secondary">Fractalsvelte UI is a complete starter component library for SvelteKit. It pairs accessible primitives with a two-layer Sass token system, then documents every public component in the same app.</p>
	</div>
</section>
	<div class="grid-3 stay2 gap-md">
		{#each categories as category}
			<a class="box card pad-bs xleft" href={`/components/${components.find((component) => component.category === category)?.slug}`}>
				<p class="text-bs weight-600">{category}</p>
				<span class="text-muted text-sm">{components.filter((component) => component.category === category).length} components</span>
				<footer>
					<div aria-hidden="true" class="text-theme">→</div>
				</footer>
			</a>
		{/each}
	</div>
</section>
