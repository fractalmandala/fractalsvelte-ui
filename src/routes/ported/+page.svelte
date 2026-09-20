<svelte:head>
	<title>Ported components — Fractalsvelte UI</title>
	<meta
		name="description"
		content="shadcn-svelte components re-implemented on fractal tokens. Same APIs, zero tailwind."
	/>
</svelte:head>

<article class="content-section narrow-full box gap-lg">
	<header class="box gap-2xs pad-bottom-xs border-bottom">
		<span class="eyebrow">Ported</span>
		<h1 class="text-4xl weight-600">Ported components</h1>
		<p class="text-muted">
			shadcn-svelte behaviour, fractal styling. Each port keeps the original prop API and
			<code>data-slot</code> hooks, but renders with token-driven classes — no tailwind, no
			<code>&lt;style&gt;</code> blocks.
		</p>
	</header>

	<section class="box gap-sm" aria-labelledby="ported-list-heading">
		<h2 id="ported-list-heading" class="text-xl weight-600">Available ports</h2>
		<div class="card-grid gap-sm">
			<a class="card pad-md box gap-2xs hover-card" href="/ported/button">
				<div class="row ycenter xbetween">
					<strong class="text-md weight-600">Button</strong>
					<span class="badge">ported/button</span>
				</div>
				<p class="text-muted text-sm">
					Six variants and eight sizes from shadcn-svelte, mapped onto the fractal button
					geometry.
				</p>
			</a>
		</div>
	</section>

	<section class="card pad-md box gap-xs" aria-labelledby="ported-method-heading">
		<strong id="ported-method-heading" class="text-md weight-600">Porting method</strong>
		<p class="text-muted text-sm">
			For every shadcn component we resolve each tailwind class to its real CSS definition,
			snap values to the nearest fractal token, then compose registry classes to the same
			effect. Anything with no fractal equivalent is raised as a fractalstyler2 feature
			request — never patched with ad-hoc CSS.
		</p>
	</section>
</article>
