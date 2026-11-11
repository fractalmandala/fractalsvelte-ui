# @fractaldesign/fractalsvelte-ui

A Svelte 5 component library styled by a single stylesheet of classes and tokens. Every prop that changes a component's look takes a class name, so `<Button variant="outline" size="h-lg" shape="round">` renders `class="button outline h-lg round"`. What you pass is what you can read in the markup, and what you can restyle in one place.

- **99 components** in nine groups, written with runes (`$props`, `$state`, `$derived`, `$bindable`, snippets).
- **One plain-CSS stylesheet**, about 13 KB gzipped. No Tailwind, no Sass, no CSS-in-JS, no per-component style blocks.
- **Light and dark themes** from one attribute on `<html>`, with every colour a token you can set.
- **2,000 icons** in two tree-shakeable packs.
- **No runtime dependencies** beyond Svelte.

- [Githug](https://github.com/fractalmandala/fractalsvelte-ui) | [NPM](https://www.npmjs.com/package/@fractaldesign/fractalsvelte-ui)

## Install

```bash
pnpm add @fractaldesign/fractalsvelte-ui
```

The only peer dependency is `svelte` 5.

## Set up

Import the stylesheet once, in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@fractaldesign/fractalsvelte-ui/css';
	let { children } = $props();
</script>

{@render children()}
```

Set the theme on the root element. `light` is the default; switch by changing the attribute:

```html
<html lang="en" data-mode="light">
```

```ts
document.documentElement.dataset.mode = dark ? 'dark' : 'light';
```

## Use

```svelte
<script lang="ts">
	import { Button, Input, Card, Badge, Icon } from '@fractaldesign/fractalsvelte-ui';
	import { klArrowRight } from '@fractaldesign/fractalsvelte-ui/icons/keylinestroke';

	let email = $state('');
</script>

<Card title="Join the beta" description="We will email you when it opens.">
	<Input label="Email" type="email" bind:value={email} />
	{#snippet footer()}
		<Badge message="info">Limited seats</Badge>
		<Button variant="themed" shape="round">
			Request access
			{#snippet trailing()}<Icon icon={klArrowRight} />{/snippet}
		</Button>
	{/snippet}
</Card>
```

## The props language

The shared props take the names of classes in the stylesheet. Their values are exported as tuples and union types from the package root and from `@fractaldesign/fractalsvelte-ui/types`.

| Prop | Type | Values | What it sets |
|---|---|---|---|
| `variant` | `Variant` | `primary` `secondary` `themed` `outline` `ghost` `link` | Fill, border and text colour |
| `size` | `Size` | `h-xs` `h-sm` `h-md` `h-bs` `h-lg` `h-xl` | Control height, 12 to 40px. `h-xs` and `h-sm` are for icon buttons and compact controls |
| `shape` | `Shape` | `rect` `mincurved` `modern` `curved` `round` | Corner radius, from square to pill |
| `shadow` | `Shadow` | `shad-none` `shad-sm` … `shad-2xl`, `shad-hover-sm` … `shad-hover-2xl` | Elevation. The `shad-hover-` set lifts until hovered |
| `textsize` | `TextSize` | `text-xs` … `text-5xl` | Text size. Components never lock it |
| `surface` | `Surface` | `bg-main` `bg-surface` `bg-panel` `bg-overlay` `state-hover` `state-selected` `bg-button` `bg-input` | Background layer |
| `border` | `Border` | `border` `border-subtle` `border-strong` `border-dashed` `border-none`, and the bottom-edge `bb` set | Border weight |
| `message` | `Message` | `info` `success` `warning` `danger` | Status tone |
| `padding` | `string` | Any padding classes, such as `pad-md` or `px-lg py-sm` | Inside spacing |

Anything else goes through `class`, which every component accepts and appends to its own classes.

## Theming

Colours are tokens under `[data-mode='light']` and `[data-mode='dark']` in `styles/colors-themes.css`. Override any of them after the stylesheet:

```css
[data-mode='light'] {
	--theme-color: oklch(0.55 0.2 260);
	--bg-button: oklch(0.25 0.02 260);
}
```

Filled variants pick their text colour from their fill: white on a dark fill, near-black on a light one. To force a colour instead, set the matching override token: `--on-button`, `--on-button-secondary`, `--on-theme`, `--on-info`, `--on-success`, `--on-warning`, `--on-danger`.

## Icons

```ts
import { Icon } from '@fractaldesign/fractalsvelte-ui';
import { klSearch } from '@fractaldesign/fractalsvelte-ui/icons/keylinestroke'; // 1,000 stroke icons, kl*
import { klfSearch } from '@fractaldesign/fractalsvelte-ui/icons/keylinefill'; // 1,000 fill icons, klf*
```

```svelte
<Icon icon={klSearch} size={20} label="Search" />
```

Without `label` the icon is decorative and hidden from screen readers.

## Entry points

| Import | Contents |
|---|---|
| `@fractaldesign/fractalsvelte-ui` | All components and the prop types |
| `@fractaldesign/fractalsvelte-ui/types` | The prop tuples and union types only |
| `@fractaldesign/fractalsvelte-ui/css` | The whole stylesheet as one file |
| `@fractaldesign/fractalsvelte-ui/css/min` | The same, minified |
| `@fractaldesign/fractalsvelte-ui/styles` | `index.css`, which imports every layer in order |
| `@fractaldesign/fractalsvelte-ui/styles/*` | Single layers, such as `colors-themes.css` |
| `@fractaldesign/fractalsvelte-ui/icons` | Both icon packs and the `IconNode` type |
| `@fractaldesign/fractalsvelte-ui/icons/keylinestroke` | Stroke icons only |
| `@fractaldesign/fractalsvelte-ui/icons/keylinefill` | Fill icons only |

## Components

### Core (25)

| Component | What it is |
|---|---|
| `Accordion` | A list of collapsible sections, one or several open at once. |
| `Alert` | An inline message box: tinted by `message`, or plain with coloured text and icon via `messageText`. |
| `AlertDialog` | A modal that asks the user to confirm or cancel an action. |
| `AspectRatio` | A box that holds a fixed aspect ratio, with media children filling it. |
| `Button` | A button, or a link styled as one when given `href`. |
| `Card` | A content card with optional media, title, description, header and footer. |
| `Checkbox` | A checkbox with label, description and error text, supporting an indeterminate state. |
| `CodeBlock` | A block of code with filename, line numbers and a copy button. |
| `Combobox` | Searchable combobox input with dropdown suggestions, keyboard navigation, and custom empty state. |
| `CommandPalette` | A searchable command menu opened with ⌘ / Ctrl and a key. |
| `ContextMenu` | A menu that opens on right-click inside a region. |
| `Dialog` | A modal dialog with title, description, body and footer. |
| `Drawer` | A panel that slides in from a screen edge. |
| `DropdownMenu` | A menu of actions that opens from a trigger. |
| `Icon` | An SVG icon from the keyline packs, sized in pixels or by a size token. |
| `Input` | A text input with label, helper or error text, leading and trailing slots, and a clear button. |
| `Label` | An accessible form label with required indicator and optional description text. |
| `Modal` | The native `<dialog>` shell shared by Dialog, AlertDialog, Drawer, MobileNav and CommandPalette. |
| `Popover` | A floating panel that opens from a trigger. |
| `Radio` | A single radio button with label and description. |
| `RadioGroup` | A labelled group of radio buttons built from an `options` list. |
| `Select` | A select menu, native or as a filterable listbox, with option groups. |
| `Switch` | An on/off toggle switch with label and description. |
| `Toast` | A single notification with title, description, tone, action and auto-dismiss. |
| `Tooltip` | A small text hint shown on hover or focus. |

### Actions (3)

| Component | What it is |
|---|---|
| `CloseButton` | A dismiss button with an X icon for closing panels, dialogs and dismissible items. |
| `CopyButton` | Clipboard copy trigger with automatic check-mark feedback state. |
| `IconButton` | A square button holding only an icon, named for screen readers by `label`. |

### Forms (16)

| Component | What it is |
|---|---|
| `ColorPicker` | A colour input with optional hex field and preset swatches. |
| `Fader` | A studio audio level fader with tactile grooved thumb marks and vertical/horizontal orientation. |
| `Fieldset` | HTML fieldset container with styled legend, borders, padding, and disabled cascade. |
| `FileUpload` | Drag-and-drop file upload dropzone with file picker, multiple selection, and removable file list. |
| `FormField` | A wrapper that gives any form control a label, helper text, error and counter, and hands its variant, surface, size, shape and shadow to the Input or Select inside. |
| `MultiSelect` | Multi-value selection input with chips, search filtering, and keyboard navigation. |
| `NumberInput` | A numeric input with min, max, step and optional − / + stepper buttons. |
| `PinInput` | A row of single-character boxes for entering a PIN or one-time code. |
| `RangeSlider` | A two-thumb slider for choosing a min and max value. |
| `RotaryDial` | A knob-style dial that sets a value by dragging or arrow keys. |
| `SearchInput` | A search field with clear button, loading spinner and optional ⌘K shortcut. |
| `Slider` | A single-thumb slider for choosing a value in a range. |
| `SliderTrack` | Shared SVG track and thumb renderer for Slider and RangeSlider. |
| `TagInput` | A text field that turns entries into removable tags. |
| `TextArea` | A multi-line text input with optional auto-resize and character count. |
| `XYPad` | A 2D interactive XY control pad with crosshair guide, draggable puck, and value readout. |

### Display (20)

| Component | What it is |
|---|---|
| `Avatar` | A user image, or initials fallback, with optional status dot. |
| `AvatarGroup` | A row or column of avatars, overlapping or spaced apart, with a "+N" chip for hidden members. |
| `Badge` | A small label for status or counts, with optional leading dot. |
| `Banner` | A full-width notice strip: tinted by `message`, or plain with coloured text and icon via `messageText`. |
| `Bar` | Shared SVG track bar for Progress and Meter with optional stripes, animation, and markers. |
| `Counter` | A number that counts up to `value`, with prefix, suffix and decimals. |
| `Datatable` | Rich data table with search filtering, sortable column headers, row selection checkboxes, pagination, and custom cell snippets. |
| `Divider` | Horizontal or vertical divider separator rule with optional centered label. |
| `Dot` | A compact status dot indicator with optional pulsing animation and status variants. |
| `Img` | Enhanced image component with aspect ratio, object-fit, fallback snippet, and shape. |
| `Kbd` | A keyboard key, as an icon button or a static keycap for showing shortcuts. |
| `Meter` | A gauge bar for a value in a known range, coloured by low, high and optimum zones. |
| `Progress` | A progress bar, determinate or indeterminate, with optional value label. |
| `Ribbon` | A corner ribbon banner for cards and containers, with bookmark styling and variant themes. |
| `Skeleton` | Animated shimmer placeholder for loading states with line count, dimensions, and shape. |
| `Spinner` | A spinning loading indicator sized to the surrounding text. |
| `Stamp` | An icon or metric tile stamp with square aspect ratio, rounded corners, and status variants. |
| `Status` | A status pill or badge with an integrated indicator dot and label. |
| `Table` | Responsive data table supporting declarative columns and rows sorting or compound children. |
| `Tag` | A label chip, optionally removable, filled with or coloured by a surface, theme or message colour. |

### Layout (6)

| Component | What it is |
|---|---|
| `ClickableCard` | A card that acts as a button, or a link when given `href`. |
| `Container` | A centred wrapper that caps content at a maximum width. |
| `Grid` | Responsive CSS Grid container with explicit columns or auto-fit/auto-fill minmax tracks. |
| `SelectableCard` | A card that works as a checkbox or radio option. |
| `SplitPane` | Two panes side by side or stacked, where either can be collapsed. |
| `Stack` | Flexible linear stack layout container with direction, gap, alignment, and wrap options. |

### Navigation (12)

| Component | What it is |
|---|---|
| `AppShell` | A page layout with header, sidebar, aside, main area and footer. |
| `BottomNav` | A bottom tab bar for mobile navigation. |
| `Breadcrumb` | A trail of links to the current page, collapsing the middle when long. |
| `Header` | A top bar with brand, centre and actions slots, optionally sticky. |
| `MobileNav` | A slide-in navigation panel for small screens. |
| `Pagination` | Page number buttons with previous and next controls. |
| `SegmentedControl` | A row of joined buttons for picking one of a few options. |
| `SideNav` | A vertical navigation list with groups, badges and an icon-only mode. |
| `Stepper` | A step-by-step progress indicator for multi-step flows. |
| `Tabs` | A tab bar that switches between panels of content. |
| `TopNav` | A horizontal navigation bar of links. |
| `TreeList` | A nested, expandable tree of items. |

### Overlays (3)

| Component | What it is |
|---|---|
| `Anchor` | Positions a floating panel next to its trigger; used by Popover, Tooltip and menus. |
| `MenuList` | Shared keyboard-navigable menu list for DropdownMenu and ContextMenu. |
| `ToastStack` | A stack of toasts placed in a screen corner or inline. |

### Typography (5)

| Component | What it is |
|---|---|
| `Blockquote` | A quotation with author and citation. |
| `Code` | Inline code text. |
| `Collapsible` | A single section that expands and collapses under a header. |
| `Heading` | Polymorphic heading element with semantic level, text size scale, tracking, and weight. |
| `Text` | Polymorphic typography primitive supporting semantic tags, tone colors, weights, and truncation. |

### Blocks (9)

| Component | What it is |
|---|---|
| `BeforeAfter` | A slider that wipes between a before and an after image. |
| `Canvas` | High-DPI auto-resizing HTML5 canvas container with draw callback and aspect ratio. |
| `Carousel` | Responsive draggable and swipeable carousel slider with slide snippet, next/prev arrow buttons, and indicator dots. |
| `ChatBubble` | A chat message bubble with avatar, timestamp and status. |
| `EmptyState` | Zero-state placeholder illustration with title, description, and action button slot. |
| `FeatureGrid` | A grid of features, each with icon, title and description. |
| `FlowCanvas` | A pannable, zoomable grid canvas for node diagrams. |
| `Video` | Styled media card with video player, title, caption, aspect ratio, poster, and tokenized frame. |
| `Waveform` | An interactive audio waveform visualizer and scrubber with progress fill and seek support. |

## Develop

```bash
pnpm install
pnpm dev        # docs site
pnpm check      # type check
pnpm package    # build dist/: icons, svelte-package, the CSS bundle
```

Each component has a documentation page at `/components/<name>`, with a live demo, a preview of each key prop and the full props table.

## License

MIT
