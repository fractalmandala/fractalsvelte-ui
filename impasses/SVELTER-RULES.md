# Svelter rules

My own rulebook, written after getting the accordion wrong. Every rule below is
checked against a real file, with the line named. If a rule here and a rule in
my head disagree, this file wins.

Written 19 Nov 2026. Amend it whenever a mistake teaches something.

## Order of truth

1. `AGENTS.md` — the package law.
2. `src/lib/internal/tokens.ts` — the only vocabulary a component may speak.
3. `impasses/RULES.md` — cod's review rules.
4. This file.

Nothing I invent ranks above any of those four.

## Rule 1 — Every visual value comes from a type in `tokens.ts`

If a component needs a look, it takes a prop typed by a token union and emits the
class. It does not hardcode a class string, a pixel, a hex, or a `radius-*`.

Verified values (`src/lib/internal/tokens.ts`):

| Axis | Type | Values | Default |
| --- | --- | --- | --- |
| Shape | `Shape` | `rect` `mincurved` `modern` `curved` `round` | `modern` |
| Surface | `Surface` | `elevated` `outlined` `vacant` `overlayed` `paneled` `glass` | `outlined` |
| Size | `Size` | `h-xs` `h-sm` `h-md` `h-bs` `h-lg` `h-xl` `h-2xl` `h-3xl` | `h-lg` |
| Gap | `Gap` | `''` `gap-xs` `gap-sm` `gap-md` `gap-bs` `gap-lg` `gap-xl` `gap-2xl` `gap-3xl` | `gap-bs` |
| Pad | `Pad` | `pad-xs` `pad-sm` `pad-md` `pad-bs` `pad-lg` `pad-xl` `pad-2xl` | — |
| TextSize | `TextSize` | `text-xs` `text-sm` `text-md` `text-bs` `text-lg` `text-xl` `text-2xl` `text-3xl` | — |
| ChildTextSize | `ChildTextSize` | same eight | — |
| TextColor | `TextColor` | `text-primary` `text-secondary` `text-muted` `text-inverse` `text-white` `text-black` `text-neutral` `text-info` `text-success` `text-warning` `text-danger` | — |
| ChildTextColor | `ChildTextColor` | same eleven | — |
| Align | `Align` | `left` `center` `right` `between` | — |
| AlignContent | `AlignContent` | `xleft` `xcenter` `xright` `xbetween` `xcenter mleft` `xright mleft` | — |
| Measure | `Measure` | `measure-xs` … `measure-4xl` `measure-full` | — |
| Tone | `Tone` | `neutral` `info` `success` `warning` `danger` | — |
| Variant | `Variant` | `primary` `secondary` `themed` `outline` `ghost` `link` `info` `success` `warning` `danger` `neutral` | — |

Name drift to remember: AGENTS.md calls the shape `rounded`; the type calls it
`round`. The type is what the code takes. Do not "fix" one to match the other
without the user saying so.

## Rule 2 — Padding is a prop, not a class

A component that needs an inset takes `pad?: Pad` and emits it
(`layout/container`, `feedback/empty-state`, `display/card`, `inputs/fieldset`
already do). It never bakes `pad-xs` into a class string, and it never takes
padding from a borrowed class such as `.item`.

`.item` (`src/lib/styles/layers/component-props.css:118`) is a menu row. It
brings `padding: var(--space-xs) var(--space-sm)`, `border-radius: var(--radius-md)`,
a hover fill and a selected fill. Borrowing it for an accordion header means the
padding is not adjustable, the radius escapes `Shape`, and hover fills ignore the
group's corners. A header is its own thing.

## Rule 3 — Text takes the four text props

Any element that renders text takes `textSize` + `textColor`. A second, quieter
run of text inside the same component takes `childTextSize` + `childTextColor`.
Defaults come from the reason the text exists, not from a copy-paste.

## Rule 4 — `AlignContent` only bites inside a container class

Verified in `fractalstyler/src/lib/styles/containers.css:2-4`:

```
.box.xleft,   .column.xleft   { align-items: flex-start; text-align: left; }
.box.xcenter, .column.xcenter { align-items: center;     text-align: center; }
.box.xright,  .column.xright  { align-items: flex-end;   text-align: right; }
```

`xleft` and friends are scoped to `.box`, `.column`, `.row`, `.grid`. A bare
`xcenter` on a div does nothing. So any element that accepts `alignContent` must
also carry `box` or `column` in its class list. Check both, every time.

## Rule 5 — Never inherit alignment; set it

The docs preview stage is `box xcenter ycenter` (`src/docs-site/Example.svelte:60`),
and `xcenter` on a `.box` sets `text-align: center`. Everything inside inherits
it. That is why the accordion body came out centred for an hour: the trigger
carried `ta-l` and the panel carried nothing, so the panel inherited the stage.

A component sets its own alignment class. It never leaves text alignment to
whatever wraps it.

## Rule 6 — No `<style>` block, no new stylesheet rule for one component

AGENTS.md Law 1. The `style/block` gate rejects it. If a component needs a class
that does not exist, the answer is a shared layer fragment, not a local style.

## Rule 7 — `tokens.ts` is frozen

No edit to `tokens.ts` without the user approving it first. One fixed truth, or
the whole library drifts.

## Rule 8 — Examples are code, and they get reviewed like code

An example that shows a dead state is a bug. Six surfaces times a gap toggle
means checking which pairings mean anything. A hardcoded `disabled` on an item
whose content is a real answer teaches the wrong thing. `collapsible={false}` in a
demo teaches that the accordion will not close.

Every example: every prop it sets must earn its place, and every combination the
example offers must render something worth looking at.

## Rule 9 — "Verified" means I looked at it

A passing gate, a clean lint count and a green `check` are not verification. They
are prerequisites. Verification is: dev server up, the page open, the states
walked by hand, screenshots kept in `impasses/`, and the numbers measured in the
browser rather than read off the source.

If I did not look, I say "checks pass" and nothing more.

## Rule 10 — Plan, get it approved, then build, then report honestly

Plan goes to cod before an edit. The report says what was approved, what was
actually done, and where those differ. cod decides done, not me.

## Findings this file already records

Accordion, 19 Nov:

- `AccordionItem.svelte` borrows `.item` for the trigger and `pad-bs` for the
  panel, with no `pad`, `size`, `textSize`, `textColor`, `childTextSize`,
  `childTextColor`, `align` or `alignContent` prop on either part. Rule 2, 3, 5.
- `Accordion.svelte` has no `pad` prop, so no surface inset is adjustable. Rule 2.
- `examples/02-variants.svelte` sets `collapsible={false}` and a hardcoded
  `disabled` item, and offers `gap` against all six surfaces including `vacant`,
  which has no edge to move onto the items. Rule 8.
- `examples/02-variants.svelte` writes the same state twice: `bind:value` and
  `onValueChange`. Rule 8.
- The centred body was inheritance from the docs stage, not the component. Rule 5.
- `AlignContent` is declared in `tokens.ts` and used by zero components. When it
  goes in, it needs a `box` or `column` beside it. Rule 4.
