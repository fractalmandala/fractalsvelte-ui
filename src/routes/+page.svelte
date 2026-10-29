<script lang="ts">

	import '@fractaldesign/fractalstyler/css'
	import CorePropsRows from '$lib/styler/doc/CorePropsRows.svelte'

</script>

<svelte:head>
	<title>Fractal UI — Massive Svelte 5 Runes Component Library</title>
</svelte:head>


<section class="main-section">
	<section class="content-section narrow-wide">
		<header class="page-header">
			<h1 class="page-title">fractalsvelte ui</h1>
			<p class="page-desc">
				Components library, Sveltekit. Data-slot hooks lend styling and motion layers.
			</p>
		</header>
		<article class="compdocs">
			<div class="props-section">
				<h2>Button</h2>
				<CorePropsRows path="actions/Button">
					Button
				</CorePropsRows>
			</div>
		</article>
	</section>
</section>
