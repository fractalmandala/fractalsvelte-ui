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

- [Refactor Demos and Universal Shiki Highlighting](docs/worklog/2026-09-20-demo-refactor-shiki.md) — Refactored component demos to standalone recipe components with ?raw imports and added Shiki code highlighting.