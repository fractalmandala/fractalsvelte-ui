# Pass 3: `data/carousel` — implementation

Scope: `src/lib/components/data/carousel` only. `src/lib/internal/tokens.ts` and
`AGENTS.md` are untouched (their mtimes predate this session). Nothing committed.

## 1. What was built

### `Carousel.svelte` (root)

| prop | default | class it emits |
|---|---|---|
| `gap` | `'gap-md'` | root `box`, nav row, rail, dot row |
| `surface` | `'vacant'` | handed to the context; the slide frame paints it |
| `shape` | `'modern'` | indicator, plus the slide frame through `surfaceClasses`; handed to the context |
| `pad` | unset | handed to the context; the slide body paints it |
| `size` | `'h-lg'` | both nav `Button`s and every dot button |
| `textSize` | `'text-bs'` | root, and passed to both nav `Button`s |
| `textColor` | `'text-primary'` | root, and passed to both nav `Button`s |
| `childTextSize` | `'text-bs'` | handed to the context; the slide body paints it |
| `childTextColor` | `'text-primary'` | handed to the context; the slide body paints it |
| `alignContent` | `'xcenter'` | dot row, via `alignContentClasses` |

Root class: `['box', gap, textSize, textColor, className]` — no surface class on the
root, so `overflow-hidden` never clips the arrows.

Controls: nav `Button`s keep `variant="ghost"` and `class="btn-icon"`, take `{size}`,
and no longer receive a shape. Dot buttons are
`['bare', 'square', 'grid', 'center', 'focus-ring', size]`.

`measureIndicator()` now measures the `.dot` span. `dotEls[i]` is the span; the dot
button holds no ref. The pill stays dot-sized while the target grows.

### `CarouselSlide.svelte` (part)

Three nodes: the `.slide` root keeps `className` and `...rest`; the middle node carries
`['hfull', ...surfaceClasses(surface, shape)]` only; the inner node carries
`['box', 'hfull', pad, textSize, textColor]`. `surface`, `shape`, `pad`, `textSize`,
`textColor` are props and fall back to the context (`surface`, `shape`, `pad`,
`childTextSize`, `childTextColor`). `className` never lands on the surface node.

`carousel.svelte.ts` carries the five extra context fields; `comments.md` and `doc.ts`
carry the new vocabulary.

### Examples

`01-usage` (defaults only), `02-surfaces`, `03-shapes`, `04-sizes`, `05-pad`,
`06-gap`, `07-text-size`, `07a-child-text-size`, `08-colour`, `08a-child-colour`,
`09-align`, `10-per-view`, `11-autoplay-loop`, `12-still`, `13-controlled`.
The old `02-autoplay-loop` / `03-still` moved to 11 / 12; the old `04-gaps` became 06.

## 2. Did it match the approved brief

All eight decisions are implemented as stated. Four additions, each deliberate:

1. **Nav `Button`s also take `textSize` and `textColor`.** Decision 6 fixed `variant`,
   `class` and `size`; with the chrome reduced to two icon buttons and a dot row, those
   two props had no visible output at all, so `07-text-size` and `08-colour` would have
   shown nothing. Icons are `1em` and `currentColor`, so the chevrons now scale and take
   the ink. Measured: the h-xl arrow chevron is larger than h-md, and `text-danger`
   renders a red chevron.
2. **Dot buttons add `grid` + `center`** to `bare square focus-ring {size}`. Without
   them the dot's vertical centring relies on the button's UA layout; with them it is
   `place-items: center` and measured at exactly 12px inset inside 32px.
3. **The middle node adds `hfull`** (decision 4 named only `surfaceClasses`). Without it
   a short slide's frame does not reach the reel's stretched height. Measured: all three
   frames in `04-sizes` are the same height as their slides.
4. **`pad` fixtures** in `02-surfaces`, `03-shapes` and `05-pad` only, each commented.
   A surface with no inset shows text glued to the border, and a pad with no frame is
   invisible. `04-sizes` and `01-usage` carry no fixture, as instructed.

`06-gap` is a button-row switcher rather than nine stacked carousels, the same idiom as
`data/accordion` `03-gap`; the page would otherwise carry 40+ live carousels.

## 3. Measurements (live page, after)

`http://localhost:5173/components/data/carousel`, defaults (`01-usage`), 1280 wide:

| element | before | after |
|---|---|---|
| root gap | 8 | **12** |
| nav row gap | 8 | **12** |
| rail gap | 12 | 12 |
| dot row gap | 8 | **12** |
| nav button | 16 × 16 | **32 × 32** |
| dot button | 8 × 8 | **32 × 32** |
| dot span | 8 × 8 | 8 × 8 |
| indicator | 8 h, radius 6 | 8 h, radius 6, over the active dot (x 301 = dot x) |
| vacant slide radius | 0 | **0** |
| outlined + modern slide radius | — | **6** |
| slide frame padding | 0 | **0** (surface-tight) |
| slide body padding | 0 | **0** (pad unset) |
| dot offset inside its button | n/a | **12, 12** |

Size ladder (`04-sizes`): `h-md` 20×20, `h-bs` 27×27, `h-lg` 32×32, `h-xl` 40×40, all
square, dot 8 in each, indicator 8 in each.

Shape ladder (`03-shapes`, surface `outlined` fixture): rect 0, mincurved 3, modern 6,
curved 12, round 999px — on the slide frame; the indicator takes the same value.

Pad ladder (`05-pad`): frame padding 0 in every step, body padding 4 / 8 / 12 / 16 / 24 /
32 / 48.

At 360 (same page in a 360px viewport): nav and dot buttons still 32×32, dot 7.2 and
indicator 7.2 (the fluid text scale shrinks `text-bs`), gap 11.4 on all four rows. The
indicator's height equals the dot's at both widths.

Interactions, clicked in the real browser: next → `Lumen Health clinic, slide 2 of 2`,
indicator moved to dot 2; previous → back to slide 1; dot 1 → `aria-current="true"` on
dot 1 and the indicator back at x 301.

Per-slide override proven at runtime: a temporary `pad="pad-2xl"` on one `05-pad` slide
measured 48px on that body while the carousel's `pad-xs` held elsewhere. Reverted.

`pnpm verify data/carousel` → gen ✔ gate ✔ lint ✔ svelte-check ✔ passing.

Before/after: `impasses/pass-3-carousel-shots/` (light and dark, 1280 and 360).

## 4. Still open

- The docs preview stage sets `text-align: center` (`box xcenter`), so the default
  examples read centred. That is the docs shell, not the component; carousels placed in
  real content are left-aligned. Not touched (out of scope).
- `AGENTS.md` §2 still documents `sizeClass`, `Size` as `xs…xl`, and a `soft` variant.
  Plan §5 flagged this; the doc owner still needs to fix it. Untouched by instruction.
