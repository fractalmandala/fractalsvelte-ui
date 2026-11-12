<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luArrowRight } from '@fractaldesign/icons/lucide';
	import DocPage from '../../docs-site/DocPage.svelte';
	import GuideFooter from '../../docs-site/GuideFooter.svelte';
	import Rich from '../../docs-site/Rich.svelte';
	import Section from '../../docs-site/Section.svelte';
	import { guides } from '../../docs-site/nav.js';
	import { components, kitGroups } from '../../docs-site/registry.js';

	const count = components().length;
	const kitCount = kitGroups().length;

	const toc = [
		{ id: 'what', label: 'What fractalsvelte-ui is' },
		{ id: 'law-1', label: 'Law 1 — fractalstyler only' },
		{ id: 'law-2', label: 'Law 2 — one folder' },
		{ id: 'guides', label: 'Guides' }
	];
</script>

<DocPage
	title="Introduction"
	eyebrow="Docs"
	lead="fractalsvelte-ui is a complete component library for Svelte 5 and SvelteKit: component kits, a real spring engine, view transitions and parametric themes — styled only with fractalstyler."
	{toc}
>
	<Section id="what" title="What fractalsvelte-ui is">
		<p class="text-body text-secondary lh16">
			<Rich text={`${count} components across ${kitCount} kits, written with runes only: \`$props\`, \`$state\`, snippets and attachments. Every component renders the platform's own element — a native \`<button>\`, \`<dialog>\`, the Popover API, CSS anchor positioning — and adds JavaScript only where the platform stops.`} />
		</p>
		<p class="text-body text-secondary lh16">
			<Rich text="Motion is physical. Anything a person presses, drags or opens moves on a spring that keeps its velocity when interrupted, and stands still when the operating system asks for reduced motion. Colour is parametric: a theme is three numbers, so you can turn it like a dial." />
		</p>
	</Section>

	<Section id="law-1" title="Law 1 — fractalstyler only">
		<p class="text-body text-secondary lh16">
			<Rich text="Styling is composition of registered classes in markup. There are no style blocks, no inline styles, no style directives and no inline SVG anywhere in the library. Every class comes from fractalstyler's registry or from fractalsvelte-ui's small extension layer, and dynamic values travel through custom properties: JavaScript writes `--value`, a class owns the real property." />
		</p>
		<a href="/docs/styling" class="link row ycenter gap-xs text-md">How styling works <Icon icon={luArrowRight} /></a>
	</Section>

	<Section id="law-2" title="Law 2 — a component and its docs are one">
		<p class="text-body text-secondary lh16">
			<Rich text="A component is a folder: the component, its parts, an `index.ts`, a `doc.ts` manifest and numbered examples. The page you read is generated from that folder — the examples render live and show their own source, the API tables are extracted from `interface Props` and its JSDoc. The gate fails a folder that leaves anything out: an undocumented prop, a variant no example shows, an unknown class." />
		</p>
		<a href="/docs/contributing" class="link row ycenter gap-xs text-md">The contract and the commands <Icon icon={luArrowRight} /></a>
	</Section>

	<Section id="guides" title="Guides">
		<div class="card-grid gap-sm">
			{#each guides.slice(1) as g (g.href)}
				<a href={g.href} class="link-parent box gap-xs border radius-bs bg-surface pad-bs lift">
					<span class="link-title text-md weight-600">{g.title}</span>
					<span class="text-sm text-secondary">{g.summary}</span>
				</a>
			{/each}
		</div>
	</Section>

	{#snippet footer()}<GuideFooter href="/docs" />{/snippet}
</DocPage>
