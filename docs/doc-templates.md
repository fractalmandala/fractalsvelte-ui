---
title: Documentation templates
description: Running record of the agreed doc templates for lib/styler components.
---

Working in `src/lib/styler` (not `lib/components`). Example component: `src/lib/styler/actions/Button.svelte`.

## Decisions

- No `[data-variant]`, `[data-shape]` etc. Styling is entirely CSS classes, because `data-*` selectors don't translate to gpui and plain classes like `.primary` do.
- The typed API stays. `src/lib/styler/types.ts` defines the props and their value unions. Props go straight into the class list: `class="{variant} {shape} ..."`.

## Template 1: core props rows

For any component that uses any of the `CoreProps` (`variant`, `shape`, `size`, `shadow` in `types.ts`), show one row per prop:

```svelte
<!-- Prop Name -->
<div class="props-row row gap-bs ycenter">
  {#each values of that prop}
    <!-- the component rendered with that value -->
  {/each}
</div>
```

```
  foreground: '#313131',
  class: '#DE2D00',
  identifier: '#414141',
  sign: '#FF4500',
  property: '#787676',
  entity: '#313131',
  jsxliterals: '#FA3701',
  string: '#FA3701',
  keyword: '#FA3701',
  comment: '#6e6d6d',
  caret: '#FF4500',
```

Value sources: `variant` uses `Variants`, `shape` uses `Shapes`, `size` uses `Sizes`, `shadow` uses `Shadows`.

Built as `src/lib/styler/doc/CorePropsRows.svelte`. Usage (home page, `src/routes/+page.svelte`):

```svelte
<CorePropsRows path="actions/Button">Button</CorePropsRows>
```

The template reads the component source (Vite `?raw`) and shows a row for each `CoreProps` entry the source declares as a prop (`variant?:` etc.), so nothing is listed by hand. `base` sets props shared by every instance.

## Direction (from vendor survey, 2026-10-28)

Combine two vendor approaches in `modules/create-docs-svelte/vendor`:

- base-ui-svelte-main: a build-time registry. `apps/docs/scripts/gen-api-registry.ts` uses the TypeScript compiler to read each component's props and writes `registry.ts`. Ours reads `interface Props` in each `.svelte`, records which `CoreProps` it declares, and resolves their values from `styler/types.ts`.
- animations-master: one shared `ComponentDocPage.svelte` template fed per component, plus a script that generates markdown and `llms.txt`. Ours would be fed by the generated registry instead of a hand-written `data.ts`.

## Component registry (decided 2026-10-28)

- Build a components registry: the central source for autodocs, and later one schema shared by all of the user's comp libraries.
- Build it with fractalsvelte-ui (lib/styler) as the base first; other packages are a later extension.
- The registry build lives in `modules/create-docs-svelte` (its extractor and `ComponentDoc` schema). jsrepo (jsrepo.dev) is under consideration for distribution only; it carries no props metadata.

### jsrepo item metadata (checked in jsrepo source, commit 7a0d433, 2026-10-22)

- Items have `meta?: Record<string, string>` (strings only; outputs validate it as such) and `categories?: string[]`.
- File roles: built-in `example`, `doc`, `test`, `file`; custom roles allowed.
- Proposed: per item, a generated `<Comp>.props.json` file (role `doc` or custom `props`) holds structured props; `meta` holds flat facts (`coreProps`, `family`); `categories` for grouping. `jsrepo.config.ts` runs the extractor to generate items and props files; a custom output builds the docs data.

## Plan (agreed 2026-10-28, supersedes the registry/jsrepo direction above, which was over-engineering)

1. List of all components: our own `src/lib/styler/index.ts`, with each component's category.
2. List of props per component.
3. Definition of each prop (the user may write the wording once).
4. (where we are now)
5. Usage examples of each prop: the CorePropsRows template on the home page.
6. One shared doc template (no per-component files) showing all of the above.
7. Dynamic routing for each component.

## Button: steps 1–7 built (2026-10-28)

- **1 + 2** `scripts/component-docs.mjs` (`pnpm docs:components [Name ...]`, no names = all). Reads `src/lib/styler/index.ts` (name, path, `// Section` category) and each component's `interface Props` + `$props()` defaults (ported from create-docs-svelte `extract-props.mjs`), and resolves declared CoreProps to their values from `types.ts`. Writes `src/lib/styler/doc/data/components.json` and `props.json` (keyed by path, e.g. `actions/Button`). Generated, don't hand-edit.
- **3** `src/lib/styler/doc/data/prop-definitions.ts`: one entry per prop name (`text`, `draft`, optional `byComponent` override). Wording is draft; rewrite it and set `draft: false`.
- **5** `src/lib/styler/doc/CorePropsRows.svelte` now reads CoreProps from `props.json` (no `?raw`/regex). Home page unchanged.
- **6** Shared template in `src/routes/components/[slug]/+page.svelte`: category, name, `PropsDocTable`, `CorePropsRows`, all from the generated data. The hand-written `Button.md` was dropped (2026-10-29); mdsvex is still wired in `vite.config.ts` but unused.
- **7** `src/routes/components/[slug]/` → `/components/button` (slug = lowercased name from `components.json`; 404 otherwise).

**Next component:** run `pnpm docs:components Button Badge` (list every documented component, since each run rewrites the json), add any missing prop names to `prop-definitions.ts`. The page appears automatically.

## Component page template (2026-10-29, Amrit; list still being written)

Rendered by the shared `src/routes/components/[slug]/+page.svelte` for every styler component.

0. Component title + description ✅ (name from `components.json`, description from the `<!-- @component -->` comment)
1. Central demo box with a usage code snippet. ✅ `doc/ComponentDemo.svelte` renders `src/lib/demos/<path>.svelte` (one hand-written default-usage file per component, 2026-10-29) in the demo box, with that file's raw source as the snippet; shows "No demo yet" if the file is missing.
2. Installation, as a tabbed view: ✅ `doc/ComponentInstall.svelte` (styler `Tabs` + `CodeBlock`; Manual = full source via `?raw` glob). The `add` CLI doesn't exist yet; the command is a placeholder.
   - **Command**: e.g. `pnpm dlx fractalsvelte-ui@latest add button`, shown as a code snippet.
   - **Manual**: the component's full source as a code snippet.
3. Core props ✅ (`CorePropsRows`)
4. … (to come)
