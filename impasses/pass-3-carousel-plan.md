# Pass 3: `data/carousel` PLAN (rev 1, nothing built)

Package: `/Users/amrit/fractaldesign/packages/fractalsvelte-ui`
Scope: `src/lib/components/data/carousel` only.
Not touched: `src/lib/internal/tokens.ts`, `AGENTS.md`, carousel source (this rev is plan only), accordion, collapsible.
Baseline: `pnpm gate data/carousel` → ✔ passing, 0 errors (measured this session).

## 0. What the carousel is today, measured

Read: `AGENTS.md` (top through *Component Examples*), `src/lib/internal/tokens.ts`,
`Carousel.svelte`, `CarouselSlide.svelte`, `carousel.svelte.ts`, `index.ts`, `doc.ts`,
`comments.md`, `examples/01..04`, `src/lib/internal/helpers.ts`,
`src/lib/styles/layers/components/data.css`, fractalstyler `registry.md`.

Live, first carousel on `http://localhost:5173/components/data/carousel`:

| element | class | computed |
|---|---|---|
| root | `box gap-sm text-bs text-primary` | gap 8, pad 0, border 0, radius 0, font 16px |
| nav row | `row ycenter gap-sm` | gap 8 |
| nav buttons | `ghost h-sm modern btn-icon` | **16 × 16** (h-sm = 16px) |
| rail | `slides reel carousel-track grow gap-md is-draggable` | gap 12 |
| slide | `slide` | 606 × 92, pad 0 |
| dots row | `row ycenter xcenter gap-sm relative` | gap 8 |
| dot button | `bare pad-sm focus-ring` | pad **0**, box **8 × 8** |
| dot | `dot` / `dot text-muted` | 8 |
| indicator | `indicator spring spring-snappy modern bg-panel` | h 8, radius 6 |

Two measured defects fall out of that table:

1. **`pad-sm` on the dot button is dead.** `.pad-sm` lives in `gaps-pads-margins.css`
   (layer 3); `.bare` sets `padding: 0` in `border-elevation-focus.css` (layer 6).
   `.bare` wins on order, so the tap target is the 8px dot. Below the 24px floor.
2. **`size="h-sm"` makes the nav buttons 16 × 16.** Also below the floor.

`size` and `pad` are therefore not cosmetic additions: they are the fix for both,
and they are the two canonical props the carousel is most obviously missing.

## 1. The canonical set, part by part

`tokens.ts` is the authority. Props already present are not re-litigated.

### `Carousel.svelte` (root)

| prop | today | plan | default | why |
|---|---|---|---|---|
| `surface` | none | **add** | `'vacant'` | the carousel's skin. `variant` is the wrong axis: this is not a control, and `Variant` is `background + border` for buttons/inputs. `surface` is what cards, accordions, collapsibles, tables use. |
| `shape` | indicator only | **widen** | `'modern'` | `Shape` "determines border-radius" for the component, not for one inner pill. It now rounds the slide frame *and* the indicator, one value, both. |
| `pad` | none | **add** | `undefined` (no class) | the inset of each slide body. On the root it is the inherited default; a slide may override. `undefined` keeps today's 0. |
| `size` | `h-sm` literal on both buttons | **add** | `'h-bs'` (27px) | height of the chrome controls (prev/next, dot targets). `h-bs` is the smallest step that clears 24px and stays quiet beside a 92px slide. `h-lg` (32px) is the alternative if CoD prefers the library default. |
| `gap` | rail only (`gap-md`) | **widen** | `'gap-md'` (unchanged) | one gap for the whole carousel: root box, nav row, rail, dot row. `gap-md` = 12px, so the three `gap-sm` literals (8px) go to 12px. Small, deliberate, coherent. |
| `textSize` | present | keep | `'text-bs'` | chrome type. |
| `textColor` | present | keep | `'text-primary'` | chrome ink. |
| `childTextSize` | none | **add** | `'text-bs'` | the slide body is the second text section. Passed down, overridable per slide. |
| `childTextColor` | none | **add** | `'text-primary'` | same. |
| `alignContent` | `xcenter` literal on the dot row | **add** | `'xcenter'` | where the dot row sits. `alignContentClasses` (helpers) also carries `ta-l`/`ta-c`/`mleft` for the two mobile-first values, so it is the right helper, not a bare flex word. |
| `index`, `onIndexChange`, `loop`, `autoplay`, `perView`, `label`, `children` | present | keep | n/a | behaviour, no change. |

### `CarouselSlide.svelte` (part)

| prop | plan | default | why |
|---|---|---|---|
| `surface` | **add** | inherit root (`'vacant'`) | a slide is a frame; examples currently hand-draw `border modern bg-surface` inside every slide. Those literals become one prop. |
| `shape` | **add** | inherit root | the frame's corners. |
| `pad` | **add** | inherit root | the body inset. |
| `textSize` | **add** | inherit `childTextSize` | local override of the body type. |
| `textColor` | **add** | inherit `childTextColor` | local override of the body ink. |
| `label`, `children` | keep | n/a | accessibility + content. |

`childTextSize` / `childTextColor` live on **Carousel only**. A slide's body *is* the
child section, so putting the child pair on both parts would mean two names for one
box. This mirrors accordion/collapsible, where the root owns the child pair.

`alignContent` also stays on **Carousel only**, and it drives the dot row. Slide
content alignment belongs to the box an author writes inside the slide; the carousel
does not restyle user markup beyond its own frame. Flagged as a judgement call in §5.

## 2. Literal class → prop, line by line

`Carousel.svelte`

| where | today | becomes |
|---|---|---|
| root | `['box gap-sm', textSize, textColor, className]` | `['box', ...surfaceClasses(surface, shape), gap, textSize, textColor, className]` |
| nav row | `row ycenter gap-sm` | `row ycenter {gap}` |
| both `Button`s | `size="h-sm"` | `size={size}` |
| rail | `… grow {gap} is-draggable` | unchanged (`gap` now comes from the same prop the chrome uses) |
| dot row | `row ycenter xcenter gap-sm relative` | `row ycenter relative` + `...alignContentClasses[alignContent]` + `{gap}` |
| dot button | `bare pad-sm focus-ring` | `bare square focus-ring {size}`. `.square` is `aspect-ratio: 1`, so the target is `size` × `size`; `pad-sm` deleted because `.bare` overrode it anyway |
| indicator | `indicator spring spring-snappy {shape} bg-panel` | unchanged. `bg-panel` is the pill's own paint, not a surface. |
| inactive dot | `text-muted` | keep as the fixed inactive value (AGENTS: inactive uses `text-muted`) |

`CarouselSlide.svelte` needs a second element, because padding and a surface must
never sit on the same node here:

```svelte
<div class={['slide', className]} role="group" aria-roledescription="slide" aria-label=… {@attach} {...rest}>
	<div class={['box hfull wfull', ...surfaceClasses(surface, shape), pad, textSize, textColor]}>
		{@render children?.()}
	</div>
</div>
```

Why the inner box, measured: `.surface-tight` (kit fragment, last) zeroes the surface's
8px inset, and `.vacant`/`.outlined` (layer 6) beat `.pad-*` (layer 3). A `pad-*` on any
element that carries a surface class loses. This is the same trap pass 2 hit with
`max-h-*` under `.scroll-xy`, and the same answer: the surface wraps, the padding sits
inside. `className` and `...rest` stay on the outer `.slide` (the part's root).

## 3. One structural change inside `Carousel.svelte`

`measureIndicator()` currently measures the **dot button** (`dotEls[safeIndex]`). With
`size` on that button it would measure a 27px box and paint a 27px pill. It must
measure the `.dot` span inside the button, so the pill stays dot-sized (8px) while the
target grows to `size`. Concretely: `dotEls[i]` becomes the span, and the button keeps
no ref of its own. Nothing else in the drag/autoplay/keyboard logic moves.

## 4. Examples, one axis each, `actions/button` style

Coverage is a gate rule, and the gate is green today, so every new prop and every
literal-union value must appear. Content of 02 and 03 is kept; numbering shifts.

| file | axis | shows |
|---|---|---|
| `01-usage.svelte` | none | minimal: two slides, defaults only |
| `02-surfaces.svelte` | `surface` | all six on the slide frame: outlined, elevated, paneled, overlayed, glass, vacant |
| `03-shapes.svelte` | `shape` | rect, mincurved, modern, curved, round (fixture `surface="outlined"`, since vacant has no corner to round) |
| `04-sizes.svelte` | `size` | one carousel per step, h-md → h-xl, chrome measured against the same slide |
| `05-pad.svelte` | `pad` | pad-xs → pad-2xl, one carousel per step |
| `06-gap.svelte` | `gap` | the whole ladder incl. no gap (moved from `04-gaps.svelte`) |
| `07-text-size.svelte` | `textSize` | chrome ladder |
| `07a-child-text-size.svelte` | `childTextSize` | slide body ladder, chrome held still |
| `08-colour.svelte` | `textColor` | chrome ink ladder |
| `08a-child-colour.svelte` | `childTextColor` | slide body ink ladder |
| `09-align.svelte` | `alignContent` | all six dot-row placements |
| `10-per-view.svelte` | `perView` | 1, 2, 3 side by side |
| `11-autoplay-loop.svelte` | behaviour | current `02` (loop, autoplay, perView, bind:index) |
| `12-still.svelte` | behaviour | current `03` |
| `13-controlled.svelte` | behaviour | `label`, `bind:index`, `onIndexChange` driving a readout |

Also updated in the folder (not source logic): `doc.ts` description gains the surface /
shape / pad / size / text / align vocabulary, `comments.md` gains one JSDoc line per new
prop (the gate reads descriptions from there).

## 5. Where AGENTS.md and tokens.ts disagree (flagged, not fixed)

`tokens.ts` wins in every case below. I am not editing `AGENTS.md`; these are for the
doc owner.

1. **`soft`.** AGENTS §2 lists `Variant` as `primary secondary themed outline ghost link soft …`.
   `tokens.ts` `VARIANTS` has no `soft`, and AGENTS' own Variants block says "if you see
   soft or tint being used, it's incorrect". Self-contradiction; tokens wins.
2. **`sizeClass`.** AGENTS §2's authoring example imports `sizeClass` from
   `internal/tokens.js`. No `sizeClass` export exists in `tokens.ts` or `helpers.ts`.
   The real API is the class string itself (`h-lg`), as every component in the tree does.
3. **`Size` spelling.** AGENTS §2 writes `Size` as "`xs sm md lg xl`". Canonical
   values are prefixed: `h-xs … h-3xl` (8 rungs, not 5).
4. **`Gap` empty member.** `tokens.ts` `GAPS` starts with `''` (no gap). AGENTS' gap
   ladder omits it, so nothing in the doc explains a blank gap value, which is what
   accordion, tree and json-tree-view default to.
5. **Order-only drift.** `Variant` order (AGENTS: `… info danger success warning …` vs
   tokens: `… info success warning danger`) and `TextColor` order (AGENTS: `text-black`
   before `text-white`, `danger` before `neutral`; tokens the reverse). Same sets, so
   no behaviour change; worth aligning so examples read in the documented order.

None of this blocks carousel: it uses `Surface`, `Shape`, `Pad`, `Size`, `Gap`,
`TextSize`, `TextColor`, `ChildTextSize`, `ChildTextColor`, `AlignContent`, all of which
AGENTS and `tokens.ts` agree on.

## 6. Verification, when approved

- `pnpm verify data/carousel` if parse/lint/type-check pass.
- Live on `/components/data/carousel`, measured with probes, not eyeballed:
  root gap / pad / radius per `surface`+`shape`; `size` → nav button box and dot
  button box ≥ 24px and square; indicator height still equals the dot height;
  `pad` and `childTextSize` winning over their defaults; `gap` on all four rows.
- Screenshots before/after into `impasses/pass-3-carousel-shots/`.
- Out of scope and untouched: `tokens.ts`, `AGENTS.md`, carousel files until approval,
  accordion, collapsible, every sibling folder.
