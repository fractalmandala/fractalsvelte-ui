<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luSearch } from '@fractaldesign/icons/lucide';
	import { SpringValue, vars } from '@fractaldesign/fractalsvelte-ui/motion';
	import CodeBlock from '../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../docs-site/DocPage.svelte';
	import GuideFooter from '../../../docs-site/GuideFooter.svelte';
	import Rich from '../../../docs-site/Rich.svelte';
	import Section from '../../../docs-site/Section.svelte';
	import { layerClasses } from '../../../docs-site/registry.js';

	const classes = layerClasses().filter((c) => !c.file.startsWith('90-docs') && !c.class.startsWith('tok-'));
	let query = $state('');
	const q = $derived(query.trim().toLowerCase());
	const shown = $derived(classes.filter((c) => !q || `${c.class} ${c.file} ${c.declarations}`.toLowerCase().includes(q)));
	const LIMIT = 80;

	const level = new SpringValue(0.35, 'bouncy');

	const toc = [
		{ id: 'composition', label: 'Composition' },
		{ id: 'registry', label: 'The registry' },
		{ id: 'extension', label: 'The extension layer' },
		{ id: 'channel', label: 'The custom-property channel' },
		{ id: 'forbidden', label: 'What the gate rejects' }
	];

	const compose = `<div class="box gap-sm border radius-bs bg-surface pad-bs rim shad-sm">
	<p class="card-title">Usage this month</p>
	<p class="text-sm text-secondary tabular-nums">18,204 requests · 92% cached</p>
</div>`;

	const channel = `<script lang="ts">
	import { SpringValue, vars } from '@fractaldesign/fractalsvelte-ui/motion';
	const level = new SpringValue(0.35, 'bouncy');
</` + `script>

<div class="track h-xs wfull">
	<div class="fill" {@attach vars({ value: level.current })}></div>
</div>
<button onclick={() => (level.target = Math.random())}>Spring it</button>`;

	const layerCss = `/* src/lib/styles/layers/40-controls.css */
.fill {
	position: absolute;
	inset-block: 0;
	left: calc(var(--from, 0) * 100%);
	width: calc((var(--value, 0) - var(--from, 0)) * 100%);
	border-radius: inherit;
	background-color: var(--theme-color);
}`;
</script>

<DocPage
	title="Styling"
	eyebrow="Law 1"
	lead="Styling is composition of registered classes in markup — nothing else. Dynamic values travel through custom properties, and a class owns the real property."
	{toc}
>
	<Section id="composition" title="Composition">
		<p class="text-body text-secondary lh16">
			<Rich text="fractalstyler is a closed vocabulary: a space ladder (`gap-*`, `pad-*`, `px-*` … over `xs sm md bs lg xl 2xl 3xl`), containers (`box`, `row`, `grid-*`), surfaces, ink, borders and the elevation ladder. A component is that vocabulary arranged — which is why a fractalsvelte-ui card, input and tag always agree." />
		</p>
		<CodeBlock code={compose} />
		<p class="text-body text-secondary lh16">
			<Rich text={"Modifiers ride their base: `row ycenter`, never a bare `ycenter`. Variants, sizes and shapes are classes of the same name, so `variant=\"soft\"` on any component means the same thing."} />
		</p>
	</Section>

	<Section id="registry" title="The registry">
		<p class="text-body text-secondary lh16">
			<Rich text="Every fractalstyler class is listed in `node_modules/@fractaldesign/fractalstyler/registry.md` with the property it sets. The linter (`pnpm lint`) and the gate (`pnpm gate`) reject any class that is in neither the registry nor fractalsvelte-ui's extension layer, and suggest the closest real ones." />
		</p>
	</Section>

	<Section id="extension" title="The extension layer">
		<p class="text-body text-secondary lh16">
			<Rich text={`Where the system genuinely cannot express something, fractalsvelte-ui adds the smallest general primitive: plain CSS, tokens only, named in the system's voice. The layers live in \`src/lib/styles/layers\` and are concatenated into \`custom.css\` by \`pnpm gen\`. These are its ${classes.length} classes:`} />
		</p>
		<label class="field row ycenter gap-sm border radius-md bg-input px-md h-xl measure-md">
			<Icon icon={luSearch} class="text-muted shrink-0" />
			<span class="sr-only">Filter classes</span>
			<input class="bare grow text-md" type="search" placeholder="Filter classes, files or properties…" bind:value={query} />
		</label>
		<div class="scroll-x border radius-bs">
			<table class="data-table">
				<thead>
					<tr><th scope="col">Class</th><th scope="col">Layer</th><th scope="col">Declarations</th></tr>
				</thead>
				<tbody>
					{#each shown.slice(0, LIMIT) as c (c.class)}
						<tr>
							<td><code class="font-mono text-sm weight-500">.{c.class}</code></td>
							<td class="text-xs text-muted font-mono">{c.file}</td>
							<td><code class="code-chip wrap-any text-xs">{c.declarations || c.selector}</code></td>
						</tr>
					{:else}
						<tr><td colspan="3" class="data-table-empty text-muted">No class matches.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if shown.length > LIMIT}<p class="text-sm text-muted tabular-nums">Showing {LIMIT} of {shown.length} — filter to narrow.</p>{/if}
	</Section>

	<Section id="channel" title="The custom-property channel">
		<p class="text-body text-secondary lh16">
			<Rich text="JavaScript never writes a real property. It writes custom properties — through the `vars()` attachment or `node.style.setProperty('--x', …)` — and a class turns them into layout. Here a spring drives `--value`; `.fill` owns the width." />
		</p>
		<div class="stage box gap-md border radius-bs pad-xl">
			<div class="track h-xs wfull">
				<div class="fill" {@attach vars({ value: level.current })}></div>
			</div>
			<div class="row xbetween ycenter">
				<span class="text-sm text-muted tabular-nums font-mono">--value: {level.current.toFixed(3)}</span>
				<button type="button" class="button secondary h-bs px-md mincurved text-sm" onclick={() => (level.target = Math.round(Math.random() * 100) / 100)}>Spring it</button>
			</div>
		</div>
		<div class="grid-2 gap-md">
			<CodeBlock code={channel} title="Markup" />
			<CodeBlock code={layerCss} lang="css" title="The class" />
		</div>
	</Section>

	<Section id="forbidden" title="What the gate rejects">
		<ul class="box gap-sm text-md text-secondary">
			<li><Rich text="Style blocks, inline `style` attributes and `style:` directives — in components, examples and this site." /></li>
			<li><Rich text="Inline SVG and unicode glyph icons — icons come from `@fractaldesign/icons`." /></li>
			<li><Rich text="Assignments to `element.style.*`, `cssText`, and `setProperty` of anything but a `--custom` property." /></li>
			<li><Rich text="Raw hex colours, pixel values above 2px and literal radii in a layer — tokens only." /></li>
			<li><Rich text="A kit fragment over its 90-line budget." /></li>
		</ul>
	</Section>

	{#snippet footer()}<GuideFooter href="/docs/styling" />{/snippet}
</DocPage>
