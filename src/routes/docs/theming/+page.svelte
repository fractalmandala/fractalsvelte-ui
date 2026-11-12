<script lang="ts">
	import { theme, themes, type ThemeDensity, type ThemeMode, type ThemeMotion, type ThemeRadius } from '@fractaldesign/fractalsvelte-ui/theme';
	import CodeBlock from '../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../docs-site/DocPage.svelte';
	import GuideFooter from '../../../docs-site/GuideFooter.svelte';
	import Rich from '../../../docs-site/Rich.svelte';
	import Section from '../../../docs-site/Section.svelte';

	const modes: ThemeMode[] = ['light', 'dark', 'system'];
	const radii: ThemeRadius[] = ['sharp', 'soft', 'round'];
	const densities: ThemeDensity[] = ['compact', 'cozy', 'comfortable'];
	const motions: ThemeMotion[] = ['off', 'calm', 'snappy', 'playful'];

	const hue = $derived(theme.hue ?? theme.preset.hue);
	const chroma = $derived(theme.chroma ?? theme.preset.chroma);
	const tint = $derived(theme.tint ?? theme.preset.tint);

	const tokens = [
		['--bg', 'The page'],
		['--bg-surface', 'Cards, panels, inputs'],
		['--bg-panel', 'One step below the surface'],
		['--bg-overlay', 'Menus, popovers, dialogs'],
		['--bg-input', 'Text fields'],
		['--bg-button', 'The primary fill'],
		['--bg-button-secondary', 'The secondary fill'],
		['--state-hover', 'Hover wash'],
		['--state-selected', 'Selected wash'],
		['--border', 'Hairlines'],
		['--border-strong', 'Emphasised hairlines'],
		['--border-subtle', 'Quiet dividers'],
		['--text-primary', 'Body ink'],
		['--text-secondary', 'Supporting ink'],
		['--text-muted', 'Captions, placeholders'],
		['--text-inverse', 'Ink on a filled surface'],
		['--theme-color', 'The accent'],
		['--theme-color-up', 'Accent, one step lighter'],
		['--theme-color-down', 'Accent, one step darker'],
		['--ring', 'Focus ring'],
		['--scrim', 'Behind modals']
	];

	const html = `<html data-mode="dark" data-theme="ember" data-radius="soft" data-density="cozy" data-motion="snappy">`;
	const runtime = `<script lang="ts">
	import { theme } from '@fractaldesign/fractalsvelte-ui/theme';
</` + `script>

<button onclick={(e) => theme.toggleMode(e)}>Toggle mode</button>
<button onclick={() => theme.setTheme('aurora')}>Aurora</button>
<button onclick={() => theme.set({ hue: 300, chroma: 0.18 })}>Custom</button>`;
	const subtree = `<!-- re-theme one region: the numbers are inheriting custom properties -->
<section data-theme="rose" data-mode="light" class="pad-lg radius-bs">…</section>`;

	const toc = [
		{ id: 'recipe', label: 'One recipe, three numbers' },
		{ id: 'playground', label: 'Playground' },
		{ id: 'attributes', label: 'Attributes' },
		{ id: 'runtime', label: 'The runtime' },
		{ id: 'tokens', label: 'Colour roles' }
	];
</script>

{#snippet segmented(label: string, options: string[], current: string, pick: (v: string) => void)}
	<div class="box gap-xs">
		<span class="text-xs text-muted tt-u ls-wide-lg">{label}</span>
		<div class="row wrap gap-xs" role="radiogroup" aria-label={label}>
			{#each options as o (o)}
				<button type="button" role="radio" aria-checked={current === o} class={['ghost h-bs px-md mincurved text-sm', current === o ? 'selected text-primary' : 'text-secondary']} onclick={() => pick(o)}>{o}</button>
			{/each}
		</div>
	</div>
{/snippet}

<DocPage
	title="Theming"
	eyebrow="Themes"
	lead="Every colour in fractalsvelte-ui derives from three numbers — `--hue`, `--chroma` and `--tint` — in the OKLCH space. A theme is a dial, not a stylesheet."
	{toc}
>
	<Section id="recipe" title="One recipe, three numbers">
		<p class="text-body text-secondary lh16">
			<Rich text="`--hue` picks the accent (and faintly tints the neutrals), `--chroma` sets how vivid the accent is, and `--tint` how much of the hue the greys carry. Light and dark are the same recipe at different lightness. Named themes are just presets of the three numbers." />
		</p>
		<div class="card-grid gap-sm">
			{#each themes as t (t.id)}
				<button type="button" class={['link-parent box gap-sm border radius-bs bg-surface pad-bs ta-l lift', theme.theme === t.id && !theme.customised && 'glow']} onclick={() => theme.setTheme(t.id)}>
					<span class="row ycenter gap-sm"><span class="swatch" data-theme={t.id}></span><span class="link-title text-md weight-600">{t.label}</span></span>
					<span class="text-xs text-muted font-mono tabular-nums">{t.hue}° · {t.chroma} · {t.tint}</span>
				</button>
			{/each}
		</div>
	</Section>

	<Section id="playground" title="Playground">
		<p class="text-body text-secondary lh16">These controls drive the live theme runtime — the whole site follows.</p>
		<div class="box gap-lg border radius-bs bg-surface pad-lg rim shad-sm">
			<div class="grid-3 gap-lg">
				<label class="box gap-xs text-xs text-muted">
					<span class="row xbetween"><span class="tt-u ls-wide-lg">Hue</span><span class="tabular-nums">{Math.round(hue)}°</span></span>
					<input type="range" min="0" max="360" step="1" value={hue} class="wfull" oninput={(e) => theme.set({ hue: Number(e.currentTarget.value) })} />
				</label>
				<label class="box gap-xs text-xs text-muted">
					<span class="row xbetween"><span class="tt-u ls-wide-lg">Chroma</span><span class="tabular-nums">{chroma.toFixed(2)}</span></span>
					<input type="range" min="0" max="0.32" step="0.01" value={chroma} class="wfull" oninput={(e) => theme.set({ chroma: Number(e.currentTarget.value) })} />
				</label>
				<label class="box gap-xs text-xs text-muted">
					<span class="row xbetween"><span class="tt-u ls-wide-lg">Tint</span><span class="tabular-nums">{tint.toFixed(3)}</span></span>
					<input type="range" min="0" max="0.04" step="0.001" value={tint} class="wfull" oninput={(e) => theme.set({ tint: Number(e.currentTarget.value) })} />
				</label>
			</div>
			<div class="grid-2 gap-lg">
				{@render segmented('Mode', modes, theme.mode, (v) => theme.setMode(v as ThemeMode))}
				{@render segmented('Radius', radii, theme.radius, (v) => theme.set({ radius: v as ThemeRadius }))}
				{@render segmented('Density', densities, theme.density, (v) => theme.set({ density: v as ThemeDensity }))}
				{@render segmented('Motion', motions, theme.motion, (v) => theme.set({ motion: v as ThemeMotion }))}
			</div>
			<div class="row xbetween ycenter wrap gap-md pt-md bt-sub">
				<div class="row wrap gap-sm">
					<span class="button primary h-bs px-md mincurved text-sm">Primary</span>
					<span class="button themed h-bs px-md mincurved text-sm">Themed</span>
					<span class="button soft h-bs px-md mincurved text-sm">Soft</span>
					<span class="button outline h-bs px-md mincurved text-sm">Outline</span>
				</div>
				<button type="button" class="button ghost h-bs px-md mincurved text-sm text-secondary" onclick={() => theme.reset()}>Reset</button>
			</div>
		</div>
	</Section>

	<Section id="attributes" title="Attributes">
		<p class="text-body text-secondary lh16">
			<Rich text="Five attributes on `<html>` (or any subtree) configure everything: `data-mode`, `data-theme`, `data-radius` (`sharp` `soft` `round` — rewrites the radius ladder), `data-density` (`compact` `cozy` `comfortable` — rewrites the space and height ladders) and `data-motion` (`off` `calm` `snappy` `playful` — re-points the default spring)." />
		</p>
		<CodeBlock code={html} lang="html" />
		<CodeBlock code={subtree} lang="html" />
	</Section>

	<Section id="runtime" title="The runtime">
		<p class="text-body text-secondary lh16">
			<Rich text="`theme` is a reactive singleton (`mode`, `theme`, `hue`, `chroma`, `tint`, `radius`, `density`, `motion`, `resolvedMode`). Call `initTheme()` once in the root layout; `themeInitScript()` returns a tiny blocking script that applies the stored theme before first paint. `toggleMode(event)` animates the switch from the pointer with a view-transition reveal." />
		</p>
		<CodeBlock code={runtime} />
	</Section>

	<Section id="tokens" title="Colour roles">
		<div class="scroll-x border radius-bs">
			<table class="data-table">
				<thead><tr><th scope="col">Token</th><th scope="col">Role</th></tr></thead>
				<tbody>
					{#each tokens as [name, role] (name)}
						<tr><td><code class="font-mono text-sm">{name}</code></td><td class="text-sm text-secondary">{role}</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>

	{#snippet footer()}<GuideFooter href="/docs/theming" />{/snippet}
</DocPage>
