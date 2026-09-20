---
title: Refactor Demos and Universal Shiki Highlighting
description: Refactored component demos to standalone recipe components with ?raw imports and added Shiki code highlighting.
created: 2026-09-20
updated: 2026-09-20
type: worklog
status: open
---

## Instruction
Refactor demo components (`ButtonDemos`, `SliderDemos`, `DropdownMenuDemos`, `ContextMenuDemos`, and `PortedButtonDemos`) from hardcoded string templates with escaped `<\/script>` tags to standalone `.svelte` recipe components loaded via Vite `?raw` imports, and implement universal Shiki syntax highlighting for all code snippets across the application.

## Log
- Created `src/lib/docs/highlight.ts` using `createHighlighterCore` and `createJavaScriptRegexEngine` from `shiki` with `svelte`, `typescript`, `javascript`, `html`, `css`, `bash` languages and dual `github-light` / `github-dark` themes.
- Configured ambient module declarations in `src/ambient.d.ts` and `src/app.d.ts` for `*?raw` and `fractalsvelte/*` module imports.
- Updated `DemoCard.svelte` to highlight code via `highlight()` from `#lib/docs/highlight.ts`, replacing raw string output with styled Shiki blocks and updating typography classes.
- Created 9 standalone recipe components under `src/lib/components/demos/button/` (`ButtonIntents`, `ButtonStates`, `ButtonSizes`, `ButtonPill`, `ButtonIcons`, `ButtonIconOnly`, `ButtonLoading`, `ButtonFullWidth`, `ButtonAnchor`), refactored `ButtonDemos.svelte` to import them with `?raw` and eliminated all escaped `<\/script>` string hacks.
- Created 3 standalone recipe components under `src/lib/components/demos/slider/` (`SliderBasic`, `SliderLiveValue`, `SliderRange`), refactored `SliderDemos.svelte` with `?raw` imports.
- Created 3 standalone recipe components under `src/lib/components/demos/dropdown-menu/` (`DropdownMenuBasic`, `DropdownMenuState`, `DropdownMenuTrigger`), refactored `DropdownMenuDemos.svelte` with `?raw` imports.
- Created 3 standalone recipe components under `src/lib/components/demos/context-menu/` (`ContextMenuBasic`, `ContextMenuChoices`, `ContextMenuTriggerSurface`), refactored `ContextMenuDemos.svelte` with `?raw` imports.
- Created 6 standalone recipe components under `src/lib/ported/demos/` (`PortedButtonVariants`, `PortedButtonSizes`, `PortedButtonIconSizes`, `PortedButtonWithIcons`, `PortedButtonStates`, `PortedButtonAnchor`), refactored `PortedButtonDemos.svelte` with `?raw` imports and Shiki-highlighted interactive playground.
- Integrated Shiki syntax highlighting into `ComponentPreview.svelte` for the interactive playground code block.
- Styled code blocks in `src/lib/styles/_10_component_library.sass` for seamless integration with `var(--bg-terminal)` and monospace styling.
- Verified with `pnpm check`, `pnpm verify:style`, `pnpm a11y:check`, `node scripts/check-shiki-contract.mjs`, `pnpm build`, and CDP headless browser visual screenshots.

## Files
- [`src/lib/docs/highlight.ts`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/docs/highlight.ts)
- [`src/ambient.d.ts`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/ambient.d.ts)
- [`src/app.d.ts`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/app.d.ts)
- [`src/lib/components/DemoCard.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/DemoCard.svelte)
- [`src/lib/components/ComponentPreview.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/ComponentPreview.svelte)
- [`src/lib/components/ButtonDemos.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/ButtonDemos.svelte)
- [`src/lib/components/demos/button/ButtonIntents.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonIntents.svelte)
- [`src/lib/components/demos/button/ButtonStates.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonStates.svelte)
- [`src/lib/components/demos/button/ButtonSizes.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonSizes.svelte)
- [`src/lib/components/demos/button/ButtonPill.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonPill.svelte)
- [`src/lib/components/demos/button/ButtonIcons.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonIcons.svelte)
- [`src/lib/components/demos/button/ButtonIconOnly.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonIconOnly.svelte)
- [`src/lib/components/demos/button/ButtonLoading.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonLoading.svelte)
- [`src/lib/components/demos/button/ButtonFullWidth.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonFullWidth.svelte)
- [`src/lib/components/demos/button/ButtonAnchor.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/button/ButtonAnchor.svelte)
- [`src/lib/components/SliderDemos.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/SliderDemos.svelte)
- [`src/lib/components/demos/slider/SliderBasic.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/slider/SliderBasic.svelte)
- [`src/lib/components/demos/slider/SliderLiveValue.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/slider/SliderLiveValue.svelte)
- [`src/lib/components/demos/slider/SliderRange.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/slider/SliderRange.svelte)
- [`src/lib/components/DropdownMenuDemos.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/DropdownMenuDemos.svelte)
- [`src/lib/components/demos/dropdown-menu/DropdownMenuBasic.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/dropdown-menu/DropdownMenuBasic.svelte)
- [`src/lib/components/demos/dropdown-menu/DropdownMenuState.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/dropdown-menu/DropdownMenuState.svelte)
- [`src/lib/components/demos/dropdown-menu/DropdownMenuTrigger.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/dropdown-menu/DropdownMenuTrigger.svelte)
- [`src/lib/components/ContextMenuDemos.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/ContextMenuDemos.svelte)
- [`src/lib/components/demos/context-menu/ContextMenuBasic.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/context-menu/ContextMenuBasic.svelte)
- [`src/lib/components/demos/context-menu/ContextMenuChoices.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/context-menu/ContextMenuChoices.svelte)
- [`src/lib/components/demos/context-menu/ContextMenuTriggerSurface.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/components/demos/context-menu/ContextMenuTriggerSurface.svelte)
- [`src/lib/ported/PortedButtonDemos.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/PortedButtonDemos.svelte)
- [`src/lib/ported/demos/PortedButtonVariants.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/demos/PortedButtonVariants.svelte)
- [`src/lib/ported/demos/PortedButtonSizes.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/demos/PortedButtonSizes.svelte)
- [`src/lib/ported/demos/PortedButtonIconSizes.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/demos/PortedButtonIconSizes.svelte)
- [`src/lib/ported/demos/PortedButtonWithIcons.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/demos/PortedButtonWithIcons.svelte)
- [`src/lib/ported/demos/PortedButtonStates.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/demos/PortedButtonStates.svelte)
- [`src/lib/ported/demos/PortedButtonAnchor.svelte`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/ported/demos/PortedButtonAnchor.svelte)
- [`src/lib/styles/_10_component_library.sass`](file:///Users/amrit/fractalmandala/fractaldev/fractalsvelte-ui/src/lib/styles/_10_component_library.sass)

## Deps and Installations
- None (leveraged existing `shiki` dependency).

## Learnings
- In SvelteKit and Vite, importing `.svelte` files with `?raw` produces exact source strings cleanly, enabling true single-source-of-truth component demos without markup duplication.
- Using `shiki/engine/javascript` allows universal in-memory syntax highlighting without any WASM dependencies or runtime file fetching.
