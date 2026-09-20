# Work Tracker

## Next

### Gate 0 — DONE (auditor approved)
Typed contract, registry, shell-only store, bus, registry-driven shell. Completed and approved.

### Gate 1 — DONE (auditor approved)
argv → surfaces/argv/ + .ts helpers, P24 collision fixed. Completed and approved.

### Gate 2 — DONE (auditor approved)
themes → surfaces/themes/, state out of the shell. All Themes persistence surface-owned; loading/error placeholder moved into the surface; `fullWhileLoading` added to the contract.

### Gate 3 — DONE (auditor approved)
schemes → surfaces/schemes/. Import-to-Themes rerouted through the event bus (`themes:import-pair`); schemes lazy-load via its own hook; read-failure fallback preserved.

### Gate 4 — DONE (auditor approved)
sassy → surfaces/sassy/ + Gate 3 audit cleanups (palette-meta.ts shared domain-meta, events.ts contracts, HMR guard, registry spreads, states.ts deletion).

### Gate 5 — DONE (auditor approved)
untw → surfaces/untw/ (no load hook — fully offline). AGENTS.md New Surface/Tab rewritten to the registry+folder contract. Golden replay 78/78 byte-exact. color.js/samples.js → .ts; $lib root has zero .js files.

The full rollout (Gates 0–5) is implemented and auditor-approved, pending user evaluation. Gates 0–5 remain UNCOMMITTED (HEAD ee2feae) — committing awaits explicit human instruction.


## Reports

- [Sync Scripts and ThemeBuilder with Token Contract](docs/worklog/2026-09-21-sync-scripts-themebuilder.md) — Synchronize scripts, tokens.ts, themes.ts, color-harmony.ts, and themebuilder components with token contract.
- [Synchronize Themes with Token Contract](docs/worklog/2026-09-21-sync-themes-tokens.md) — Update all 76 themes in _00_themes.sass to match token definitions in _00_tokens.sass with self-contained tokens.
- [Enhance ThemeBuilder Sidebar Layout and Controls](docs/worklog/2026-09-20-enhance-theme-builder-sidebar.md) — Upgrade ThemeBuilder left sidebar layout, controls, chips, sliders, and buttons using library design tokens and classes.
- [Style ModeToggle Component Professionally](docs/worklog/2026-09-20-style-mode-toggle.md) — Refactor ModeToggle with refined proportions, tactile surface depth, accessible states, and crisp stroke icons.
- [Nested Dynamic Category Slugs for Component Routes](docs/worklog/2026-09-20-nested-category-component-routes.md) — Nest all component routes under dynamic category slugs (/components/[category]/[slug]) with dynamic category index pages.
- [Refactor Demos and Universal Shiki Highlighting](docs/worklog/2026-09-20-demo-refactor-shiki.md) — Refactored component demos to standalone recipe components with ?raw imports and added Shiki code highlighting.
- [Fix Sidebar Section Toggle on Active Component Pages](docs/worklog/2026-09-20-sidebar-section-toggle.md) — Prevent reactive effect from forcibly reopening active sidebar accordion sections when toggled closed by user.
- [Standardize Code Snippet Copy Buttons and Dual Shiki Themes](docs/worklog/2026-09-20-standardize-code-blocks-shiki-theme.md) — Standardize copy buttons across all code blocks and implement theme-aware Shiki highlighting without inversion.
- [Self-Contained Component Styling Across All Library Components](docs/worklog/2026-09-20-component-inline-sass-button.md) — Colocate pure Sass styles inside each component's .svelte file and eliminate duplicate modifier selectors.
- [Standardize Component Types](docs/worklog/2026-09-20-standardize-component-types.md) — Standardize component prop types from componentTypes.ts across ComponentPreview, components, and demos.
- [Component Demo Spacing and Variation Selectors](docs/worklog/2026-09-20-demo-spacing-and-variation-selectors.md) — Unified spacing ladder, section rhythm, and interactive variation selectors across component demo pages.
- [Improved Table Styling and Formatting](docs/worklog/2026-09-20-improved-table-styling-and-formatting.md) — Developer-grade table typography, comfortable cell padding, refined type formatting, and props deduplication.
- [Nested Route Layouts for Components and Guides](docs/worklog/2026-09-20-nested-route-layouts.md) — Extracted sidebar and TOC rails from root layout into dedicated layouts for components and guides routes.