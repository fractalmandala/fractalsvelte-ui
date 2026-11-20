# Pass 2 — group `data` — PLAN rev 4 (D1 built and measured)

Package: `/Users/amrit/fractaldesign/packages/fractalsvelte-ui`
Group: `data` — accordion, carousel, collapsible, data-table, json-tree-view, table, tree, virtual-list, waterfall
Status: PLAN rev 4. D1 is implemented and measured; D2–D9 untouched.

## rev 4 — D1 built, one CoD edit had to change shape

CoD's edit 2 asked for `padding: 0` in each component's scoped `<style>`.
That is not available in this package: AGENTS.md Law 1 says "NO `<style>`
blocks. NO `style=\"…\"`. NO `style:prop` directives", and the gate enforces it
as `style/block` with the fix "delete it; compose fractalstyler classes in
markup". I wrote the two blocks, ran `pnpm verify data/accordion`, and got
exactly that error twice.

The fix that keeps the intent and the law is the extension layer AGENTS.md
already names for this ("Missing primitives go in the extension layer"):
`src/lib/styles/layers/components/data.css` gains

```
/* A surface that keeps only its edge and fill: the surface classes carry an
   8px inset, which would push row padding and .stack-rule dividers off the
   border. */
.surface-tight { padding: 0; }
```

The kit fragments load after fractalstyler's layers (the docs layout imports
`@fractaldesign/fractalstyler/styles` then `@fractaldesign/fractalsvelte-ui/
styles`), so one class beats `.outlined`'s padding by order, with no
specificity hack and no second copy in a second file. It also passes the
linter, which reads `custom.css`.

`surface-tight` is a fractalstyler primitive candidate for later: a surface
minus its inset is a general need, not an accordion one, so it belongs beside
`.outlined` in `border-elevation-focus.css` once that package takes a pass.
Until then it lives here, and its precedence depends on the kit's styles
loading after fractalstyler's. CoD approved that dependency (rev 5 note).

Everything else in rev 3's D1 stands. Edit 3 took option A: under `vacant`
the wrapper drops `overflow-hidden` and `{shape}`, because the clip eats the
first and last focus rings and the radius clips child corners.

rev 1 asked CoD four questions. rev 2 records the rulings and the measured
consequences of applying them. rev 3 takes CoD's D1 fix: the `pad-none`
pairing is dead on arrival, and padding is zeroed in the component's own
scoped style instead. Everything below is measurable in the current tree,
not assumed.

## rev 3 — what changed from rev 2

CoD was right about `pad-none`, and I re-checked it in the stylesheet before
editing this file:

- `dist/styles/index.css:4` imports `gaps-pads-margins.css`, where
  `.pad-none { padding: 0; }` is line 47.
- `dist/styles/index.css:8` imports `border-elevation-focus.css`, where
  `.outlined { border: 1px solid var(--border); padding: var(--space-bs); }`
  is line 64 (`.vacant`, `.elevated`, `.paneled`, `.overlayed` follow, all
  with the same 8px padding).

Both are single-class selectors, so the later import wins and `.outlined`
keeps its 8px. `pad-none` never lands. D1 rewritten to put `padding: 0` in
the component's scoped style, which compiles to a two-class selector and
beats `.outlined` without touching the fractalstyler cascade.

One mechanical correction to CoD's edit 2: a scoped style only reaches the
markup of its own component. The wrapper is in `Accordion.svelte` and the
gap-mode items are in `AccordionItem.svelte`, so the zero-padding rule has
to be written twice, once per component, under the same class name. Same
result, two files.

On edit 3 I took CoD's first option rather than calling it invisible. Under
`vacant` the wrapper drops `overflow-hidden` and `{shape}`, because an
8px-radius clip with no edge is not invisible in practice: `overflow-hidden`
clips the first and last item's focus ring, and the radius clips child
corners. Dropping both makes `vacant` equal today's `flush` exactly.

## Rulings carried in (CoD)

| item | ruling | what rev 2 does |
|---|---|---|
| Accordion `look` | approved with a fix: split into `surface` + `gap`. Real values are `separated/contained/flush`; `separated` is outlined, not elevated. No gap → surface on the wrapper. Gap → surface on each item. `flush` → `vacant` | D1 rewritten |
| `textSize`/`textColor`/`shape` | approved, defaults must match what each component shows today; shape value is `round`; hardcoded `modern` goes | D2/D3 rewritten with a per-component default table |
| `gap` | only accordion, tree, json-tree-view rows. Not tables, waterfall ticks, virtual-list, indent | D6 scope cut |
| `maxHeight` | rejected as `Size` (Size means control height). Use `Measure`; update the two examples passing `"16rem"`; leave VirtualList's pixel height alone | D8 rewritten |
| order/scope | confirmed: the 9 data components, then stop for CoD sign-off | unchanged |

## Constraints (unchanged from rev 1)

1. `src/lib/internal/tokens.ts` is NOT edited.
2. Canonical axes only.
3. `soft`/`tint`/`Look` are incorrect and are removed.
4. No `<style>`, `style="…"`, `style:prop`, raw hex, px literal >2px, literal `border-radius`.
5. No `radius-*` classes; radius comes from `Shape` only.
6. JSDoc/annotations live in each folder's `comments.md`.
7. Text axes on every text-bearing component, `ChildTextSize`/`ChildTextColor` for the second text section.
8. `pnpm verify data/<name>` per component; `pnpm gate` for the kit.
9. Visual before/after in the agent browser, shots in `impasses/pass-2-data-shots/`.

## Inventory (measured, unchanged)

| component | parts | examples | `radius-` | raw hex | inline JSDoc left |
|---|---|---|---|---|---|
| accordion | 2 | 3 | 0 | 0 | 2 |
| carousel | 2 | 4 | 0 | 0 | 0 |
| collapsible | 1 | 2 | 0 | 0 | 0 |
| data-table | 1 | 5 | 0 | 1 | 0 |
| json-tree-view | 2 | 1 | 1 | 0 | 0 |
| table | 7 | 5 | 0 | 0 | 0 |
| tree | 1 | 3 | 1 | 0 | 0 |
| virtual-list | 1 | 2 | 0 | 0 | 0 |
| waterfall | 1 | 1 | 0 | 0 | 0 |

## Decisions, as revised

### D1 — Accordion: `look` → `surface` + `gap`

Today (`accordion.svelte.ts`):

```
export type AccordionVariant = 'separated' | 'contained' | 'flush';
lookClass  = { separated: 'box gap-sm', contained: 'box border modern overflow-hidden stack-rule bg-surface', flush: 'box stack-rule' }
itemClass  = { separated: 'border modern bg-surface overflow-hidden', contained: '', flush: '' }
```

**Remove** `look`, `AccordionVariant`, `lookClass`, `itemClass`, and the
`look` member of `AccordionContext`. **Add:**

- `surface?: Surface`, default `outlined`
- `gap?: Gap`, default `''` (no gap) — this replaces the implicit `gap-sm`
  that `separated` baked in

One rule, no variant bank: **no gap → surface on the wrapper, items bare.
gap set → wrapper carries only the gap, every item carries the surface.**

Measured detail that changes the mapping: the canonical surface classes in
fractalstyler are not background-only. `border-elevation-focus.css` has
`.outlined { border: 1px solid var(--border); padding: var(--space-bs); }`,
`.vacant { padding: var(--space-bs); }`, `.elevated/.paneled/.overlayed` the
same plus background and shadow. A bare `{surface}` on the wrapper would add
an 8px inset that no accordion has today and push `stack-rule` dividers off
the border.

`pad-none` does not fix that (`index.css:4` vs `:8`, shown above), and a
scoped `<style>` block is banned by Law 1 (see rev 4). So the zeroing lives in
the extension layer as one class:

```css
/* src/lib/styles/layers/components/data.css */
.surface-tight { padding: 0; }
```

`surface-tight` goes on the wrapper under no gap, and on the item under gap,
never on a bare item, so a `pad-*` in a caller's `class` still wins on those.

Surface classes stay unmodified. `outlined` also carries `bg-surface`, because
today's `contained` paints one and `.outlined` alone does not:

```
surfaceClass = {
  outlined: 'outlined bg-surface',
  vacant:   'vacant',
  …remaining Surface values map to their own class, unchanged
}
```

Clipping and radius are edge decorations, so they follow the surface rather
than being unconditional: `clipped = surface !== 'vacant'`.

Wrapper under no gap: `box stack-rule {surfaceClass} {clipped && 'overflow-hidden'} {clipped && shape} surface-tight`.
Item under no gap: `{className}` only.
Wrapper under gap: `box {gap}`.
Item under gap: `{surfaceClass} {clipped && 'overflow-hidden'} {clipped && shape} surface-tight`.

Faithfulness check against today: no gap + `outlined` + `shape='modern'`
renders `border modern overflow-hidden stack-rule bg-surface` (`.outlined`
carries `border: 1px solid var(--border)`, the same declaration `.border`
adds), i.e. exactly today's `contained`. `vacant` renders `stack-rule vacant`
with `padding: 0` and no clip or radius, i.e. exactly today's `flush`. Gap +
`outlined` gives border + bg-surface + radius per item, today's `separated`
minus the `elevated` claim CoD corrected. **No visual regression by
construction; the before/after shots are the proof, and they are the gate.**

Two consequences, stated rather than discovered later:

1. `shape` is inert when `surface='vacant'`, since vacant has no edge to
   round. Documented in `comments.md` and `doc.ts`, not silently ignored.
2. A `pad-*` passed in `class` on the wrapper or on a gap-mode item now loses
   to the scoped `padding: 0` (both are one class, the scoped rule is two).
   Reaching for `surface` is the supported way to change that inset.

This is a public API change: `look` is gone, `surface` and `gap` replace it.

### D2 — `textSize`/`textColor`, defaults matching today

Measured current rendering, per component (source classes, not guesses):

| component | today's text | `textSize` default | `textColor` default | second section → `childTextSize` |
|---|---|---|---|---|
| accordion | no class, inherits body `--text-bs` | `text-bs` | `text-primary` | panel body `text-bs` |
| carousel | no class on label, dots `text-muted` | `text-bs` | `text-primary` | — |
| collapsible | no class | `text-bs` | `text-primary` | — |
| data-table | cells `text-xs`, toolbar `text-sm`, muted `text-muted` | `text-xs` | `text-primary` | toolbar `text-sm` |
| json-tree-view | wrapper `text-sm`, row `text-xs`, `text-muted` | `text-sm` | `text-primary` | row values `text-xs` |
| table | cells inherit `text-bs`, caption `text-sm` + `text-secondary` | `text-bs` | `text-primary` | caption `text-sm` |
| tree | no class, inherits | `text-bs` | `text-primary` | — |
| virtual-list | no class, inherits | `text-bs` | `text-primary` | — |
| waterfall | label `text-sm` + `text-muted`, tick `text-xs` | `text-sm` | `text-muted` | ticks `text-xs` |

`textColor` defaults mirror the class already applied to the primary text, so
no component changes colour on upgrade. Literal `text-muted`/`text-secondary`
on secondary elements stay as the child/fixed values they are, not new props.

### D3 — `Shape`, default matching today

| component | today's radius source | `shape` default |
|---|---|---|
| accordion | wrapper/item `modern` literal | `modern` |
| carousel | `modern` on the indicator, slides bordered (`curved` in examples only) | `modern` |
| collapsible | none on the wrapper | `modern` |
| data-table | `modern` literals on controls | `modern` |
| json-tree-view | wrapper `modern`, row `radius-sm` | `modern` |
| table | `framed && 'border modern bg-surface'` | `modern` |
| tree | `radius-xs` on the inline edit input | `modern` |
| virtual-list | none | `modern` |
| waterfall | wrapper `modern` | `modern` |

Every hardcoded `modern` in these folders is deleted and re-emitted from the
prop. `Shape`'s `round` is available and shown in examples; no default
becomes `round`.

### D4 — literal `radius-*` (unchanged)

`json-tree-view/JsonNodeRow.svelte:68` (`radius-sm`) and `tree/Tree.svelte:361`
(`radius-xs`) are replaced by `{shape}`.

### D5 — raw hex in data-table (unchanged)

One literal in the data-table folder maps to the nearest registered class.

### D6 — `Gap`, cut to three components

Add `gap?: Gap` (default `defaultGap`, `gap-bs`) to **accordion** (item
stack; here it is the surface switch from D1), **tree** (row rhythm),
**json-tree-view** (row rhythm). Not added to table, data-table, waterfall,
virtual-list: CoD's ruling is that gap there does nothing or breaks the layout.

### D7 — example coverage (unchanged)

`json-tree-view` 1, `waterfall` 1, `collapsible` 2, `virtual-list` 2 examples
cannot cover every value of every union prop. Add examples until
`pnpm verify data/<name>` passes: core primitive shows the full prop set,
siblings show only what they add. Size ladders run `h-md` → `h-xl`.

### D8 — `maxHeight` becomes `Measure`

`Table.svelte:16` and `DataTable.svelte:74` currently declare
`maxHeight?: Size | string`, and `helpers.ts` splits it across
`maxHeightClass` (`h-*` → `max-h-*`) and `maxHeightStyle` (anything else →
inline `max-height` custom property). Two ways to set one thing.

Change both to `maxHeight?: Measure`. `Measure` is
`measure-xs … measure-full`, one per `--measure-*` var, and
`shapes-sizes.css` already ships a matching `.max-h-*` per step, so
`helpers.maxHeightClass` gains a `measure-` arm (`measure-lg` → `max-h-lg`)
and the `maxHeightStyle` inline path and its `{@attach vars}` call are deleted
from both components. The `h-*` and free-string arms stay for other callers
(ScrollArea uses them).

The two examples passing `"16rem"`:
`table/examples/04-sticky.svelte:15` and
`data-table/examples/05-expand-visibility.svelte:66` become
`maxHeight="measure-sm"`. Nearest step is `measure-sm` = 20rem
(`--measure-xs` is 14rem, so 16rem sits between); the shot diff will show the
scroll box 4rem taller and nothing else.

`VirtualList.height` keeps its pixel path untouched this pass.

### D9 — cosmetic (unchanged)

`accordion/Accordion.svelte` unindented import and single-line context
getters, against house format.

## Work plan, in order

1. `pnpm dev`, screenshot all 9 doc pages + every example into
   `impasses/pass-2-data-shots/before/`; record console errors.
2. Apply D4, D5 (violations, no API change).
3. Apply D1, D2, D3, D6, D8, D9.
4. Update `comments.md` in each folder for every prop added/changed/removed.
5. Add examples until `pnpm verify data/<name>` passes for all 9.
6. `pnpm check`; fix fallout.
7. Re-run dev, screenshot into `.../after/`, diff against before, fix
   regressions. This step is the check on D1's padding reasoning.
8. Write `impasses/pass-2-data.md` (what changed, where, why, outcome vs plan)
   and submit to CoD for done-approval.

## D1 as built — measurements

Computed styles, old class set versus new, measured in the live page with
probe elements carrying the same markup:

| | height | padding | border | radius | overflow | background |
|---|---|---|---|---|---|---|
| old `contained` (`box border modern overflow-hidden stack-rule bg-surface`) | 98px | 0 | 1px | 6px | hidden | surface fill |
| new `outlined` (`box stack-rule surface-tight outlined bg-surface overflow-hidden modern`) | 98px | 0 | 1px | 6px | hidden | same fill, same border colour |
| old `flush` (`box stack-rule`) | 96px | 0 | 0 | 0 | visible | transparent |
| new `vacant` (`box stack-rule surface-tight vacant`) | 96px | 0 | 0 | 0 | visible | transparent |
| old separated item (`border modern bg-surface overflow-hidden`) | 34px | 0 | 1px | 6px | hidden | surface fill |
| new separated item (`surface-tight outlined bg-surface overflow-hidden modern`) | 34px | 0 | 1px | 6px | hidden | surface fill |
| gap wrapper, both | 118px | — | — | — | — | 8px row gap both |

Before/after screenshots of all three old looks: `impasses/pass-2-data-shots/
before/` and `.../after/`, six files, same 718×240 crop anchored to the panel's
top edge. Residual pixel diff per pair: 1169, 1163, 1169, all confined to glyph
edges inside the text block (bbox never reaches the border), which is the
antialiasing of a fractional baseline shift from the example's new copy above
the preview, not a style change.

Also in scope and fixed while here: the example used `soft`, which is in no
registry (linter error, pre-existing); it is `selected` now. And `shape`
appeared in no example, which the coverage check fails on; `01-usage` now
carries `shape="round"`.

`pnpm verify data/accordion` → gen ✔ gate ✔ lint ✔ svelte-check ✔. `pnpm
check` still reports 22 errors about a missing `Field` export in `inputs`
examples; those files are untouched by this pass and were failing before it.

Scope and order are as ruled: the 9 data components, then stop for sign-off.
