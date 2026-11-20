# Pass 4: `data/carousel` — indicator ink and dot padding

Two fixes from CoD's review. Nothing else touched. `src/lib/internal/tokens.ts`
mtime still 17 Nov 22:21. Nothing committed.

## 1. What changed, and where

| file | change |
|---|---|
| `src/lib/components/data/carousel/Carousel.svelte` | indicator drops `bg-panel`, gains `carousel-pip`; dot button gains `carousel-dot` |
| `src/lib/styles/layers/components-base.css` | two rules next to `.carousel-track`: `.carousel-pip { background-color: currentColor }` and `button.carousel-dot:not(.btn-icon) { padding: 0 }` |

Nothing else in the library references either class; no other `.indicator` in the
library was restyled (Tabs, Toc, NavigationMenu, SegmentedControl untouched).

Why this shape:

- **The pip covers the active dot exactly**, so its own colour is the only thing you
  see there. `bg-panel` lost that contest in both modes. `currentColor` inherits the
  dot row's ink, which is the carousel's `textColor` (`text-primary` by default), so
  the pip lands on the same colour the active dot already uses: bright in dark, dark in
  light. Inactive dots keep `text-muted`. Because it is `currentColor`, `textColor`
  props still re-point the pip, and it needs no mode-specific override.
- **`button.carousel-dot:not(.btn-icon)`** has the same specificity as
  `button.h-md:not(.btn-icon)` and sits later in the same layer, so it wins by order
  and zeroes all four paddings at every size. The dot button is not an icon button and
  did not want the icon-button class, hence the explicit hook.

## 2. Re-measured on the live page

`http://localhost:5173/components/data/carousel`, defaults (`01-usage`), 1280 wide.
Both modes toggled with the site's own theme button.

### Fix 1 — pip ink (light / dark)

| | light | dark |
|---|---|---|
| pip background | `oklch(0.18 0.012 34)` | `oklch(0.97 0.012 34)` |
| active dot colour | `oklch(0.18 0.012 34)` | `oklch(0.97 0.012 34)` |
| inactive dot colour | `oklch(0.58 0.012 34)` | `oklch(0.56 0.012 34)` |
| pip size | 8 × 8 | 8 × 8 |
| pip vs active dot offset | 0, 0 | 0, 0 |

After clicking next (slide 2 of 2), in dark: pip `translate` 345px 12px, pip x 790,
dot 2 x 790, offset 0,0, `aria-current="true"` on dot 2. So the pip is visible on the
active dot and it tracks.

### Fix 2 — dot button padding (identical in both modes)

| size | button | padding-inline | dot | dot inset |
|---|---|---|---|---|
| `h-md` | 20 × 20 | 0px (was 8px) | 8 × 8 | 6, 6 |
| `h-bs` | 27 × 27 | 0px | 8 × 8 | 9.5, 9.5 |
| `h-lg` | 32 × 32 | 0px | 8 × 8 | 12, 12 |
| `h-xl` | 40 × 40 | 0px | 8 × 8 | 16, 16 |

`h-md` content box is now 20 wide (padding 0, no border), and the 8px dot centres in it.

### Unchanged, re-measured

Root gap 12, nav row gap 12, rail gap 12, dot row gap 12. Arrows 32 × 32, padding 0.
Pad ladder on the inner body only: 4 / 8 / 12 / 16 / 24 / 32 / 48, frame padding 0 in
all seven. Slide frame radius: rect 0, mincurved 3, modern 6, curved 12, round 999,
arrows still the Button's own 6.

`pnpm verify data/carousel` → gen ✔ gate ✔ lint ✔ svelte-check ✔ passing.

Evidence: `impasses/pass-4-carousel-shots/` — `dots-light.png`, `dots-dark.png`
(6× crops of the dot row), `usage-light.png`, `usage-dark.png` (full viewport).

## 3. Still unverified

- Only 1280 wide was re-measured this pass; the 360 case was measured in pass 3 and
  nothing about it changed (the pip is still dot-sized, gaps still fluid).
- No regression sweep across the other 70 carousels on the page beyond the size ladder
  and the surface/shape/pad examples checked above.
