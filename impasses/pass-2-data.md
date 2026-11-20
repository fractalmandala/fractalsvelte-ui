# Pass 2 — group `data` — AS BUILT (D2–D9; D1 earlier, rev 4)

Package: `/Users/amrit/fractaldesign/packages/fractalsvelte-ui`
Plan: `impasses/pass-2-data-plan.md` (rev 4, D1 approved)
Scope built: carousel, collapsible, data-table, json-tree-view, table, tree, virtual-list, waterfall.
Untouched: `src/lib/internal/tokens.ts`.

## 1. What was done, per decision

| # | decision | built | files |
|---|---|---|---|
| D4 | literal `radius-*` → `{shape}` | `radius-sm` on the JSON row and `radius-xs` on the tree rename field both replaced by `{shape}` | `json-tree-view/internal/JsonNodeRow.svelte`, `tree/Tree.svelte` |
| D5 | raw hex in data-table | none exists. The one match, `media#1841`, is a branch name in example data, not a colour. Nothing to change. | — |
| D2 | `textSize`/`textColor` (+`childText*`) | added to all 8, defaults per component as measured | every component |
| D3 | `shape` | added to all 8, default `modern`, every hardcoded `modern` deleted and re-emitted from the prop | every component |
| D6 | `gap` | added to tree and json-tree-view; accordion already had it. Default `''`, not `defaultGap` — see 3a. | `tree`, `json-tree-view` |
| D8 | `maxHeight` → `Measure` | `Table` and `DataTable` take a `Measure`; both examples updated; one code path | `table/Table.svelte`, `data-table/DataTable.svelte`, 2 examples |
| D9 | cosmetic | already done in D1 | — |

New props by component (defaults in brackets):

- **carousel** — `shape` (`modern`), `textSize` (`text-bs`), `textColor` (`text-primary`)
- **collapsible** — `surface` (`vacant`), `shape` (`modern`), `textSize` (`text-bs`), `textColor` (`text-primary`)
- **data-table** — `shape` (`modern`), `textSize` (`text-md`), `textColor` (`text-primary`), `childTextSize` (`text-sm`), `childTextColor` (`text-muted`)
- **json-tree-view** — `surface` (`outlined`), `shape` (`modern`), `gap` (`''`), `textSize` (`text-sm`), `textColor` (`text-primary`), `childTextSize` (`text-xs`), `childTextColor` (`text-secondary`)
- **table** — `shape` (`modern`), `textSize` (`text-md`), `textColor` (`text-primary`); `maxHeight` is now `Measure`. `TableCaption` takes its own `textSize` (`text-sm`) and `textColor` (`text-secondary`).
- **tree** — `gap` (`''`), `shape` (`modern`), `textSize` (`text-bs`), `textColor` (`text-primary`)
- **virtual-list** — `surface` (`vacant`), `shape` (`modern`), `textSize` (`text-bs`), `textColor` (`text-primary`)
- **waterfall** — `surface` (`outlined`), `shape` (`modern`), `textSize` (`text-sm`), `textColor` (`text-primary`), `childTextSize` (`text-xs`), `childTextColor` (`text-muted`)

Every folder's `comments.md` carries the one-line description for each new prop; the gate reads them from there.

## 2. Three plan corrections, each measured

### 2a. `textSize` defaults: `text-md`, not `text-xs`/`text-bs`

The plan's D2 table read `text-xs` for data-table cells and `text-bs` for table cells. Neither is what renders today. The type comes from `components-base.css:321`:
`.data-table { font-size: var(--text-md) }` — body cells are **`text-md` (13.28px)**, and only the header cells are `text-xs`, from `.data-table th`. Measured in the live page: a bare `.data-table td` is 13.28px.

So `Table.textSize` and `DataTable.textSize` default to `text-md`. A `text-xs` default would have shrunk every table in the library; the plan's own criterion was "defaults matching today".

Same correction in `waterfall`: the plan said `textColor` default `text-muted`, but the row label carries no colour class (it inherits `text-primary`); `text-muted` is on the axis header, which is now `childTextColor`. Default is `text-primary`, `childTextColor` is `text-muted`.

### 2b. D8's class path does not work; the custom property does

D8 proposed `maxHeightClass` gaining a `measure-` arm (`measure-lg` → `max-h-lg`). That class cannot win: `.scroll-xy` (data kit fragment, imported after fractalstyler) declares `max-height: var(--max-height, none)`, so `max-h-*` on the same element is overridden by a later single-class rule. It also means today's `Size` arm has never worked — only the `maxHeightStyle` inline path ever applied a cap.

Built instead: one path, the one that works.
`helpers.maxHeightVar(maxHeight)` → `var(--measure-lg)`; `Table`/`DataTable` take `maxHeight?: Measure` and set it with `{@attach vars({ 'max-height': maxHeightVar(maxHeight) })}`. `maxHeightClass`/`maxHeightStyle` are untouched for `ScrollArea`, which still needs the `h-*` and free-string arms.

Examples `table/04-sticky` and `data-table/05-expand-visibility` now pass `maxHeight="measure-sm"` (20rem, up from 16rem — the closest step, as D8 predicted).

### 2c. `gap` defaults to `''`, not `defaultGap`, for tree and json-tree-view

Built with `defaultGap` first and looked at it: 1rem between rows breaks the tree. The `.indent.guides` hairlines become dashes and the selected row's fill floats as a detached pill (`impasses/pass-2-data-shots/after/tree-examples.jpg` was shot in that state, then re-shot). Both components now default to no gap, so today's rendering is untouched, and the examples show `gap="gap-xs"` — the same "no gap by default, opt in" rule D1 set for accordion.

## 3. Additions beyond the plan, for CoD's call

Two components draw no edge of their own, so a `shape` prop alone would be inert. Rather than ship a dead prop:

- **collapsible** gets `surface` (`vacant` = exactly today's look) + `shape`. A single disclosure is a one-item accordion, and `surface="outlined"` gives the old `look="separated"` back.
- **virtual-list** gets `surface` (`vacant`) + `shape`, for the same reason; today every use wraps it in a box by hand.

Both defaults render identically to the pre-pass component, so neither is a visual change. If CoD prefers no surface API on these two, deleting the pair leaves the component exactly as it is today minus a dead prop.

## 4. Two other things found and fixed in the group

### 4a. The carousel docs page froze the browser — a real infinite loop

`/components/data/carousel` locked the tab: no paint, no response. Bisected to `examples/02-autoplay-loop.svelte` (the page loaded with it removed, hung with it back, with autoplay off and every other prop stripped). Instrumented counters proved it: `register()` was called **324 times** in the first frames and climbing, and `attach` re-ran on the **same DOM node 412 times**.

Cause: `CarouselSlide`'s `{@attach attach}` runs inside a reactive context, and `register()` read the reactive `slides` array (`slides.some(...)`) and wrote it (`slides = [...slides, meta]`). Reading a reactive array inside an attachment makes that attachment depend on it, so every registration re-ran every other slide's attachment, which registered again.

Fix: the registry is a plain array (`registry: SlideMeta[]`) that the attachment reads; `slides` is only the reactive mirror the dots render from, written when the set actually changes. `register` is idempotent per node, and the slide only writes `node` when it differs. Cost: three lines of comment worth keeping in `Carousel.svelte`, because the trap is invisible.

Verified: the page loads, autoplay advances (slide 1 → 3 → 4 across shots), `04-gaps` renders eight carousels, and `03-still`'s unlabelled slide is still announced as "Slide 3 of 3".

### 4b. `soft` on the carousel indicator was in no registry

`class="indicator spring spring-snappy modern soft"` — `soft` exists nowhere, so the indicator had no fill at all and the pill behind the active dot was never visible. Replaced with `bg-panel`; the indicator now paints (measured background `oklch(0.2 0.012 34)`, radius 6px). Before/after: `pass-2-data-shots/before/carousel-examples.jpg` vs `after/carousel-examples.jpg`.

Three more invalid classes in the group, all now clean: `enter-scale` → removed (no `enter-*` class exists anywhere; the DataTable column menu keeps `pop`, which is real), `overflow-auto` → `scroll-xy` on the JSON tree.

## 5. Why the props are real, not inert

`textSize`/`textColor` on a table would silently lose to `.data-table`'s own `font-size`/`color`, and to `.dense.data-table`. So `data/components/data.css` gained an explicit block of `.data-table.text-*` rules (equal specificity, later import, so they win). Measured on the live page with probe elements:

| markup | cell font-size | cell colour |
|---|---|---|
| `.data-table` | 13.28px | `oklch(0.97 0.012 34)` |
| `.data-table.text-lg` | 19.2px | `oklch(0.97 0.012 34)` |
| `.data-table.dense.text-md` | 13.28px (prop beats density) | `oklch(0.97 0.012 34)` |
| `.data-table.text-muted` | 13.28px | `oklch(0.56 0.012 34)` |
| `.outlined` | — | padding 16px |
| `.surface-tight.outlined` | — | padding 0 |

And on the components themselves: `Collapsible surface="outlined"` → border 1px, radius 6px, fill `oklch(0.175 0.012 34)`, padding still 0; `JsonTreeView` → padding 16px (its own), radius 6px, overflow auto; `Waterfall` → padding 0, radius 6px, border 1px, 12px type; `VirtualList` → radius 6px, border 1px, 16px type.

### `surfaceClasses` moved to one home

The surface map and the `surface-tight` decoration now live in `internal/helpers.ts` (`surfaceClass`, `surfaceClasses(surface, shape, { clip, tight })`), and `accordion.svelte.ts` re-exports them instead of keeping a copy. Five copies of a six-line map is the drift this pass exists to remove. `pnpm verify data/accordion` still passes.

## 6. Verification

- `pnpm verify data/<name>` for all nine: gen ✔ gate ✔ lint ✔ svelte-check ✔.
- `pnpm gate data/*`: nine components, nine passing.
- `pnpm lint`: 0 violations.
- `pnpm check`: 22 errors, all the pre-existing `Field` export failure in `inputs` examples (not this group, was failing before the pass). Nothing else.
- Visual: every component page opened in the agent browser, every example previewed, console checked. Shots in `impasses/pass-2-data-shots/after/`.
- `JsonNodeRow.svelte` moved to `json-tree-view/internal/` — a recursive renderer, not a public part; `date-field/internal/Segments.svelte` is the precedent. It was unexported before and the gate only asks for root-level parts.

## 7. Examples added

- `json-tree-view/examples/02-surface-and-copy.svelte` — surface, shape, gap, all text axes, `sortKeys`, `copyable`, `maxStringLength`.
- `tree/02` — now covers `renamable`, `onRename`, `guides`, `gap`, `shape`, `textSize`, `textColor` (it was missing four of its own props).
- `waterfall/01` — covers `onSelect`, `unit` (both values), `ticks` and the new frame/text props.
- `virtual-list/01` — the wrapper gained `wfull`; without it the list's intrinsic width came from its buttons (the rows are absolutely positioned), so the example rendered 202px wide instead of full width. Pre-existing, visible, fixed.
- Example descriptions updated wherever a prop was added, so the page copy matches what it shows.

## 8. Not done / still open

- `TableCell`'s `muted` boolean still emits `text-secondary` rather than taking a `textColor`. It is an approved, documented prop that chooses between two roles, and changing it is a three-example API break; left for a decision in the inputs/table follow-up rather than smuggled into this pass.
- `overlays/popover`, `hover-card` and `tooltip` use `enter-up`/`enter-down`… classes that exist in no layer, and `popover` uses `radius-lg` where `Shape` should be. Outside this group; noted for the overlays pass.
- The `inputs` group's 22 `Field` errors block `pnpm check` from being green for the whole tree and will need that group's pass.
