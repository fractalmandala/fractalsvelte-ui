# Pass 5 — DataTable — PLAN rev 1

Package: `/Users/amrit/fractaldesign/packages/fractalsvelte-ui`
Component: `src/lib/components/data/data-table`
Live page: `http://localhost:5173/components/data/data-table`
Status: **PLAN ONLY.** Nothing under `data-table/` and nothing in
`src/lib/internal/tokens.ts` was edited. `tokens.ts` is still the 17 Nov file.

Sources read: `AGENTS.md` (live sections), `src/lib/internal/tokens.ts`,
`DataTable.svelte`, `table-state.svelte.ts`, all 5 examples, `doc.ts`,
`comments.md`, `data/table/*`, `data.css`, `components-base.css`,
`inputs/input/{Input,frame}`, `inputs/checkbox/Checkbox`, `actions/button/Button`.
Everything below was measured in the agent browser on the live page, light mode
(1280×800, DPR 1) unless marked as dark.

---

## 0. Ground rules I am holding to

1. `tokens.ts` is not edited. Where `AGENTS.md` and `tokens.ts` disagree,
   `tokens.ts` wins and the mismatch is flagged (§7, F7).
2. Canonical axes only. No `soft`, no `tint`, no `Look`.
3. No `<style>`, no `style="…"`, no raw hex, no `radius-*`, no `pad-*` /
   `text-*` literal standing in for a prop on a part that has one.
4. Only the `data-table` folder is mine this pass. Two shared files are needed
   by a fix and are flagged, not assumed: `Table.svelte` (frame surface,
   header type) and `data.css` (the rules those two need).
5. The carousel is untouched. Its size ladder stays on `h-md`.

---

## 1. What the page does today (measured)

| part | class as emitted | measured |
|---|---|---|
| root | `box gap-sm text-sm text-muted` | gap 8, flex column, no padding, width 572 (content-driven) |
| toolbar row | `row xbetween ycenter gap-sm wrap` | **height 50**, padding 0, gap 8, space-between |
| filter frame | `row ycenter gap-sm border modern bg-input grow field pad-sm` | 50 tall, pad 8, radius 6, border 1px `--border`, bg `--bg-input` |
| filter input | `input bare grow h-lg text-md` | 32 tall, **font 12px** |
| columns trigger | `button ghost h-lg text-sm gap-sm modern` | 32 tall, **font 12px**, pad 1/12 |
| columns menu | `floating at-bottom-end pop glass rim shad-sm border pad-sm measure-xs modern` | 224×207, pad 8, radius 6, `--bg` 0.72 + blur 16 |
| menu heading | `text-xs text-secondary weight-600 pad-sm` | 10.72px, `text-secondary`, pad 8 |
| menu item | `item` (registered primitive) | 32 tall, pad 4/8, gap 8, **font 13.28** |
| sort button | `bare row ycenter gap-sm pointer focus-ring text-xs weight-600` | 10.72 / 600 |
| `th` | `ta-l data-table-select` (+ base rule) | 10.72 / 600 / uppercase / `text-secondary` / `--state-hover` |
| `td` | `ta-l` | 13.28, pad 8/16 (dense 4/12) |
| table frame | `scroll-xy scroll-thin wfull border bg-surface modern` | border 1px, radius 6, bg `--bg-surface` |
| skeleton bar | `block h-md modern bg-input anim-pulse wvar` | 20 tall, radius 6 |
| empty cell | `ta-l data-table-empty text-secondary` | pad 48/16, centred, **`text-secondary` 0.42** |
| footer row | `row xbetween ycenter gap-sm wrap` | **height 16**, padding 0, gap 8 |
| pager buttons | Button `size="h-sm"` | **16×16** (icon) / 23.6×16 (number), font 13.28 |

Shape ladder measured in this theme: `rect` 0 · `mincurved` 3 · `modern` 6 ·
`curved` 12 · `round` 999.
Space ladder measured: pad-xs 4 · sm 8 · md 12 · bs 16 · lg 24 · xl 32.
Height ladder: h-xs 12 · h-sm 16 · h-md 20 · h-bs 27 · h-lg 32 · h-xl 40 ·
h-2xl 48 · h-3xl 64.

Dark mode was checked on the same page: frame `--bg-surface` 0.175, field
`--bg-input` 0.185, border 0.27, `th` white 6%. The field is only 0.01 lighter
than the frame it sits on, so the filter's own edge is what carries it. Nothing
in this plan changes that.

`/Users/amrit/fractaldesign/packages/fractalsvelte-ui/impasses/pass-5-datatable-shots/before/data-table-examples-light.png`
is the "before" shot.

---

## 2. The defects the checklist names

**D-A · no `size`.** The toolbar's two controls are **50 and 32 px** tall,
centre-aligned next to each other. The filter is 32px of input inside 8px of
padding inside a 1px border; the button is 32 flat. The footer band is 16. So
the grid is flanked by a 50px band and a 16px band, and none of the three
heights comes from a prop.

**D-B · no `gap`, no `alignContent`, no `pad`.** Six literal occurrences:
root `gap-sm`, toolbar `gap-sm` + `xbetween`, filter label `gap-sm`, field
`gap-sm` + `pad-sm`, sort button `gap-sm`, footer `gap-sm` + `xbetween`, pager
cluster `gap-xs`.

**D-C · the columns menu hardcodes a Surface value.** `glass` is a member of
`Surface` in `tokens.ts`, so writing `glass` in markup is a literal standing in
for a prop, exactly like `text-secondary`. Same for its `pad-sm` and its
`modern` (which does at least come from `{shape}`).

**D-D · a hand-rolled button, and two dead literals.**
- `button ghost h-lg text-sm gap-sm` is a raw `<button class="button …">`
  duplicating `Button` (variant, size, textSize, gap all literal), while the
  pager 20 lines below uses `Button`.
- The filter input's `text-md` is **inert**: `.bare` sets `font: inherit` and
  comes later in the cascade, so the input renders at the wrapper's 12px.
  Measured 12px, not 13.28.
- The sort button's `text-xs weight-600` is **redundant**: `.data-table th` is
  already 10.72/600/uppercase, and `.bare` inherits it. Measured identical.

**D-E · the pager ignores `childTextSize`.** `childTextSize`'s own doc line is
"the type size of the toolbar, the filter field and the paging row". The pager
Buttons take `Button`'s default `text-md` (13.28) while the footer's "1–6 of 12"
is 12. Same for the menu items (13.28). Measured.

**D-F · the pager is below the minimum target size.** 16×16 for the four arrow
buttons, 23.6×16 for a page number. WCAG 2.5.8 (AA) is 24×24. `h-sm` is 16px,
so this is the size prop being set one rung too low, not a missing class.

**D-G · inactive text in `text-secondary`.** The empty cell's own message is
inactive text and uses `text-secondary` (0.42); the house rule is `text-muted`
(0.58). Measured both.

---

## 3. Proposed props

| prop | type | default | drives |
|---|---|---|---|
| `size` | `Size` | `h-lg` | filter field frame, columns trigger, pager buttons |
| `gap` | `Gap` | `gap-sm` | root, toolbar, filter label, footer, pager cluster, sort button, menu list |
| `pad` | `Pad` | `pad-sm` | the columns menu's inset only |
| `surface` | `Surface` | `glass` | the columns menu; and the grid frame once `Table` takes `surface` (§7 F1) |
| `shape` | `Shape` | `modern` | **already exists** — frame, menu, every Button, skeleton bar |
| `alignContent` | `AlignContent` | `xbetween` | toolbar row, footer row |
| `textSize`, `textColor` | `TextSize`, `TextColor` | `text-md`, `text-primary` | **already exist** — body cells |
| `childTextSize`, `childTextColor` | `ChildTextSize`, `ChildTextColor` | `text-sm`, `text-muted` | **already exist** — filter, columns trigger, menu, footer, empty cell, pager Buttons, caption |

Defaults are all "what renders today", so the pass is not a redesign. The one
default that changes a pixel is `size = h-lg` replacing the field's 50px: the
filter drops to 32 and lines up with the button beside it (D-A).

No `variant` prop, on purpose — see §7 F4.

---

## 4. Part × axis matrix

Every part with height, a background or border, radius, >1 child, padding,
text, or alignment, and which axis covers it.

| # | part | axes | how |
|---|---|---|---|
| 1 | root `div.box` | gap | `{gap}` |
| 2 | toolbar row | gap, align | `{gap}`, `{alignContent}` |
| 3 | filter label | gap | `{gap}` |
| 4 | filter field | **size, shape, textSize, variant** | replaced by `Input` — `size={size} shape={shape} textSize={childTextSize} textColor={childTextColor}`; chrome (`bg-input`/`border`) is `Input`'s `variant="outline"` default |
| 5 | columns trigger | size, textSize, shape, variant | replaced by `Button variant="ghost" size={size} textSize={childTextSize} shape={shape} icon={luColumns3}` |
| 6 | columns menu | surface, shape, pad, gap | `surface={surface}` + `surface-tight`, `{shape}`, inner panel `{pad}` `{gap}` |
| 7 | menu heading | childTextSize, childTextColor | `{childTextSize} {childTextColor}` |
| 8 | menu item | childTextSize, childTextColor | `textSize={childTextSize} textColor={childTextColor}` added to `Checkbox` (see F6) |
| 9 | grid frame | surface, shape | `{shape}` today; `{surface}` needs `Table` (F1) |
| 10 | caption | childTextSize, childTextColor | pass both to `TableCaption` |
| 11 | header cells | text, surface, align | per-column `align` exists; **type and fill are Table's** (F2) |
| 12 | body cells | textSize, textColor, align | exists |
| 13 | sort button | gap, size | `{gap}`, `hfull` under `size`; `text-xs weight-600` deleted (dead) |
| 14 | skeleton bar | shape | `{shape}`; height stays `h-md` (F5) |
| 15 | empty cell | childTextColor | `childTextColor`, `text-secondary` → `text-muted` |
| 16 | detail panel | pad, text | `{pad}` for the inset; the snippet's own text is the caller's |
| 17 | footer row | gap, align | `{gap}`, `{alignContent}` |
| 18 | pager cluster | gap | `{gap}` |
| 19 | pager buttons | size, textSize, shape, variant | `size={size}` (16→32), `textSize={childTextSize}`, `{shape}`; variants stay role-fixed (`ghost` / `secondary` for the current page) |
| 20 | checkboxes | — | `.checkbox-box` primitive, but a hand-copy of `Checkbox` (F6) |

---

## 5. File by file

### `DataTable.svelte`

- `interface Props`: add `size`, `gap`, `pad`, `surface`, `alignContent`.
  Extend the token imports for `Gap`, `Pad`, `Surface`, `AlignContent`, `Size`.
- `240` root: `['box', gap, childTextSize, childTextColor, className]`.
- `241` toolbar: `['row wrap ycenter', alignContent, gap]`.
- `242` filter label: `['grow', gap]`.
- `244-250` filter: delete the hand-rolled span + input, use
  `<Input icon={luSearch} {size} {shape} textSize={childTextSize}
  textColor={childTextColor} value={filter} onValueChange={setFilter}
  placeholder={…} aria-label={…} class="grow" />`.
  `Input` emits `field row ycenter wfull px-md gap-sm modern h-lg bg-input border`
  for `outline`/`h-lg`, so the chrome is unchanged; the frame goes 50 → 32 and
  the horizontal inset 8 → 12. That is the only pixel change from this swap.
- `256-266` columns trigger: replace the raw `<button class="button …">` with
  `<Button variant="ghost" {size} {shape} textSize={childTextSize}
  icon={luColumns3} popovertarget=… aria-haspopup="dialog"
  aria-expanded={columnsOpen} {@attach anchor(uid)}>Columns</Button>`.
- `268-300` menu: `[surface, 'surface-tight', shape, 'floating at-bottom-end pop
  rim shad-sm measure-xs', 'pad-none']` with an inner
  `<div class={['box', gap, pad]}>` around the heading and the items.
  `rim shad-sm` stay: the elevation of an overlay is not a consumer choice.
- `277` heading: `['weight-600', childTextSize, childTextColor]` and drop its
  `pad-sm` (the inner panel pads).
- `279-295` item: `<Checkbox>` (F6) instead of `label.item` + raw input.
- `309` caption: `<TableCaption visuallyHidden={…} textSize={childTextSize}
  textColor={childTextColor}>`.
- `341` sort button: `['bare row ycenter pointer focus-ring', gap]`.
- `382` skeleton: `['block h-md bg-input anim-pulse wvar', shape]`.
- `391` empty cell: `['data-table-empty', childTextColor]` (defaults to
  `text-muted`, so the message lightens 0.42 → 0.58 on default).
- `463` detail: `[pad]`.
- `474` footer: `['row wrap ycenter', alignContent, gap]`.
- `481` pager cluster: `['row ycenter', gap]`.
- `482-540` pager Buttons: `size={size}`, `textSize={childTextSize}`,
  `{shape}` (16 → 32 tall).

### `comments.md`
One line per new prop, in the existing keyed format. `pad`, `alignContent`,
`surface`, `size` are new keys; `size` also gets the note that it sets both the
control height and the pager's target size.

### `doc.ts`
`features` gains "Size, shape, surface and gap on the shared ladders"; the
`description` sentence about the pager drops "quiet" if the height changes;
nothing else. No API list change (`api` is for non-component exports).

### `examples/*` — §6.

### Not mine, needed:
- `data/table/Table.svelte` — `surface` in place of `framed` (F1), and
  `childTextSize`/`childTextColor` for the header (F2).
- `styles/layers/components/data.css` — `surface-tight` already exists; F2
  needs 16 `.data-table.<childText*>` header rules beside the existing 16 cell
  rules.
- `inputs/checkbox/Checkbox.svelte` — its `size` prop is declared and never
  used; `checked` also needs to be given a real box height for the menu row
  (F6).

---

## 6. Examples: 5 today → 15

Today `04-pagination-loading` sets page, pageSize, loading, density, textSize,
textColor, childTextSize, childTextColor and shape at once, and
`05-expand-visibility` sets detail, expanded, hiddenColumns, stickyHeader,
maxHeight, label, framed, caption, captionHidden and an empty snippet. Both
files demo six-plus axes each, so a reader cannot tell which class did what and
the gate cannot tell which value came from where.

Target, one axis per file, 2-row slices so each grid is ~200px rather than 470:

| file | shows |
|---|---|
| `01-usage` | the core primitive, defaults only (today's file, minus nothing) |
| `02-sort-filter` | `bind:sort`, `bind:filter`, `onSortChange`, `onFilterChange`, a per-column `filter` |
| `03-selection` | `bind:selection`, `onSelectionChange`, shift range, `onRowClick` |
| `04-pagination` | `bind:page`, `pageSize`, `onPageChange`, `onPageSizeChange` |
| `05-loading-empty` | `loading` skeleton rows, the built-in empty message, the `empty` snippet |
| `06-detail` | `detail`, `bind:expanded`, `onExpandedChange` |
| `07-columns` | `bind:hiddenColumns`, `onHiddenColumnsChange`, the menu in use |
| `08-size` | `h-md · h-bs · h-lg · h-xl` visible; the other four named in a commented literal array (they are covered, not rendered: `h-xs` 12px and `h-2xl/3xl` 48/64 are not grid control heights) |
| `09-gap` | all nine `Gap` values, `''` first |
| `10-shape` | five shapes on the frame and the pager |
| `11-surface` | six surfaces on the menu (and the frame, once F1 lands) |
| `12-type` | `textSize` × `textColor` on cells, `childTextSize` × `childTextColor` on the chrome — one family, so one file, like `actions/button/09-text-size` |
| `13-align` | six `AlignContent` values on the toolbar and footer |
| `14-layout` | `density` (3, via a toggle whose labels are `Compact`/`Cozy`/`Comfortable` not raw tokens), `striped`, `hoverable`, `stickyHeader` + `maxHeight`, `label`, `caption`, `captionHidden` |
| `15-pad` | seven `Pad` values on the menu (only if `pad` lands) |

Fixture rule applied to 08: the four extremes are a commented literal array,
with the comment saying why they are not rendered. That satisfies the gate's
`coverage/value` requirement (it accepts a quoted literal anywhere in the
corpus) without lying about the ladder.

---

## 7. Where a fix would invent a rule (CoD to rule)

**F1 · the frame's surface lives in `Table`.** `framed?: boolean` emits
`border bg-surface` or nothing. `Surface` cannot express that: every surface
class carries `padding: var(--space-bs)` (measured 16px on all six), so
`outlined` on a table frame would inset the first row and push `stack-rule`-style
hairlines off the border. The mapping that works is `outlined` + `surface-tight`
(framed) and `vacant` + `surface-tight` (unframed), with `surface-tight` already
approved for accordion in `data.css`. **This needs `Table.svelte`.** Options:
(a) convert `Table` in this pass and let `DataTable` pass `surface` through,
(b) leave `framed` alone and ship `DataTable` with no frame surface axis.
I recommend (a) — otherwise the checklist's `surface` item for the frame is
unmet. It is the one place the fix reaches outside `data-table/`.

**F2 · the header has no type axis.** `.data-table th` (components-base.css:326)
hardcodes `font-size: var(--text-xs)`, `font-weight: 600`, `uppercase`,
`color: var(--text-secondary)`, `background: var(--state-hover)`. No prop on
`Table` or `DataTable` can move it. Giving it one means `Table` taking
`childTextSize`/`childTextColor` and `data.css` gaining
`.data-table.text-* th { font-size: … }` × 8 and `.data-table.text-* th
{ color: … }` × 8 — the same equal-specificity trick pass 2 used for the cells,
16 more rules. I would do it, but it doubles that block and it is `Table`'s
decision, not `data-table`'s. **Recommend: separate decision, this pass or
next.**

**F3 · a surface on an overlay needs an inner padding wrapper.** `pad-*` cannot
beat a surface's 16px inset (surfaces and pads are both single-class rules;
surfaces are imported later, measured). `surface-tight` fixes that but is
emitted after both, so it also beats `pad-*`. So the menu becomes popover
(`surface` + `surface-tight`) → inner `div` (`pad` + `gap`). That is one extra
element, not a new rule. Stated here because it is visible in the markup.

**F4 · no `variant` prop, deliberately.** The only chrome controls are the
columns trigger and the pager, both `Button`s whose variant is a role decision
(ghost trigger; secondary for the current page). A `variant` prop on
`DataTable` would let a caller paint the pager `danger` and break the one
hierarchy the component has. If CoD wants the axis anyway, `variant` on the
trigger is the only defensible home.

**F5 · the skeleton bar's height stays `h-md`.** It is a placeholder sized to
suggest a line of text (20px inside a 29–36px row), not a control. Putting it
on `size` would make a 32px bar fill a 32px row and read as a filled row. The
bar still takes `{shape}`. Flagged because it is the one part with a height and
no `size`.

**F6 · the checkboxes are a hand-copy of `Checkbox`, and I am not swapping them
here.** `selection/checkbox/Checkbox` renders exactly the same
`label > .checkbox-box > input + luCheck/luMinus` structure, with the spring
`Checkbox` already has and `DataTable` copies statically. The reason not to
swap in this pass: the menu row needs `.item`'s chrome (full width, `min-height:
h-lg`, 4/8 padding, hover fill) which `Checkbox`'s `inline-flex` label does not
provide, and `Checkbox.size` is declared and never used (dead), so `size` would
not reach it. Swapping means either an inputs-kit change or a visual change to
the menu. **Recommend: a following `Checkbox` pass.** Until then the raw inputs
stay as they are, unchanged by this plan.

**F7 · `AGENTS.md` and `tokens.ts` disagree about `size`.** AGENTS.md §2's
authoring sample writes `sizeClass[size]` and §CANONICAL says `Size` is
`h-xs … h-3xl`; `tokens.ts` exports no `sizeClass` — `Size` *is* the class
(`'h-md'`), and `defaultSize = 'h-lg'`. Every component already treats the prop
as the class. The doc sample is stale; `tokens.ts` wins. Not fixing the doc in
this pass (it is not `data-table/`), flagging it.

---

## 8. Verification when this is approved

1. `pnpm verify data/data-table` — gen, gate, lint, svelte-check. Not run for
   this plan: nothing may be written under `data-table/` yet.
2. Re-measure the §1 table and publish a before/after column: every claim here
   becomes a pixel, same selectors, light and dark.
3. Click through on the live page, light and dark: sort header (asc → desc →
   off, shift for multi), open the menu and toggle a column, select a row and
   shift-select a range, select-all to indeterminate, every pager button, an
   expander, `loading`, and both empty states. No console errors.
4. Target size: the pager must measure ≥ 24×24 after `size = h-lg` (32).
5. Shots per `impasses/RULES.md` 5 into `impasses/pass-5-datatable-shots/after/`:
   one per example, light and dark.
6. Nothing committed.

---

## 9. Not doing in this pass

- The carousel. Untouched, size ladder stays `h-md`.
- `tokens.ts`. Untouched.
- The `Checkbox` / `Input` / `Button` kits themselves (F6).
- `DropdownMenu` as the columns menu. It is the right long-term answer and the
  wrong blast radius now; the raw popover already uses the platform API.
- The DataTable's content-driven width. It is 572 inside a 718 stage because
  the stage centres its children; a caller decides that, not the component.

---

## 10. The one question for CoD

F1 and F2 both need `Table.svelte`. Do I take `Table`'s `surface` (and, if you
agree, its `childText*` header axis) in this pass, or does DataTable ship with
`framed` and a header type that no prop can move, and wait for Table's own pass?
