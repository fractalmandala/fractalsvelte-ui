<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luArrowRight, luBookOpen, luLayers, luPalette, luScale, luSparkles, luZap } from '@fractaldesign/icons/lucide';
	import CodeBlock from '../docs-site/CodeBlock.svelte';
	import InstallTabs from '../docs-site/InstallTabs.svelte';
	import ShowcaseCell from '../docs-site/ShowcaseCell.svelte';
	import { components, kitGroups } from '../docs-site/registry.js';

	const all = components();
	const groups = kitGroups();
	const nonEmptyKits = groups.filter((g) => g.components.length > 0).length;

	// one component per kit first, so the showcase shows range; then fill to six
	const showcase = (() => {
		const withExamples = all.filter((c) => c.examples.length > 0);
		const picked = groups.map((g) => withExamples.find((c) => c.kit === g.kit.id)).filter((c) => c !== undefined);
		for (const c of withExamples) if (picked.length < 6 && !picked.includes(c)) picked.push(c);
		return picked.slice(0, 6);
	})();

	const stats = [
		{ value: all.length, label: 'components' },
		{ value: nonEmptyKits || groups.length, label: nonEmptyKits ? 'kits shipped' : 'kits planned' },
		{ value: 5, label: 'spring presets' },
		{ value: 8, label: 'themes' }
	];

	const pillars = [
		{ icon: luZap, title: 'Real springs', text: 'An analytic spring solver drives presses, drags and layout — interruptible, velocity-preserving, and silent under reduced motion.' },
		{ icon: luLayers, title: 'View transitions', text: 'Typed page transitions on the View Transitions API: fade, slide, scale and a circular reveal from the pointer.' },
		{ icon: luPalette, title: 'Parametric themes', text: 'Every colour derives from three numbers — hue, chroma, tint — so a theme is a dial, not a stylesheet.' },
		{ icon: luScale, title: 'One styling system', text: 'Every pixel is a fractalstyler class. Components match each other because they share one vocabulary.' }
	];

	const importSnippet = `<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</` + `script>

<Button variant="themed">Ship it</Button>`;
</script>

<svelte:head>
	<title>fractalsvelte-ui — the complete component library for SvelteKit</title>
	<meta name="description" content="Component kits, spring physics, view transitions and parametric themes for Svelte 5 and SvelteKit — styled only with fractalstyler." />
</svelte:head>

<main class="main-section box">
	<!-- hero -->
	<section class="hero-wash bb-sub">
		<div class="content-section narrow-wide box xcenter gap-xl pt-3xl pb-3xl">
			<a href="/docs" class="row ycenter gap-sm border radius-full px-md py-xs text-sm text-secondary bg-surface link-parent">
				<span class="dot text-theme"></span>
				<span>Svelte 5 · SvelteKit 3 · runes only</span>
				<Icon icon={luArrowRight} class="text-muted" />
			</a>
			<h1 class="text-5xl weight-600 ls-tight-xl lh11 ink-fade measure-hero">The complete component library for SvelteKit.</h1>
			<p class="text-body-lg text-secondary measure-lead">
				Springs you can feel, view transitions between every page, and themes you turn like a dial — styled only with fractalstyler.
			</p>
			<div class="row xcenter wrap gap-sm">
				<a href="/docs/installation" class="button themed h-xl px-lg mincurved gap-sm weight-500">Get started <Icon icon={luArrowRight} /></a>
				<a href="/components" class="button outline h-xl px-lg mincurved gap-sm weight-500"><Icon icon={luBookOpen} /> Browse components</a>
			</div>
			<dl class="grid-4 gap-lg pt-xl wfull measure-xl">
				{#each stats as s (s.label)}
					<div class="box xcenter gap-xs">
						<dt class="text-sm text-muted">{s.label}</dt>
						<dd class="text-3xl weight-600 tabular-nums ls-tight-lg">{s.value}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</section>

	<!-- showcase -->
	<section class="content-section narrow-wide box gap-xl py-3xl" aria-labelledby="showcase">
		<div class="box gap-sm">
			<p class="text-sm text-theme weight-500">Live</p>
			<h2 id="showcase" class="page-heading-xl ls-tight-lg">Real components, rendered from their own examples.</h2>
			<p class="text-md text-secondary measure-lg">Every preview below is the same file that the docs page shows as source — the demo and the code cannot drift.</p>
		</div>
		{#if showcase.length}
			<div class="card-grid gap-md">
				{#each showcase as entry (entry.href)}
					<ShowcaseCell {entry} />
				{/each}
			</div>
		{:else}
			<div class="stage box xcenter ycenter gap-sm border-dashed radius-bs pad-2xl">
				<Icon icon={luSparkles} class="text-muted" />
				<p class="text-md text-secondary">The first kits are landing. Components appear here the moment their folder passes the gate.</p>
			</div>
		{/if}
	</section>

	<!-- pillars -->
	<section class="bt-sub bb-sub bg-surface">
		<div class="content-section narrow-wide grid-4 gap-xl py-3xl">
			{#each pillars as p (p.title)}
				<div class="box gap-sm">
					<span class="row xcenter ycenter h-xl square radius-sm border bg-panel text-theme"><Icon icon={p.icon} /></span>
					<h3 class="text-md weight-600">{p.title}</h3>
					<p class="text-sm text-secondary lh15">{p.text}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- kits -->
	<section class="content-section narrow-wide box gap-xl py-3xl" aria-labelledby="kits">
		<div class="row xbetween ybot wrap gap-md">
			<div class="box gap-sm">
				<p class="text-sm text-theme weight-500">Kits</p>
				<h2 id="kits" class="page-heading-xl ls-tight-lg">Fourteen kits, one vocabulary.</h2>
			</div>
			<a href="/components" class="link row ycenter gap-xs text-md">All components <Icon icon={luArrowRight} /></a>
		</div>
		<div class="card-grid gap-md">
			{#each groups as g (g.kit.id)}
				<a href="/components#{g.kit.id}" class="link-parent box gap-sm border radius-bs bg-surface pad-bs rim shad-xs lift">
					<span class="row xbetween ycenter">
						<span class="link-title text-md weight-600">{g.kit.title}</span>
						<span class="tag soft text-xs tabular-nums">{g.components.length}</span>
					</span>
					<span class="text-sm text-secondary lh14">{g.kit.description}</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- the two laws -->
	<section class="bt-sub">
		<div class="content-section narrow-wide box gap-xl py-3xl">
			<div class="box gap-sm">
				<p class="text-sm text-theme weight-500">Principles</p>
				<h2 class="page-heading-xl ls-tight-lg">Two laws, enforced by a script.</h2>
			</div>
			<div class="grid-2 gap-md">
				<div class="box gap-sm border radius-bs pad-lg bg-surface">
					<p class="font-mono text-xs text-muted">Law 1</p>
					<h3 class="text-lg weight-600">fractalstyler only.</h3>
					<p class="text-md text-secondary lh15">
						No style blocks, no inline styles, no inline SVG. Every class is in the registry or the small extension layer; JavaScript writes only custom properties.
					</p>
				</div>
				<div class="box gap-sm border radius-bs pad-lg bg-surface">
					<p class="font-mono text-xs text-muted">Law 2</p>
					<h3 class="text-lg weight-600">A component and its docs are one.</h3>
					<p class="text-md text-secondary lh15">
						A component is a folder: source, examples and a manifest. Its page, API tables and coverage are generated — the gate fails anything left out.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- install -->
	<section class="bt-sub hero-wash">
		<div class="content-section narrow-wide grid-2 gap-xl py-3xl">
			<div class="box gap-md">
				<h2 class="page-heading-xl ls-tight-lg">Install in a minute.</h2>
				<p class="text-md text-secondary lh15">Add the library and fractalstyler, import the two stylesheets once, and every component is ready.</p>
				<InstallTabs />
				<a href="/docs/installation" class="link row ycenter gap-xs text-md">Read the installation guide <Icon icon={luArrowRight} /></a>
			</div>
			<CodeBlock code={importSnippet} lang="svelte" title="+layout.svelte" />
		</div>
	</section>

	<footer class="content-section narrow-wide row xbetween ycenter wrap gap-md py-xl bt-sub text-sm text-muted">
		<span>fractalsvelte-ui · MIT</span>
		<span>Styled with fractalstyler</span>
	</footer>
</main>
