# DESIGN

The design language of fractalsvelte-ui. It is fractalstyler's language, held to a
premium bar — restrained, precise, quiet until touched.

## Principles

1. **Composition over invention.** A component is a sentence written in
   fractalstyler's vocabulary. If two components look related, it is because
   they share classes, not because someone matched them by eye.
2. **Hierarchy through ink, not size.** `text-primary` → `text-secondary` →
   `text-muted` carry most hierarchy. Size and weight change rarely.
3. **Hairlines and light.** Surfaces are separated by 1px borders
   (`border`, `border-subtle`) and lifted by the elevation ladder (`shad-*`)
   with a lit top edge (`rim`). Floating surfaces are `glass`.
4. **Motion is physics.** Anything a person moves or triggers is driven by a
   spring — the same solver produces the CSS `linear()` tokens
   (`--spring-snappy` …) and drives the JavaScript engine, so a CSS transition
   and a dragged element settle the same way. Motion is interruptible, never
   blocks input, and collapses to nothing under reduced motion.
5. **One theme, three numbers.** `--hue`, `--chroma`, `--tint` generate every
   colour role in both modes. Shape (`data-radius`), density (`data-density`)
   and motion (`data-motion`) are independent axes that rewrite ladders, not
   components.

## The shared axes

| Axis | Values | Mechanism |
|:---|:---|:---|
| `variant` | primary · secondary · themed · soft · outline · ghost · link · info · success · warning · danger | a class of the same name |
| `size` | xs · sm · md · lg · xl | `sizeClass[size]` → height + text ladder |
| `shape` | rect · mincurved · modern · curved · round | a class of the same name |
| `tone` | neutral · info · success · warning · danger | status colour roles |

## The extension layer

General primitives (tokens, springs, motion, surfaces, overlays, themes, shared
control parts) live in fractalstyler. This package keeps only kit fragments —
≤ 90 lines per kit, for primitives composition cannot express — at
`src/lib/styles/layers/components/<kit>.css`. `components.css` is the import
manifest; `pnpm gen` concatenates them into `custom.css`.
