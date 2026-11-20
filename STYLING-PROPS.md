# Styling props — @fractaldesign/fractalsvelte-ui

Every public component and part under `src/lib/components`, with the props that change how it looks or how it is laid out, and the default each one falls back to.

Generated from `src/lib/docs/generated/api.json` (the `pnpm gen` analysis of the component sources), cross-checked against the `$props()` defaults in each `.svelte` file — 190 defaults verified, no value differences. 124 components / 180 parts are covered; `pickers/date-field/internal/Segments.svelte` is internal wiring and has no public surface.

## How to read this

- **Styling props** — everything that maps to a fractalstyler class: visual axes (`variant`, `size`, `textSize`, `shape`, `tone`, `surface`, `level`), layout (`align`, `orientation`, `gap`, `columns`, `block`, `sticky`, `placement`), and appearance modifiers (`striped`, `framed`, `inset`, `glassOnScroll`, `attached`).
- **Motion props** — a second table per component, only where the component has any: timing, springs and animation presets. These change how it *moves*, not what it is.
- Not listed: data (`items`, `options`, `columns`, `value`), state (`open`, `checked`, `disabled`, `invalid`, `loading`), callbacks (`on*`), snippets (`children`, `trigger`, `footer`), refs, i18n and aria props.
- `—` in the default column means the prop is unset unless you pass it.
- Left out on purpose: props that switch a *state* rather than a style (`collapsed`, `maxItems`, `readonly`, `pressed`). They change pixels, but the look belongs to the state, not to you.
- Every component also takes `class` and forwards any remaining HTML attributes to its root element, so a one-off style never needs a new prop.

## The shared axes

One word means one thing across the library — a `shape` is the same `shape` on a button, an input, a card and a tag.

| Axis | Values | Props that take it |
| --- | --- | --- |
| `Variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` | `variant` |
| `Size` | `xs` · `sm` · `md` · `lg` · `xl` | `size`, `spacing`, `textSize` |
| `Shape` | `rect` · `mincurved` · `modern` · `curved` · `round` | `shape` |
| `Tone` | `neutral` · `info` · `success` · `warning` · `danger` | `tone` |
| `Orientation` | `horizontal` · `vertical` | `orientation` |
| `Placement` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` · `left` · `left-start` · `left-end` · `right` · `right-start` · `right-end` | `placement` |
| `Gap` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` | `gap` |
| `Align` | `left` · `center` · `right` · `between` | `align` |
| `Measure` | `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `4xl` · `full` | `width` |

Some components narrow an axis or own a vocabulary of their own, and the tables name it: `AvatarShape` and `AvatarSize` (an avatar is a picture scale), `Density` (table rows), `TableAlign`, `DrawerSide` (a drawer's placement), `Scrollbar`, `OverlaySurface`, and the theme set `ThemeRadius`, `ThemeDensity`, `ThemeMotion`. The look-and-form vocabularies are `TabsVariant`, `PaginationVariant`, `AccordionVariant` and `FieldLook`.

## Actions

### Button

`actions/button` — Triggers an action or navigates, with a spring-loaded press.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `primary` | The visual style. `primary` is the page's main action; use one per view. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `block` | flag | `false` | Stretches the button to the full width of its container. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `pressable` | flag | `true` | Springs the button down under the pointer. Turn off for a still button. |

### ButtonGroup

`actions/button-group` — Joins related buttons into one segmented control, or spaces them evenly.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | The direction the buttons run in. |
| `attached` | flag | `true` | Joins the buttons into one segmented control. When false, they sit apart with a small gap. |

### CopyButton

`actions/copy-button` — Copies text to the clipboard and confirms it with a spring-morphed check.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `ghost` | The visual style. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |

### IconButton

`actions/icon-button` — A square, icon-only button with a required accessible label.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `ghost` | The visual style. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height; the button is always square. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `pressable` | flag | `true` | Springs the button down under the pointer. Turn off for a still button. |

### Link

`actions/link` — A text link with three inks and a quiet, fading underline.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `theme` · `plain` · `subtle` | `theme` | The ink. `theme` is the accent colour, `plain` is the body ink that warms to the accent on hover, `subtle` is secondary ink that darkens on hover. |
| `underline` | `hover` · `always` · `none` | `hover` | When the underline shows. |

### SplitButton

`actions/split-button` — A primary action with an attached menu of related alternatives.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `primary` | The visual style of both halves. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the outer corners. |
| `placement` | `bottom-start` · `bottom-end` · `top-start` · `top-end` | `bottom-end` | Where the menu opens relative to the whole control. |

### Toggle

`actions/toggle` — A two-state button that stays pressed until pressed again.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `ghost` | The visual style when off. When on, subtle variants fill and every variant gains an inset ring. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `pressable` | flag | `true` | Springs the toggle down under the pointer. Turn off for a still toggle. |

### ToggleGroup

`actions/toggle-group` — A set of toggles where one or several can be on, with arrow-key navigation.

**ToggleGroup** `ToggleGroup.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `outline` | The visual style of every item. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height and text scale of every item. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale of every item, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of every item. |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | The direction items run in, and which arrow keys move focus. |
| `attached` | flag | `true` | Joins the items into one segmented control. When false they sit apart with a small gap. |

**ToggleGroupItem** `ToggleGroupItem.svelte` — no styling props.

### Toolbar

`actions/toolbar` — A group of controls with one tab stop and arrow-key movement, following the WAI-ARIA toolbar pattern.

**Toolbar** `Toolbar.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | The direction the controls run in, and which arrow keys move focus. |

**ToolbarSeparator** `ToolbarSeparator.svelte` — no styling props.

**ToolbarGroup** `ToolbarGroup.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `attached` | flag | `true` | Joins the controls into one segmented cluster. When false, they sit apart with a small gap. |

## Inputs

### Field

`inputs/field` — The form-field wrapper: a label, a control, helper text and an error, wired together for assistive technology.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `vertical` | Whether the label sits above the control or to its side. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The control height and text scale, inherited by the control inside unless it sets its own. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape, inherited by the control inside unless it sets its own. |
| `look` | `outline` · `filled` · `ghost` | — | The field look, inherited by the control inside unless it sets its own. |

### FileDrop

`inputs/file-drop` — A drag-and-drop zone with click-to-browse, a file list, and clear reasons when a file is rejected.

No styling props.

### Input

`inputs/input` — A single-line text input in a framed field, with icons, prefixes, suffixes and a clear button.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

### InputGroup

`inputs/input-group` — A field frame that holds an input with leading and trailing addons — text, icons or buttons.

**InputGroup** `InputGroup.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

**InputGroupAddon** `InputGroupAddon.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `align` | `start` · `end` | `start` | Whether the addon sits at the start or the end of the group. Visual order still follows source order. |

**InputGroupInput** `InputGroupInput.svelte` — no styling props.

**InputGroupText** `InputGroupText.svelte` — no styling props.

**InputGroupButton** `InputGroupButton.svelte` — no styling props.

### NativeSelect

`inputs/native-select` — A styled native select in the same field frame as Input, with options, optgroups and a chevron.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

### NumberInput

`inputs/number-input` — A numeric field with stepper buttons, keyboard and wheel adjustment, and optional formatted display.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

### PasswordInput

`inputs/password-input` — A password field with a reveal toggle, an optional strength meter, and a Caps Lock hint.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |
| `strength` | flag | `false` | Shows a strength meter under the field, scored from the length and the mix of character classes. |

### PinInput

`inputs/pin-input` — A row of cells for one-time codes and PINs, with paste distribution, auto-advance, and a spring pop as each cell fills.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `mask` | flag | `false` | Hides the characters, as a password field would. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The cell height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the cell height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of each cell. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered cell, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

### SearchInput

`inputs/search-input` — A search field with a leading icon, a clear button, a loading state, and an optional keyboard shortcut.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

### TagsInput

`inputs/tags-input` — A field of tokens: add a tag with Enter, a comma or paste, and remove it with Backspace or its × button.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |

### Textarea

`inputs/textarea` — A multi-line text field that can grow with its content, with a live character counter.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The text scale. The height follows the content and `rows`. `textSize` overrides this. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `look` | `outline` · `filled` · `ghost` | `outline` | `outline` is a bordered field, `filled` a tinted one without a border, `ghost` is bare until hovered or focused. |
| `counter` | flag | `false` | Shows a live character count under the field; with `maxlength` it reads `count / max`. |
| `resize` | `none` · `vertical` · `horizontal` · `both` | `vertical` | Which directions the user can drag-resize the field. Autosizing fields do not resize. |

## Selection

### Checkbox

`selection/checkbox` — A native checkbox with a label, a description and a check that springs in.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The box and text scale. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the box. Follows `size` when omitted. |

### ChipGroup

`selection/chip-group` — A set of filter chips for a single choice or any number of them, with optional icons and counts.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The chip height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the chip height. Follows `size` when omitted. |

### RadioGroup

`selection/radio-group` — A set of native radios with a bindable value, as plain rows or selectable cards.

**RadioGroup** `RadioGroup.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `vertical` | Lays the radios out in a column (`vertical`) or a wrapping row (`horizontal`). |
| `form` | `default` · `card` | `default` | `default` is a radio dot beside a label; `card` is a selectable bordered card with a title and description. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The radio and text scale. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale of every label, independent of the control. Follows `size` when omitted. |

**Radio** `Radio.svelte` — no styling props.

### Rating

`selection/rating` — A star rating the person can set, with half values, a custom icon and a hover preview.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The icon scale. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the stars. Follows `size` when omitted. |

### SegmentedControl

`selection/segmented-control` — A compact single choice among a short list of segments, with a spring-driven sliding indicator.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The segment height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the segment height. Follows `size` when omitted. |
| `block` | flag | `false` | Stretches the control to the full width of its container, with equal segments. |

### Slider

`selection/slider` — A single-value or range slider with pointer drag, full keyboard control and a springing thumb.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | Lays the track out left to right (`horizontal`) or bottom to top (`vertical`). |
| `marks` | `boolean \| { value: number; label?: string }[]` | `false` | Draws ticks: `true` for one per step, or a list of positions with optional labels. |
| `showValue` | flag | `false` | Shows the current value in a bubble above the thumb on hover, focus and drag. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The track thickness, thumb size and text scale. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the track. Follows `size` when omitted. |

### Switch

`selection/switch` — An on/off switch with a real sliding thumb that overshoots as it settles.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The track and text scale. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale of the label, independent of the control. Follows `size` when omitted. |
| `align` | `start` · `end` | `end` | Which side of the switch the label sits on. |

## Pickers

### Calendar

`pickers/calendar` — A month grid for picking a day, a range or several days, with locale-aware labels and full keyboard navigation.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `numberOfMonths` | number | `1` | How many months to show side by side. |

### ColorPicker

`pickers/color-picker` — A saturation-brightness area, hue slider and optional alpha slider for picking a CSS colour, in hex, rgb or oklch.

No styling props.

### Combobox

`pickers/combobox` — A searchable field with a filtered list of options, following the ARIA 1.2 combobox pattern.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### DateField

`pickers/date-field` — A segmented date field whose day, month and year are edited with the keyboard, in locale order.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### DatePicker

`pickers/date-picker` — A text field and a popover calendar for picking a single date, with typed parsing and optional presets.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### DateRangeField

`pickers/date-range-field` — Two segmented date fields in one frame, for typing a start and an end date in locale order.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### DateRangePicker

`pickers/date-range-picker` — A field that opens a two-month range calendar, with hover preview and optional presets.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### Select

`pickers/select` — A custom single or multiple choice list that opens from a field, with groups, icons and typeahead.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### TimeField

`pickers/time-field` — A segmented time field whose hour, minute and optional second are edited with the keyboard.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

### TimeRangeField

`pickers/time-range-field` — Two segmented time fields in one frame, for typing a start and an end time.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape of the field. |

## Overlays

### AlertDialog

`overlays/alert-dialog` — A confirmation dialog that requires a choice, with an imperative confirm() helper.

**AlertDialog** `AlertDialog.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `neutral` | The colour of the confirm action. |

**Confirmer** `Confirmer.svelte` — no styling props.

### CommandPalette

`overlays/command-palette` — A ⌘K command launcher on a modal dialog, with fuzzy ranking, highlighted matches and staggered results.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `surface` | `solid` · `glass` | `solid` | The panel fill: opaque, or frosted glass. |

### ContextMenu

`overlays/context-menu` — A menu that opens at the pointer on right-click, long-press or Shift+F10, using the same item parts as the dropdown menu.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `surface` | `solid` · `glass` | `glass` | The menu fill: frosted glass, or opaque. |

### Dialog

`overlays/dialog` — A modal dialog on the native <dialog> element, with a spring pop and a blurred backdrop.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `width` | `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `4xl` · `full` <br>*shared axis* | `md` | The width, on the measure ladder. `full` fills the viewport less a margin. |
| `surface` | `solid` · `glass` | `solid` | The panel fill: opaque, or frosted glass. |

### Drawer

`overlays/drawer` — An edge-docked sheet on a native <dialog>, with a drag-to-dismiss handle on the bottom edge.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `placement` | `left` · `right` · `top` · `bottom` | `right` | The edge the drawer is docked to, as a placement. |
| `width` | `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `4xl` · `full` <br>*shared axis* | `md` | The width (left or right) or height (top or bottom), on the measure ladder. `full` fills the viewport. |
| `surface` | `solid` · `glass` | `solid` | The panel fill: opaque, or frosted glass. |

### DropdownMenu

`overlays/dropdown-menu` — A menu button with roving focus, typeahead and nested submenus, on the Popover API.

**DropdownMenu** `DropdownMenu.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `placement` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` · `left` · `left-start` · `left-end` · `right` · `right-start` · `right-end` <br>*shared axis* | `bottom-start` | Where the menu sits relative to the trigger. |
| `surface` | `solid` · `glass` | `glass` | The menu fill: frosted glass, or opaque. |

**MenuItem** `MenuItem.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `inset` | flag | `false` | Indent the label to line up with items that have an icon. |

**MenuCheckboxItem** `MenuCheckboxItem.svelte` — no styling props.

**MenuRadioGroup** `MenuRadioGroup.svelte` — no styling props.

**MenuRadioItem** `MenuRadioItem.svelte` — no styling props.

**MenuLabel** `MenuLabel.svelte` — no styling props.

**MenuSeparator** `MenuSeparator.svelte` — no styling props.

**MenuSub** `MenuSub.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `surface` | `solid` · `glass` | `glass` | The submenu fill: frosted glass, or opaque. |

### HoverCard

`overlays/hover-card` — A rich preview card on hover or focus of a link, with time to travel from the trigger to the card.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `placement` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` · `left` · `left-start` · `left-end` · `right` · `right-start` · `right-end` <br>*shared axis* | `bottom` | Where the card sits relative to the trigger. |
| `surface` | `solid` · `glass` | `glass` | The card fill: frosted glass, or opaque. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `openDelay` | number | `300` | How long to wait, in milliseconds, before opening on hover or focus. |
| `closeDelay` | number | `200` | How long to wait, in milliseconds, before closing after the pointer or focus leaves — long enough to travel onto the card. |

### Menubar

`overlays/menubar` — A persistent application menu bar with the WAI-ARIA menubar pattern, on the Popover API.

**Menubar** `Menubar.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `surface` | `solid` · `glass` | `glass` | The fill of every menu panel, unless a menu overrides it. |

**MenubarMenu** `MenubarMenu.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `surface` | `solid` · `glass` | — | The fill of this menu panel. Falls back to the menubar's `surface`. |

### Popover

`overlays/popover` — An anchored non-modal panel on the Popover API, placed with CSS anchor positioning.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `placement` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` · `left` · `left-start` · `left-end` · `right` · `right-start` · `right-end` <br>*shared axis* | `bottom` | Where the panel sits relative to the trigger. |
| `offset` | string | `var(--space-sm)` | The gap between the trigger and the panel, as a CSS length. |
| `matchWidth` | flag | `false` | Stretch the panel to the trigger's width. |
| `surface` | `solid` · `glass` | `glass` | The panel fill: frosted glass, or opaque. |

### Tooltip

`overlays/tooltip` — A short hint on hover or focus, using popover="hint" and a shared warm group.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `placement` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` · `left` · `left-start` · `left-end` · `right` · `right-start` · `right-end` <br>*shared axis* | `top` | Where the hint sits relative to the trigger. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `delay` | number | `300` | How long to wait, in milliseconds, before opening on hover or focus. Adjacent tooltips skip this while the group is warm. |
| `closeDelay` | number | `100` | How long to wait, in milliseconds, before closing after hover or focus leaves. |

## Navigation

### BackToTop

`navigation/back-to-top` — A floating button that appears after a scroll threshold, with a scroll-progress ring around it.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height; the button is always square. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `threshold` | number | `320` | How far the page must be scrolled, in pixels, before the button appears. |

### Breadcrumbs

`navigation/breadcrumbs` — A trail of links from the site root to the current page, with an optional collapsing ellipsis.

No styling props.

### Dock

`navigation/dock` — A macOS-style dock whose items magnify by pointer proximity, driven by springs.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | Lays the dock out along the bottom or along the start edge. |

### Navbar

`navigation/navbar` — A top app bar with a brand, links and actions, glass on scroll, and a small-screen menu.

**Navbar** `Navbar.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `sticky` | flag | `true` | Pins the bar to the top of the viewport as the page scrolls. |
| `glassOnScroll` | flag | `true` | Adds a glass surface once the page has been scrolled. |

**NavbarLink** `NavbarLink.svelte` — no styling props.

### NavigationMenu

`navigation/navigation-menu` — A site navigation with delayed flyout panels, a sliding indicator, and a viewport that springs between sizes.

**NavigationMenu** `NavigationMenu.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | Lays the list out in a row or a column, and places the viewport beside it. |
| `surface` | `solid` · `glass` | `glass` | The fill of the shared viewport. |

**NavigationMenuItem** `NavigationMenuItem.svelte` — no styling props.

**NavigationMenuContent** `NavigationMenuContent.svelte` — no styling props.

**NavigationMenuLink** `NavigationMenuLink.svelte` — no styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `delayDuration` | number | `200` | How long to wait, in milliseconds, before opening a panel on hover. |
| `skipDelayDuration` | number | `300` | How long, in milliseconds, the menu stays warm after a panel opens, so the next trigger opens instantly. |

### Pagination

`navigation/pagination` — Moves through a long list a page at a time, as buttons or as real links.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `siblings` | number | `1` | How many page numbers to show on each side of the current page. |
| `boundaries` | number | `1` | How many page numbers to keep at each end of the range. |
| `form` | `numbers` · `simple` · `compact` | `numbers` | `numbers` shows a range of pages; `simple` shows the position in words; `compact` shows only the current page. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height. Text follows this unless `textSize` is set. |
| `textSize` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | — | The text scale, independent of the control height. Follows `size` when omitted. |

### SidebarNav

`navigation/sidebar-nav` — A vertical navigation tree with groups, badges and an icon-only rail that springs to width.

No styling props.

### Stepper

`navigation/stepper` — A sequence of steps, with a connector that fills as each one is completed.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | Lays the steps out in a row or a column. |

### Tabs

`navigation/tabs` — A tabbed view with a spring-driven sliding indicator and the WAI-ARIA tabs pattern.

**Tabs** `Tabs.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | Lays the tab list out in a row or a column. |
| `form` | `underline` · `pill` · `enclosed` | `underline` | Visual style: a sliding rule, a sliding pill, or a contained switcher. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height and text scale of each tab. |

**TabList** `TabList.svelte` — no styling props.

**Tab** `Tab.svelte` — no styling props.

**TabPanel** `TabPanel.svelte` — no styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `animated` | flag | `false` | Transitions panels in and out with a spring fade. |

### Toc

`navigation/toc` — A table of contents with a scroll-spy and a spring-driven marker beside the active heading.

No styling props.

## Feedback

### Alert

`feedback/alert` — An inline message that tells people something about the page they are on.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `info` | The meaning of the message. `danger` and `warning` are announced assertively; the rest politely. |
| `look` | `soft` · `outline` · `solid` | `soft` | The fill style: a tinted `soft` fill, a hairline `outline`, or a full-strength `solid` fill. |

### Banner

`feedback/banner` — A full-width announcement for the page or the site, optionally pinned and remembered when dismissed.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `info` | The meaning of the announcement. `danger` and `warning` are announced assertively; the rest politely. |
| `sticky` | flag | `false` | Pins the banner to the top of the scrollport as the page moves. |

### EmptyState

`feedback/empty-state` — A centred placeholder for a view that has nothing to show yet, with an optional next step.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The scale of the type, icon and padding. |
| `frame` | `none` · `bordered` · `dashed` | `none` | An optional frame around the block: a hairline, or a dashed one. |

### Meter

`feedback/meter` — A gauge for a value on a known range, with optional low, high and optimum thresholds.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `low` | number | — | The upper edge of the low region, used with `high` and `optimum` to pick a tone. |
| `high` | number | — | The lower edge of the high region, used with `low` and `optimum` to pick a tone. |
| `optimum` | number | — | The best value on the range. Defaults to the midpoint. |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | — | Forces a tone, instead of the one picked from the low / high / optimum regions. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The thickness of a linear track, or the diameter of a ring, scaled with the text size. |
| `form` | `linear` · `ring` | `linear` | `linear` is a bar; `ring` is a circular gauge with a label in the centre. |
| `thickness` | `sm` · `md` · `lg` | `md` | The stroke thickness of a ring, expressed through the text scale the ring already uses. |
| `striped` | flag | `false` | Draws diagonal stripes across a linear fill. |
| `showValue` | flag | `false` | Shows the numeric value to the right of the label, in tabular numerals. |

### Skeleton

`feedback/skeleton` — A placeholder for content that has not loaded yet, shaped as text, a circle or a rectangle.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `form` | `text` · `circle` · `rect` | `text` | The placeholder shape: lines of text, a circle, or a rectangle. |
| `lines` | number | `3` | How many lines to draw when `form` is `text`. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `animate` | `shimmer` · `pulse` · `none` | `shimmer` | The loading animation. `none` is a still placeholder. |

### Spinner

`feedback/spinner` — A compact indicator that work is underway, as a ring, a row of dots, or a row of bars.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `form` | `ring` · `dots` · `bars` | `ring` | The visual style of the spinner. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The size of the spinner. |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `neutral` | The colour of the spinner. |

### Status

`feedback/status` — A status dot with a label, for things like "Operational" or "Degraded".

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `success` | The meaning of the status. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The size of the dot and the label. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `pulse` | flag | `false` | Draws a pinging halo around the dot, for a live or degraded state. |

### Toast

`feedback/toast` — An imperative notification, stacked in a pile at the edge of the viewport.

**Toast** `Toast.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` · `loading` | `neutral` | The meaning of the toast. `danger` and `warning` are announced assertively; the rest politely. |

**Toaster** `Toaster.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `position` | `top` · `top-start` · `top-end` · `bottom` · `bottom-start` · `bottom-end` | `top-end` | Where the pile sits in the viewport. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `duration` | number | `4000` | Default auto-dismiss time, in milliseconds. `0` keeps toasts until they are dismissed. Overridden per toast. |

## Display

### Avatar

`display/avatar` — A portrait that falls back from an image to initials, then to an icon, with an optional status dot.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `lg` · `xl` | — | The avatar's size. Inherited from an enclosing `AvatarGroup` when omitted. |
| `shape` | `circle` · `rounded` · `square` | `circle` | The corner treatment: a circle, a rounded square, or a square. Inherited from an enclosing `AvatarGroup` when omitted. |
| `status` | `online` · `away` · `busy` · `offline` | — | A presence indicator at the bottom-right corner. |

### AvatarGroup

`display/avatar-group` — An overlapped stack of avatars, with a "+N" overflow and a spring that spreads the stack on hover.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `lg` · `xl` | `md` | The size of every member, including the overflow tile. |
| `shape` | `circle` · `rounded` · `square` | `circle` | The corner treatment applied to every member and the overflow tile. |
| `spread` | flag | `true` | Springs the stack apart on hover. Turn off for a still group. |

### Card

`display/card` — The content surface: a padded container with five treatments and an optional spring lift.

**Card** `Card.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `elevated` · `outline` · `filled` · `ghost` · `glass` | `elevated` | The surface treatment: `elevated` is raised with a lit edge, `outline` is a hairline, `filled` is a quiet panel, `ghost` has no surface until hovered, `glass` blurs what is behind it. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The padding and the gap between parts, and the type scale of the parts. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `interactive` | flag | `false` | Makes the whole card a target: it lifts on hover, shows a focus ring and, without `href`, becomes a focusable article that activates on Enter and Space. |
| `tilt` | flag | `false` | Tilts the card in 3D toward the pointer. Replaces the hover lift. |

**CardHeader** `CardHeader.svelte` — no styling props.

**CardTitle** `CardTitle.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `level` | `1` · `2` · `3` · `4` · `5` · `6` | `3` | The heading level, 1 to 6. Pick the one that fits the page outline. |

**CardDescription** `CardDescription.svelte` — no styling props.

**CardContent** `CardContent.svelte` — no styling props.

**CardFooter** `CardFooter.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `align` | `left` · `center` · `right` · `between` <br>*shared axis* | `left` | Where the footer's items sit along the row. |

**CardMedia** `CardMedia.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `ratio` | `16/9` · `4/3` · `3/2` · `1/1` | — | Crops the media to an aspect ratio. Without it the image keeps its own. |

### Code

`display/code` — A highlighted code block with a copy button, or a short inline snippet.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `showLineNumbers` | flag | `false` | Draws a gutter of line numbers. |
| `highlightLines` | `number[] \| string` | — | 1-based line numbers to mark, or a string such as "3-5,8". |
| `wrap` | flag | `false` | Soft-wraps long lines instead of scrolling horizontally. |
| `maxHeight` | `Size \| string` | — | Caps the height and scrolls the rest: a ladder word (`lg`) or any CSS length (`24rem`). |
| `form` | `block` · `inline` | `block` | `block` is a highlighted panel with a copy button; `inline` is a short snippet in running text. |

### DescriptionList

`display/description-list` — A list of term and definition pairs, laid out as a stack or as aligned rows.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `vertical` | `vertical` stacks the term over the definition; `horizontal` places them on one row. |
| `columns` | `1` · `2` · `3` · `4` | `1` | How many columns of pairs to lay out. |
| `dividers` | flag | `false` | Draws a hairline between pairs. |

### Item

`display/item` — A list or row item with leading media, a title, a description and trailing actions.

**Item** `Item.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `default` · `outline` · `muted` | `default` | `default` is a quiet row, `outline` is a hairline box, `muted` is a tinted panel. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The padding and the type scale of the title. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |
| `interactive` | flag | `false` | Makes the whole row a target: a hover fill, a keyboard focus ring and, without `href`, a focusable row that activates on Enter and Space. |

**ItemMedia** `ItemMedia.svelte` — no styling props.

**ItemContent** `ItemContent.svelte` — no styling props.

**ItemTitle** `ItemTitle.svelte` — no styling props.

**ItemDescription** `ItemDescription.svelte` — no styling props.

**ItemActions** `ItemActions.svelte` — no styling props.

**ItemGroup** `ItemGroup.svelte` — no styling props.

**ItemSeparator** `ItemSeparator.svelte` — no styling props.

### Stat

`display/stat` — A KPI block: a label, a tabular figure, an optional delta, and a quiet hint.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `trend` | `up` · `down` · `flat` | — | The trend direction. Inferred from the sign of `delta` when omitted. |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | — | The colour of the delta. Inferred from the trend when omitted. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `countUp` | flag | `false` | Springs the numeric value from zero when the stat first scrolls into view. |

### Timeline

`display/timeline` — A vertical list of events on a rail, with staggered spring reveals.

**Timeline** `Timeline.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `align` | `left` · `right` | `left` | Which side of the rail the bodies sit on. |

**TimelineItem** `TimelineItem.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | — | Colour of the rail marker. |

## Primitives

### AspectFrame

`primitives/aspect-frame` — A box of fixed proportion that holds media and clips it to its shape.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `ratio` | `16-9` · `9-16` · `4-3` · `3-4` · `3-2` · `2-3` · `1-1` | `16-9` | The width-to-height proportion of the frame. |
| `fit` | `cover` · `contain` · `fill` · `scale-down` | `cover` | How the media inside fits the frame: cover crops, contain letterboxes, fill stretches, scale-down never enlarges. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. The frame clips its media to the shape. |

### Badge

`primitives/badge` — A small status or count label on the shared variant and shape axes.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `soft` | The visual style, from the shared variant axis. `soft` is the quiet default. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `bs` | The label height. Text follows this unless `textSize` is set. |
| `textSize` | `sm` · `md` · `lg` | — | The text scale, independent of the badge height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. Pills are the default. |
| `dot` | flag | `false` | Draws a small dot in the current ink before the label, for live or status state. |

### Divider

`primitives/divider` — A hairline rule that separates content, optionally labelled, horizontal or vertical.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | The direction of the rule. A vertical divider sits in a row and stretches to the row's height. |
| `look` | `solid` · `dashed` · `subtle` · `strong` | `solid` | The line style: solid, dashed, a faint hairline or a strong rule. |
| `spacing` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `md` | The space on either side of the rule, from the shared size ladder. |

### Kbd

`primitives/kbd` — Draws keyboard keys as key caps, with mod resolved to ⌘ or Ctrl by platform.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `md` | The key cap height. Text follows this unless `textSize` is set. |
| `textSize` | `sm` · `md` · `lg` | — | The text scale, independent of the cap height. Follows `size` when omitted. |

### Label

`primitives/label` — A form label that names its control, with required and optional markers.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `sm` | The label scale: text size. |

### Tag

`primitives/tag` — A token that labels, filters or links, with an optional remove control.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary` · `secondary` · `themed` · `outline` · `ghost` · `link` · `soft` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `soft` | The visual style, from the shared variant axis. `soft` is the quiet default. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `bs` | The token height. Text follows this unless `textSize` is set. |
| `textSize` | `sm` · `md` · `lg` | — | The text scale, independent of the tag height. Follows `size` when omitted. |
| `shape` | `rect` · `mincurved` · `modern` · `curved` · `round` <br>*shared axis* | `modern` | The corner shape. |

### Typography

`primitives/typography` — Thin wrappers around fractalstyler's type scale: headings, lead and muted text, quotes, lists and inline code.

**Typography** `Typography.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `align` | `left` · `center` · `right` | `center` | `center` is a centred reading measure; `left` and `right` pin it to that edge. |

**Heading** `Heading.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `level` | `1` · `2` · `3` · `4` | `2` | The heading level, 1 to 4. Pick the one that fits the page outline. |

**Text** `Text.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `body` · `lead` · `muted` · `large` · `small` | `body` | `body` is running copy, `lead` is the opening paragraph, `muted` is secondary, `large` and `small` change the scale. |

**Blockquote** `Blockquote.svelte` — no styling props.

**List** `List.svelte` — no styling props.

**InlineCode** `InlineCode.svelte` — no styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `scale` | `1` · `2` · `3` · `4` | — | The visual scale, 1 to 4. Follows `level` when omitted. |

### VisuallyHidden

`primitives/visually-hidden` — Content that only screen readers hear, with an optional reveal on focus.

No styling props.

## Data

### Accordion

`data/accordion` — A group of disclosures that open with a spring height, one or many at a time.

**Accordion** `Accordion.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `separated` · `contained` · `flush` | `contained` | How items are grouped: separate cards, one contained panel, or a flush stack. |

**AccordionItem** `AccordionItem.svelte` — no styling props.

### Carousel

`data/carousel` — A scroll-snap carousel with autoplay, drag, and a spring-loaded indicator.

**Carousel** `Carousel.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `perView` | number | `1` | How many slides are visible at once. |
| `gap` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `md` | The gap between slides. |

**CarouselSlide** `CarouselSlide.svelte` — no styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `loop` | flag | `false` | When true, next and previous wrap around the ends. |
| `autoplay` | `boolean \| number` | `false` | Auto-advance. Pass `true` for 5s, or an interval in milliseconds. Pauses on hover, focus and reduced motion. |

### Collapsible

`data/collapsible` — A single disclosure whose panel opens and closes with a spring height.

No styling props.

### DataTable

`data/data-table` — A data grid with client-side sort, filter, selection, pagination and expandable rows.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `striped` | flag | `false` | Shades every other body row. |
| `hoverable` | flag | `true` | Lights a body row under the pointer. |
| `density` | `compact` · `cozy` · `comfortable` | `cozy` | Row density, on the shared ladder: `compact` · `cozy` · `comfortable`. |
| `stickyHeader` | flag | `false` | Keeps the header row in view while the body scrolls. Pair it with `maxHeight`. |
| `maxHeight` | `Size \| string` | — | Caps the height and scrolls the body: a ladder word (`lg`) or any CSS length (`24rem`). |
| `framed` | flag | `true` | Draws the hairline frame and surface fill around the table. |

### Table

`data/table` — A presentational table of records with quiet headers, hairline rows and aligned numerals.

**Table** `Table.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `striped` | flag | `false` | Shades every other body row. |
| `hoverable` | flag | `true` | Lights a body row under the pointer. Turn off for dense reference tables. |
| `density` | `compact` · `cozy` · `comfortable` | `cozy` | Row density, on the shared ladder: `compact` · `cozy` · `comfortable`. |
| `stickyHeader` | flag | `false` | Keeps the header row in view while the body scrolls. Pair it with `maxHeight`. |
| `maxHeight` | `Size \| string` | — | Caps the height and scrolls the body: a ladder word (`lg`) or any CSS length (`24rem`). |
| `framed` | flag | `true` | Draws the hairline frame and surface fill around the table. |

**TableHead** `TableHead.svelte` — no styling props.

**TableBody** `TableBody.svelte` — no styling props.

**TableRow** `TableRow.svelte` — no styling props.

**TableHeader** `TableHeader.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `align` | `left` · `center` · `right` | — | Horizontal alignment of the header text. Match it to the column's cells. |
| `numeric` | flag | `false` | A numeric column: right-aligned, so it lines up with `numeric` cells. |
| `width` | string | — | A fixed column width (any CSS length, e.g. `8rem` or `20%`). |

**TableCell** `TableCell.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `align` | `left` · `center` · `right` | — | Horizontal alignment of the content. |
| `numeric` | flag | `false` | A number: right-aligned with tabular numerals, so digits line up down the column. |
| `muted` | flag | `false` | Secondary ink, for supporting values (dates, ids, units). |

**TableCaption** `TableCaption.svelte` — no styling props.

### Tree

`data/tree` — A hierarchical tree view with keyboard navigation, lazy children and optional checkboxes.

No styling props.

### VirtualList

`data/virtual-list` — A windowed list that keeps 10,000+ rows scrolling smoothly, with an imperative scrollToIndex.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `itemHeight` | `number \| ((index: number, item: T) => number)` | — | Fixed row height in pixels, or a function that estimates a row before it is measured. |
| `height` | `number \| string` | `320` | Viewport height, as a number of pixels or any CSS length. |

## Layout

### BentoGrid

`layout/bento-grid` — A dense, staggered bento grid whose items can span columns and rows, and collapse to one column on small screens.

**BentoGrid** `BentoGrid.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `columns` | number | `4` | How many columns the grid has. Collapses to one column when the container is narrower than the md measure. |
| `gap` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `md` | The gap between tiles. |
| `rowHeight` | string | `8rem` | The height of one grid row, as a CSS length. Items with `rowSpan` occupy this many rows. |

**BentoItem** `BentoItem.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `colSpan` | number | `1` | How many columns this item spans. |
| `rowSpan` | number | `1` | How many rows this item spans. |
| `featured` | flag | `false` | Marks the item as a featured tile, with a raised surface. |
| `lift` | flag | `false` | Lifts the item on hover with a spring. |

### Container

`layout/container` — A page container on the measure ladder, optionally padded and centred in its parent.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `width` | `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `4xl` · `full` <br>*shared axis* | `lg` | The maximum width, from the measure ladder. `full` fills the parent. |
| `padded` | flag | `false` | Adds padding from the space ladder on all sides. |
| `center` | flag | `false` | Centres the container in its parent. |

### Masonry

`layout/masonry` — A balanced masonry of uneven items, using CSS grid masonry where it is supported and a shortest-column packer everywhere else.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `columns` | `number \| MasonryColumns` | `3` | How many columns to use, or a map resolved from the element's width against the system's `--bp-*` breakpoints. |
| `gap` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `md` | The gap between columns and stacked items. |

### Resizable

`layout/resizable` — Split panes that resize by dragging or keyboard, with collapsible panes that spring open and shut.

**Resizable** `Resizable.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `horizontal` · `vertical` <br>*shared axis* | `horizontal` | The direction panes are laid out: `horizontal` puts them side by side, `vertical` stacks them. |

**ResizablePane** `ResizablePane.svelte` — no styling props.

**ResizableHandle** `ResizableHandle.svelte`

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `withGrip` | flag | `false` | Draws a small grip on the handle so it reads as draggable. |

### ScrollArea

`layout/scroll-area` — A keyboard-focusable scroll region with thin themed scrollbars and edge fades that appear only when there is more to scroll.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `vertical` · `horizontal` · `both` <br>*shared axis* | `vertical` | Which axes can scroll. |
| `maxHeight` | `Size \| string` | — | Caps the height of the region: a ladder word (`lg`) or any CSS length (`24rem`). |
| `scrollbar` | `auto` · `hover` · `hidden` | `auto` | When the scrollbar is shown: always when there is overflow, on hover and focus, or never. |

### StickyBar

`layout/sticky-bar` — A bar that sticks to the top or bottom of its scroll container and gains glass and elevation only while stuck.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `position` | `top` · `bottom` | `top` | Which edge of the scroll container the bar sticks to. |
| `offset` | string | `0px` | How far the stuck bar sits from that edge, as a CSS length. |

## Motion

### AnimatedList

`motion/animated-list` — A list whose items spring in, out and into their new positions as the data changes.

No styling props.

### Draggable

`motion/draggable` — A spring-dragged element, with optional bounds, a handle, and keyboard movement.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `axis` | `x` · `y` · `both` | `both` | The axis the element can be dragged along. |
| `snapBack` | flag | `false` | When true, the element springs back to its rest position on release. |
| `momentum` | flag | `true` | When true, release velocity carries the element on before it settles. |
| `elastic` | number | `0.35` | How far the element may rubber-band past a bound, from 0 to 1. |
| `spring` | `SpringInput` | `snappy` | The spring used on release and for keyboard movement. |

### Magnetic

`motion/magnetic` — Pulls its child toward the pointer, then springs it back.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `strength` | number | `0.35` | How strongly the element is pulled toward the pointer, from 0 to 1. |
| `radius` | number | `40` | How far beyond the element's bounds the pointer still attracts it, in pixels. |
| `spring` | `SpringInput` | `snappy` | The spring used to pull and to return. |

### Marquee

`motion/marquee` — An infinite scrolling strip of content, with edge fades, pause on hover, and a static fallback under reduced motion.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `gap` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The space between items, and between one copy of the content and the next — a step on the space ladder. |
| `fade` | flag | `false` | Fades the two edges the content enters and leaves through. |
| `repeat` | number | `2` | How many copies of the content the track holds (at least 2). Raise it when the content is much shorter than the strip. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `direction` | `left` · `right` · `up` · `down` | `left` | Which way the content travels. `up` and `down` need a container with a height. |
| `speed` | number | `48` | Travel speed in pixels per second. The loop length is measured, so a long strip and a short one move at the same pace. |

### Motion

`motion/motion` — A declarative spring element: states layer and animate() springs between them.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `initial` | `MotionValues` | — | The starting motion values, applied instantly before the first spring. |
| `animate` | `MotionValues` | — | The resting motion values. Reactive: a change springs from the current position, keeping velocity. |
| `whileHover` | `MotionValues` | — | Motion values applied while the pointer hovers the element. |
| `whilePress` | `MotionValues` | — | Motion values applied while the element is pressed, by pointer or by Enter/Space. |
| `whileFocus` | `MotionValues` | — | Motion values applied while the element or a descendant has focus. |
| `whileInView` | `MotionValues` | — | Motion values applied while the element is in view. When set, the element stays at `initial` until it enters the viewport. |
| `spring` | `SpringInput` | `snappy` | The spring used for every state change. |
| `delay` | number | `0` | Delay in milliseconds before the first spring (and before `whileInView` enters). Hover, press and focus are immediate. |

### NumberTicker

`motion/number-ticker` — A number that springs from zero to its value, as a count or as rolling digit columns.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `form` | `count` · `slot` | `count` | `count` writes the formatted number; `slot` rolls each digit in its own column. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `startOnView` | flag | `false` | Waits until the ticker is in view before springing from zero to `value`. |

### PageTransition

`motion/page-transition` — Declarative route transitions for SvelteKit, with a keyed spring fallback when view transitions are unavailable.

No styling props.

### Parallax

`motion/parallax` — A scroll-linked offset layer, with a group for stacking a scene at several speeds.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `speed` | number | `0.2` | How strongly the layer lags the scroll (positive) or leads it (negative). Typical range is -1 to 1. |
| `axis` | `x` · `y` | `y` | The axis of travel. |

### Presence

`motion/presence` — Mounts and unmounts children with spring enter and exit transitions.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `enter` | `fade` · `scale` · `fly-up` · `fly-down` · `fly-left` · `fly-right` · `blur` · `slide` | `fade` | The enter transition, built on the matching `spring*` function. |
| `exit` | `fade` · `scale` · `fly-up` · `fly-down` · `fly-left` · `fly-right` · `blur` · `slide` | `fade` | The exit transition, built on the matching `spring*` function. |
| `spring` | `SpringInput` | `snappy` | The spring driving enter and exit. |
| `mode` | `sync` · `wait` | `sync` | How a keyed swap plays: `sync` crosses the exit with the enter, `wait` finishes the exit first. |

### Reorder

`motion/reorder` — A drag-to-reorder list whose siblings make room with FLIP springs.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `axis` | `x` · `y` | `y` | The axis items can be dragged along. |

### Reveal

`motion/reveal` — Springs its contents in when they scroll into view.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `from` | `up` · `down` · `left` · `right` | `up` | The side the element springs in from. |
| `distance` | number | `24` | How far the element starts from rest, in pixels. |
| `scale` | number | `1` | The starting scale. `1` leaves scale unchanged. |
| `blur` | number | `0` | The starting blur, in pixels. `0` leaves the image sharp. |
| `delay` | number | `0` | Delay in milliseconds after the element enters the viewport. |
| `once` | flag | `true` | When true, the entrance plays once and does not reverse on leave. |
| `amount` | number | `0.2` | Visible fraction of the element that counts as in view. |
| `spring` | `SpringInput` | `gentle` | The spring used for the entrance (and the exit, when `once` is false). |

### ScrollProgress

`motion/scroll-progress` — A reading-progress bar or ring, bound to the page or to an element as it passes through the viewport.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `form` | `bar` · `ring` | `bar` | A bar along the edge of the viewport, or a ring that fills with the same progress. |
| `position` | `top` · `bottom` | `top` | Where a `bar` sits — the top or the bottom of the viewport. Ignored by the ring. |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `info` | The colour of the fill or ring. |

### SharedElement

`motion/shared-element` — Gives an element a view-transition identity so it can morph between routes or in-page states.

No styling props.

### Stagger

`motion/stagger` — Reveals its children in sequence, staggered from first, last or centre.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `step` | number | `60` | Delay in milliseconds between each child. Written to the `--stagger` channel. |
| `from` | `first` · `last` · `center` | `first` | Where the stagger originates: the first child, the last, or the middle. |
| `trigger` | `mount` · `inView` | `mount` | When the entrance plays: immediately on mount, or when the group scrolls into view. |
| `enter` | `fade` · `scale` · `fly-up` · `fly-down` · `fly-left` · `fly-right` · `blur` · `slide` | `fade` | The enter preset applied to each child, via `.anim-in` or `.reveal` and the matching `.enter-*` class. |

### TextReveal

`motion/text-reveal` — Text that enters one character, word or line at a time, staggered on the `--i` channel.

No styling props.

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `by` | `char` · `word` · `line` | `word` | How the text is split into staggered pieces. |
| `preset` | `fade-up` · `blur` · `scale` · `slide` | `fade-up` | The entrance each piece uses. |
| `step` | number | `60` | Delay between one piece and the next, in milliseconds. Written to the `--stagger` channel. |
| `trigger` | `mount` · `inView` | `mount` | `mount` plays as soon as the element is created; `inView` waits until it enters the viewport. |

### TiltCard

`motion/tilt-card` — Tilts a card in 3D toward the pointer, with an optional glare highlight.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `glare` | flag | `false` | Draws a highlight that follows `--px` / `--py` across the surface. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `scale` | number | `1.02` | Scale applied while the pointer is over the card. |
| `spring` | `SpringInput` | `snappy` | The spring used for the tilt and the lift. |

### Typewriter

`motion/typewriter` — Types and deletes its way through a list of words, with a blinking caret.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `cursor` | flag | `true` | Shows a blinking caret after the typed text. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `speed` | number | `70` | Milliseconds spent typing each character. |
| `deleteSpeed` | number | `45` | Milliseconds spent deleting each character. |
| `pause` | number | `1600` | How long to hold a completed word before deleting it, in milliseconds. |
| `loop` | flag | `true` | Starts again from the first word after the last one is deleted. When off, the last word stays. |

## Effects

### Aurora

`effects/aurora` — Slow drifting blurred colour fields, used as a section background, with children on top.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `intensity` | number | `0.45` | Strength of the colour fields, from 0 (none) to 1 (strong). |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `speed` | number | `18` | Seconds for one drift cycle of the fields. |

### BorderBeam

`effects/border-beam` — A single beam of light that travels around the border of its parent.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `reverse` | flag | `false` | Travels the other way around the border. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `duration` | number | `8` | Seconds for one trip around the border. |
| `delay` | number | `0` | Seconds to wait before the first trip. |

### GlassPanel

`effects/glass-panel` — A frosted surface that builds on the library glass treatment, with blur, tint, border and rim.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `blur` | `sm` · `md` · `lg` | `md` | How strongly the panel frosts what sits behind it. |
| `tint` | flag | `false` | Mixes a little of the theme accent into the frost. |
| `border` | flag | `true` | Draws a hairline around the panel. |
| `rim` | flag | `true` | Lights the top edge of the panel. |

### GlowCard

`effects/glow-card` — A card with a rotating conic-gradient border and a soft outer glow.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `theme` · `rainbow` · `subtle` | `theme` | Colour of the rotating border: the theme accent, a hue-swept rainbow, or a quieter wash. |
| `active` | flag | `false` | When true, the border always rotates; when false, it rotates only on hover or focus within. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `speed` | number | `8` | Seconds for one full rotation of the gradient border. |

### GradientText

`effects/gradient-text` — Text filled with a theme-derived gradient, with optional slow motion and readable selection.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `look` | `theme` · `aurora` · `sunset` · `mono` | `theme` | The fill: the theme accent, an aurora of hue offsets, a warmer sunset, or a monochrome fade. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `animated` | flag | `false` | Sweeps the gradient slowly along the text. |

### Noise

`effects/noise` — A film-grain overlay drawn from layered repeating gradients, without images or SVG.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `opacity` | number | `0.18` | Strength of the grain, from 0 (none) to 1 (strong). |
| `blend` | `overlay` · `soft-light` · `multiply` | `overlay` | How the grain mixes with what is behind it. |

### Pattern

`effects/pattern` — A decorative background layer drawn from pure CSS gradients: grid, dots, lines or a cross.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `form` | `grid` · `dots` · `lines` · `cross` | `grid` | The repeating motif, drawn with CSS gradients. |
| `fade` | `none` · `radial` · `top` · `bottom` · `edges` | `none` | A mask that fades the pattern out. |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` <br>*shared axis* | `neutral` | Colour of the pattern, taken from the shared tone axis. |

### ShimmerText

`effects/shimmer-text` — A highlight that sweeps through text, for loading or "AI thinking" labels.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `spread` | string | `12%` | Width of the highlight, as a CSS length along the gradient. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `duration` | number | `1.8` | Seconds for one sweep of the highlight. |

### SpotlightCard

`effects/spotlight-card` — A card lit by a soft radial light that follows the pointer, on the surface and along the border.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `intensity` | number | `0.35` | Strength of the light, from 0 (none) to 1 (strong). |
| `color` | `theme` · `neutral` | `theme` | Colour of the light: the theme accent, or a neutral white highlight. |

**Motion**

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `radius` | string | `40%` | Diameter of the pointer-following light, as a CSS length. |

## Theme

### ModeToggle

`theme/mode-toggle` — Switches between light, dark and system mode with a circular reveal from the click point.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `form` | `icon` · `switch` · `segmented` | `icon` | The control: a single `icon` button, a `switch`, or a `segmented` radio group. |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The control height and text scale. |

### ThemeCustomizer

`theme/theme-customizer` — The live theme editor: mode, named theme, colour, radius, density, motion, a preview, and copy or reset.

No styling props.

### ThemePicker

`theme/theme-picker` — A swatch grid of the named themes, each previewing its accent, with a spring-in selected ring.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `size` | `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` <br>*shared axis* | `lg` | The swatch and label scale. |
| `showLabels` | flag | `false` | Draws the theme name under each swatch. |

### ThemeProvider

`theme/theme-provider` — Themes a subtree independently of the page, or the whole document with `root`.

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `hue` | number | — | The accent hue, 0 to 360, overriding the named theme. |
| `chroma` | number | — | How vivid the accent is, 0 to about 0.3, overriding the named theme. |
| `tint` | number | — | How much of the hue the neutrals carry, 0 to about 0.04, overriding the named theme. |
| `radius` | `sharp` · `soft` · `round` | — | The corner ladder for this subtree. |
| `density` | `ThemeDensity` | — | The spacing and height ladder for this subtree. |

## What is left that does not line up

After the big renames the axes line up: `variant` is one 11-value style on 8 parts, `look` is the only fill vocabulary, `form` is the only morphology one, `disabled` is declared everywhere, and `side`, `type` and `labelPosition` are gone. These are the leftover edges. All counts come from the same source as the tables.

### `size` is one ladder — except on avatars

| Values | Default | Parts | Where |
| --- | --- | --- | --- |
| `xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl` | `lg` / `—` / `bs` / `md` / `sm` | 46 | `button`, `copy-button`, `icon-button`, `split-button`, `toggle`, `toggle-group`, `field`, `input`, `input-group`, `native-select`, `number-input`, `password-input`, `pin-input`, `search-input`, `tags-input`, `textarea`, `checkbox`, `chip-group`, `radio-group`, `rating`, `segmented-control`, `slider`, `switch`, `combobox`, `date-field`, `date-picker`, `date-range-field`, `date-range-picker`, `select`, `time-field`, `time-range-field`, `back-to-top`, `pagination`, `tabs`, `empty-state`, `meter`, `spinner`, `status`, `card`, `item`, `badge`, `kbd`, `label`, `tag`, `mode-toggle`, `theme-picker` |
| `xs` · `sm` · `md` · `lg` · `xl` | `—` / `md` | 2 | `avatar`, `avatar-group` |

Every control, label, badge and surface takes the same eight-rung height ladder, and `gap` is the same eight-rung space ladder everywhere. `Avatar` and `AvatarGroup` keep their own five-rung `AvatarSize` because an avatar is a picture scale rather than a control height: the `.avatar-*` CSS is that five-step scale and every rung renders.

### `columns` still has four types

| Prop | Types in play | Where |
| --- | --- | --- |
| `columns` | `'1'–'4'` strings, `number`, `number` + breakpoint map, or `Column<T>[]` | `description-list` — `'1' \| '2' \| '3' \| '4'`<br>`bento-grid` — `number`<br>`masonry` — `number` + breakpoints<br>`data-table` — `Column<T>[]` |
| `density` | row height, or a token ladder | `table`, `data-table` — `compact` \| `default` \| `roomy`<br>`theme-provider` — `compact` \| `cozy` \| `comfortable` (the fractalstyler ladder) |

### Coverage gaps inside the control families

- `size` but no `textSize`: `icon-button`, `field`.
- `size` but no `shape`: `checkbox`, `chip-group`, `radio-group`, `rating`, `segmented-control`, `slider`, `switch`.
- `size`, `textSize` and `shape` but no `look`: `combobox`, `date-field`, `date-picker`, `date-range-field`, `date-range-picker`, `select`, `time-field`, `time-range-field` — the pickers cannot be filled or ghosted the way an `Input` can.

### Defaults that disagree

- `value` starts as `''` on the text inputs, unset on `checkbox`/`radio-group`/`switch`/`tabs`/`accordion`, `0` on `rating`/`slider`/`meter`, `'#2563eb'` on `color-picker` and `{ start: null, end: null }` on the date ranges — a mix of controlled and uncontrolled starts.
- `label` ships 16 English defaults (`Copy`, `Toolbar`, `Application`, `Back to top`, `Breadcrumb`, `Dock`, `Site`, `Main`, `Pagination`, `Sidebar`, `On this page`, `Loading`, `Carousel`, `Scrollable content`, `Dark mode`, `Theme`); every other part has none, so most components need a label from you and a few do not.
- `level` is 1–6 on `CardTitle` but 1–4 on `Heading`, and `Heading` also takes a numeric `size` of 1–4 — neither the `Size` axis nor a heading level.
- `Field` takes both `error` (a string) and `invalid` (a flag) for the same state.

### Declared vs inherited

`disabled` is now declared on 46 parts, but `class` is still declared on exactly one (`AlertDialog`), though every component accepts it through its HTML attributes.

## Components with no styling props

No visual axis and no motion prop — their appearance is fixed by the component, or inherited from the kit around them: `FileDrop`, `ColorPicker`, `Breadcrumbs`, `SidebarNav`, `Toc`, `VisuallyHidden`, `Collapsible`, `Tree`, `AnimatedList`, `PageTransition`, `SharedElement`, `ThemeCustomizer`.

Motion only — the whole surface is animation: `Draggable`, `Magnetic`, `Motion`, `Parallax`, `Presence`, `Reorder`, `Reveal`, `Stagger`, `TextReveal`.

## Appendix — shared-axis coverage

Which parts actually take each shared axis, judged on the prop's type rather than its name.

`✔` takes the shared axis exactly · `◐` takes a named alias of it (a narrower or wider ladder) · `~` has a prop of that name with its own values, so the word does not mean the same thing here.

| Part | `variant` | `size` | `textSize` | `shape` | `tone` | `orientation` | `align` | `gap` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Button | ✔ | ✔ | ✔ | ✔ |  |  |  |  |
| ButtonGroup |  |  |  |  |  | ✔ |  |  |
| CopyButton | ✔ | ✔ | ✔ | ✔ |  |  |  |  |
| IconButton | ✔ | ✔ |  | ✔ |  |  |  |  |
| Link |  |  |  |  |  |  |  |  |
| SplitButton | ✔ | ✔ | ✔ | ✔ |  |  |  |  |
| Toggle | ✔ | ✔ | ✔ | ✔ |  |  |  |  |
| ToggleGroup | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |  |
| Toolbar |  |  |  |  |  | ✔ |  |  |
| Field |  | ✔ |  | ✔ |  | ✔ |  |  |
| FileDrop |  |  |  |  |  |  |  |  |
| Input |  | ✔ | ✔ | ✔ |  |  |  |  |
| InputGroup |  | ✔ | ✔ | ✔ |  |  | ~ |  |
| NativeSelect |  | ✔ | ✔ | ✔ |  |  |  |  |
| NumberInput |  | ✔ | ✔ | ✔ |  |  |  |  |
| PasswordInput |  | ✔ | ✔ | ✔ |  |  |  |  |
| PinInput |  | ✔ | ✔ | ✔ |  |  |  |  |
| SearchInput |  | ✔ | ✔ | ✔ |  |  |  |  |
| TagsInput |  | ✔ | ✔ | ✔ |  |  |  |  |
| Textarea |  | ✔ | ✔ | ✔ |  |  |  |  |
| Checkbox |  | ✔ | ✔ |  |  |  |  |  |
| ChipGroup |  | ✔ | ✔ |  |  |  |  |  |
| RadioGroup |  | ✔ | ✔ |  |  | ✔ |  |  |
| Rating |  | ✔ | ✔ |  |  |  |  |  |
| SegmentedControl |  | ✔ | ✔ |  |  |  |  |  |
| Slider |  | ✔ | ✔ |  |  | ✔ |  |  |
| Switch |  | ✔ | ✔ |  |  |  | ~ |  |
| Calendar |  |  |  |  |  |  |  |  |
| ColorPicker |  |  |  |  |  |  |  |  |
| Combobox |  | ✔ | ✔ | ✔ |  |  |  |  |
| DateField |  | ✔ | ✔ | ✔ |  |  |  |  |
| DatePicker |  | ✔ | ✔ | ✔ |  |  |  |  |
| DateRangeField |  | ✔ | ✔ | ✔ |  |  |  |  |
| DateRangePicker |  | ✔ | ✔ | ✔ |  |  |  |  |
| Select |  | ✔ | ✔ | ✔ |  |  |  |  |
| TimeField |  | ✔ | ✔ | ✔ |  |  |  |  |
| TimeRangeField |  | ✔ | ✔ | ✔ |  |  |  |  |
| AlertDialog |  |  |  |  | ✔ |  |  |  |
| CommandPalette |  |  |  |  |  |  |  |  |
| ContextMenu |  |  |  |  |  |  |  |  |
| Dialog |  |  |  |  |  |  |  |  |
| Drawer |  |  |  |  |  |  |  |  |
| DropdownMenu |  |  |  |  |  |  |  |  |
| HoverCard |  |  |  |  |  |  |  |  |
| Menubar |  |  |  |  |  |  |  |  |
| Popover |  |  |  |  |  |  |  |  |
| Tooltip |  |  |  |  |  |  |  |  |
| BackToTop |  | ✔ |  |  |  |  |  |  |
| Breadcrumbs |  |  |  |  |  |  |  |  |
| Dock |  |  |  |  |  | ✔ |  |  |
| Navbar |  |  |  |  |  |  |  |  |
| NavigationMenu |  |  |  |  |  | ✔ |  |  |
| Pagination |  | ✔ | ✔ |  |  |  |  |  |
| SidebarNav |  |  |  |  |  |  |  |  |
| Stepper |  |  |  |  |  | ✔ |  |  |
| Tabs |  | ✔ |  |  |  | ✔ |  |  |
| Toc |  |  |  |  |  |  |  |  |
| Alert |  |  |  |  | ✔ |  |  |  |
| Banner |  |  |  |  | ✔ |  |  |  |
| EmptyState |  | ✔ |  |  |  |  |  |  |
| Meter |  | ✔ |  |  | ✔ |  |  |  |
| Skeleton |  |  |  |  |  |  |  |  |
| Spinner |  | ✔ |  |  | ✔ |  |  |  |
| Status |  | ✔ |  |  | ✔ |  |  |  |
| Toast |  |  |  |  | ~ |  |  |  |
| Avatar |  | ~ |  | ◐ |  |  |  |  |
| AvatarGroup |  | ~ |  | ◐ |  |  |  |  |
| Card |  | ✔ |  | ✔ |  |  | ✔ |  |
| Code |  |  |  |  |  |  |  |  |
| DescriptionList |  |  |  |  |  | ✔ |  |  |
| Item |  | ✔ |  | ✔ |  |  |  |  |
| Stat |  |  |  |  | ✔ |  |  |  |
| Timeline |  |  |  |  | ✔ |  | ~ |  |
| AspectFrame |  |  |  | ✔ |  |  |  |  |
| Badge | ✔ | ✔ | ~ | ✔ |  |  |  |  |
| Divider |  |  |  |  |  | ✔ |  |  |
| Kbd |  | ✔ | ~ |  |  |  |  |  |
| Label |  | ✔ |  |  |  |  |  |  |
| Tag | ✔ | ✔ | ~ | ✔ |  |  |  |  |
| Typography |  |  |  |  |  |  | ~ |  |
| VisuallyHidden |  |  |  |  |  |  |  |  |
| Accordion |  |  |  |  |  |  |  |  |
| Carousel |  |  |  |  |  |  |  | ✔ |
| Collapsible |  |  |  |  |  |  |  |  |
| DataTable |  |  |  |  |  |  |  |  |
| Table |  |  |  |  |  |  | ~ |  |
| Tree |  |  |  |  |  |  |  |  |
| VirtualList |  |  |  |  |  |  |  |  |
| BentoGrid |  |  |  |  |  |  |  | ✔ |
| Container |  |  |  |  |  |  |  |  |
| Masonry |  |  |  |  |  |  |  | ✔ |
| Resizable |  |  |  |  |  | ✔ |  |  |
| ScrollArea |  |  |  |  |  | ✔ |  |  |
| StickyBar |  |  |  |  |  |  |  |  |
| AnimatedList |  |  |  |  |  |  |  |  |
| Draggable |  |  |  |  |  |  |  |  |
| Magnetic |  |  |  |  |  |  |  |  |
| Marquee |  |  |  |  |  |  |  | ✔ |
| Motion |  |  |  |  |  |  |  |  |
| NumberTicker |  |  |  |  |  |  |  |  |
| PageTransition |  |  |  |  |  |  |  |  |
| Parallax |  |  |  |  |  |  |  |  |
| Presence |  |  |  |  |  |  |  |  |
| Reorder |  |  |  |  |  |  |  |  |
| Reveal |  |  |  |  |  |  |  |  |
| ScrollProgress |  |  |  |  | ✔ |  |  |  |
| SharedElement |  |  |  |  |  |  |  |  |
| Stagger |  |  |  |  |  |  |  |  |
| TextReveal |  |  |  |  |  |  |  |  |
| TiltCard |  |  |  |  |  |  |  |  |
| Typewriter |  |  |  |  |  |  |  |  |
| Aurora |  |  |  |  |  |  |  |  |
| BorderBeam |  |  |  |  |  |  |  |  |
| GlassPanel |  |  |  |  |  |  |  |  |
| GlowCard |  |  |  |  |  |  |  |  |
| GradientText |  |  |  |  |  |  |  |  |
| Noise |  |  |  |  |  |  |  |  |
| Pattern |  |  |  |  | ✔ |  |  |  |
| ShimmerText |  |  |  |  |  |  |  |  |
| SpotlightCard |  |  |  |  |  |  |  |  |
| ModeToggle |  | ✔ |  |  |  |  |  |  |
| ThemeCustomizer |  |  |  |  |  |  |  |  |
| ThemePicker |  | ✔ |  |  |  |  |  |  |
| ThemeProvider |  |  |  |  |  |  |  |  |

---

**Counts:** 312 styling props across 124 components, plus 73 motion props.
