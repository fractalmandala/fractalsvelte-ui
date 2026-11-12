<script lang="ts">
	import CodeBlock from '../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../docs-site/DocPage.svelte';
	import GuideFooter from '../../../docs-site/GuideFooter.svelte';
	import Rich from '../../../docs-site/Rich.svelte';
	import Section from '../../../docs-site/Section.svelte';

	const tree = `src/lib/components/<kit>/<name>/       # <name> is kebab-case
	<Name>.svelte                        # the primary component
	<NamePart>.svelte …                  # optional further parts
	<name>.svelte.ts | <name>.ts         # optional logic / state
	index.ts                             # named exports of every public thing
	doc.ts                               # the documentation manifest
	examples/01-usage.svelte             # ≥ 1, ordered by numeric prefix
	examples/02-….svelte`;

	const docTs = `import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Button',
	summary: 'Triggers an action or navigates, with a spring-loaded press.',
	description: \`One to three paragraphs. A blank line starts a new one.\`,
	features: ['Eleven variants, five sizes, five shapes'],
	accessibility: ['Renders a native <button>, so focus and activation come from the platform.'],
	keyboard: [{ keys: 'Enter / Space', action: 'Activates the button.' }],
	related: ['icon-button']
});`;

	const example = `<!-- @example Usage :: A button with a label and a click handler. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</` + `script>

<Button onclick={() => console.log('deployed')}>Deploy to production</Button>`;

	const commands = `pnpm verify actions/button   # gen + gate + lint + type-check for one component
pnpm verify actions          # the same, for a whole kit
pnpm gate                    # the component ↔ docs contract, whole library
pnpm gate actions --json     # machine-readable diagnostics
pnpm gen                     # custom.css, spring tokens, the barrel, api.json
pnpm lint                    # the fractalstyler closed-world linter
pnpm check                   # everything, whole tree
pnpm dev                     # this site`;

	const rules: [string, string][] = [
		['folder/primary · folder/index · doc/missing', 'The folder has `<Name>.svelte`, `index.ts`, `doc.ts`.'],
		['examples/missing · examples/first · examples/header', 'At least one example, `01` is the minimal usage, each starts with the `@example` header.'],
		['index/export · index/duplicate', '`index.ts` exports the primary component and every part; export names are unique across the library.'],
		['props/missing · props/undocumented', 'Every part declares `interface Props`; every prop has a JSDoc sentence.'],
		['doc/static · doc/name · doc/summary · doc/description · doc/accessibility · doc/parts · doc/keyboard · doc/api', '`doc.ts` is a static literal and nothing in it is empty.'],
		['coverage/prop · coverage/value', 'Every prop, and every value of every string-literal union, appears in an example.'],
		['style/block · style/inline · style/js-write · icons/inline-svg', 'Law 1, statically.'],
		['class/unknown', 'Every class token is in the registry or the extension layer.'],
		['import/forbidden', 'Relative imports inside `src/lib`; examples import what a consumer would.'],
		['layer/budget · kit/unknown', 'Kit fragments stay within 90 lines and belong to a kit in `kits.ts`.']
	];

	const toc = [
		{ id: 'folder', label: 'A component is a folder' },
		{ id: 'manifest', label: 'doc.ts' },
		{ id: 'examples', label: 'Examples' },
		{ id: 'gate', label: 'The gate' },
		{ id: 'commands', label: 'Commands' }
	];
</script>

<DocPage
	title="Contributing"
	eyebrow="Law 2"
	lead="A component and its documentation are one. A component is a folder, its page is generated from that folder, and the gate fails anything left out."
	{toc}
>
	<Section id="folder" title="A component is a folder">
		<CodeBlock code={tree} lang="bash" />
		<p class="text-body text-secondary lh16">
			<Rich text="You never write a route. Install and import lines come from `index.ts`, the examples render live and show their own source, and the API tables are extracted from each part's `interface Props` — its JSDoc is the description, the `$props()` destructuring default (or an `@default` tag) is the default, and `$bindable()` marks two-way props." />
		</p>
	</Section>

	<Section id="manifest" title="doc.ts">
		<p class="text-body text-secondary lh16">
			<Rich text="The manifest is plain data: the gate reads it statically, so it must be a literal — strings, template literals without substitutions, arrays and objects." />
		</p>
		<CodeBlock code={docTs} lang="ts" title="doc.ts" />
	</Section>

	<Section id="examples" title="Examples">
		<p class="text-body text-secondary lh16">
			<Rich text="Each example is a small Svelte file that imports exactly what a consumer would. The first line names it and says what it shows. Across all examples, every prop and every variant must appear — that is how the gate knows nothing is left out." />
		</p>
		<CodeBlock code={example} title="examples/01-usage.svelte" />
	</Section>

	<Section id="gate" title="The gate">
		<div class="scroll-x border radius-bs">
			<table class="data-table">
				<thead><tr><th scope="col">Rules</th><th scope="col">Requires</th></tr></thead>
				<tbody>
					{#each rules as [ids, what] (ids)}
						<tr>
							<td><code class="code-chip wrap-any text-xs">{ids}</code></td>
							<td class="text-sm text-secondary"><Rich text={what} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>

	<Section id="commands" title="Commands">
		<CodeBlock code={commands} lang="bash" />
		<p class="text-body text-secondary lh16">
			<Rich text="Run `pnpm verify <kit>/<name>` before calling a component done. It only reports what is under that folder (and the kit's style fragments), so other work in progress never blocks you." />
		</p>
	</Section>

	{#snippet footer()}<GuideFooter href="/docs/contributing" />{/snippet}
</DocPage>
