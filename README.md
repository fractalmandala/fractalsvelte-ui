# @fractaldesign/fractalsvelte-ui

Production-ready Svelte 5 UI component library built on [`@fractaldesign/fractalstyler`](https://www.npmjs.com/package/@fractaldesign/fractalstyler) and [`@fractaldesign/icons`](https://www.npmjs.com/package/@fractaldesign/icons).

- **npm**: [@fractaldesign/fractalsvelte-ui](https://www.npmjs.com/package/@fractaldesign/fractalsvelte-ui)
- **GitHub**: [fractalmandala/fractalsvelte-ui](https://github.com/fractalmandala/fractalsvelte-ui)

---

## Features

- **98 Svelte 5 Components** across 8 categories (Actions, Forms, Display, Layout, Navigation, Overlays, Typography, and Blocks).
- **Runes-First Architecture** — Built natively with `$props()`, `$state()`, `$derived()`, `$bindable()`, and `{#snippet}`.
- **Shared Prop Axes** — Every component shares a strict, predictable vocabulary for `variant`, `size`, `shape`, `shadow`, `textsize`, `padding`, `surface`, `border`, and `message`.
- **Flexible Styling** — Import pre-compiled CSS (`~5 KB` gzipped) or compose directly with SASS alongside `@fractaldesign/fractalstyler`.
- **Built-in Dark & Light Mode** — Semantic CSS custom properties switch automatically via `data-mode="light"` / `data-mode="dark"` on `<html>`.
- **Zero-Runtime Type Vocabulary** — Exported const tuples and TypeScript union types via `@fractaldesign/fractalsvelte-ui/types`.

---

## Installation

Install `@fractaldesign/fractalsvelte-ui` alongside its peer dependency `@fractaldesign/fractalstyler`:

```bash
pnpm add @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
# or
npm install @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
```

> `@fractaldesign/icons` is included as a direct dependency and installed automatically.

### Peer Dependencies

| Package | Version | Required |
|---|---|---|
| `svelte` | `^5.0.0` | Yes |
| `@fractaldesign/fractalstyler` | `^1.5.0` | Yes |
| `sass` | `^1.70.0` | Optional (only when importing `/styles` SASS sources) |

---

## Stylesheet Setup

Import the stylesheets once in your root layout (e.g. `src/routes/+layout.svelte`). You can use either **compiled CSS** (no SASS required) or **SASS sources**.

### Option 1: Pre-Compiled CSS (Recommended)

```svelte
<script lang="ts">
	import '@fractaldesign/fractalstyler/css';
	import '@fractaldesign/fractalsvelte-ui/css';

	let { children } = $props();
</script>

{@render children()}
```

For minified stylesheets in production:

```ts
import '@fractaldesign/fractalstyler/css/min';
import '@fractaldesign/fractalsvelte-ui/css/min';
```

### Option 2: SASS

If your project uses `sass`, import both libraries in your global stylesheet (e.g. `src/app.sass`):

```sass
@use '@fractaldesign/fractalstyler/styles' as *
@use '@fractaldesign/fractalsvelte-ui/styles' as *
```

### Package Exports Reference

| Subpath | Description |
|---|---|
| `@fractaldesign/fractalsvelte-ui` | All 73 Svelte 5 components + TypeScript types |
| `@fractaldesign/fractalsvelte-ui/types` | Canonical prop tuples (`Variants`, `Sizes`, `Shapes`, etc.) & union types |
| `@fractaldesign/fractalsvelte-ui/css` | Pre-compiled CSS (`tokens.css` + `globals.sass` + `components.sass`) |
| `@fractaldesign/fractalsvelte-ui/css/min` | Minified pre-compiled CSS |
| `@fractaldesign/fractalsvelte-ui/styles` | SASS entry point (`index.sass`) |
| `@fractaldesign/fractalsvelte-ui/styles/*` | Individual stylesheet assets (`globals.sass`, `components.sass`, `tokens.css`) |
| `@fractaldesign/fractalsvelte-ui/tokens.css` | Standalone CSS custom property tokens only |

### Theme Mode (`light` / `dark`)

Tokens respond to the `data-mode` attribute on the root `<html>` element (`"light"` by default, `"dark"` when `[data-mode="dark"]` is set):

```html
<html lang="en" data-mode="dark">
```

```ts
// Toggle dynamically in browser
document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
```

---

## Quick Start

Import components directly from `@fractaldesign/fractalsvelte-ui`:

```svelte
<script lang="ts">
	import {
		Button,
		Input,
		Select,
		Switch,
		Card,
		Badge,
		Dialog
	} from '@fractaldesign/fractalsvelte-ui';

	let name = $state('');
	let role = $state('developer');
	let notifications = $state(true);
	let dialogOpen = $state(false);

	const roles = [
		{ value: 'developer', label: 'Developer' },
		{ value: 'designer', label: 'Designer' },
		{ value: 'product', label: 'Product Manager' }
	];
</script>

<Card surface="bg-raised" padding="pad-lg" shape="curved" shadow="shad-sm" gap={4}>
	<div class="row between middle">
		<h3>Profile Settings</h3>
		<Badge variant="themed" shape="round">Pro</Badge>
	</div>

	<Input
		label="Full Name"
		placeholder="Ada Lovelace"
		bind:value={name}
		variant="outline"
		size="h-md"
		shape="modern"
	/>

	<Select
		label="Role"
		options={roles}
		bind:value={role}
		variant="outline"
		size="h-md"
		shape="modern"
	/>

	<Switch label="Enable email notifications" bind:checked={notifications} />

	<div class="row end gap-2">
		<Button variant="ghost" onclick={() => (dialogOpen = true)}>Preview</Button>
		<Button variant="themed" shadow="shad-sm">Save Changes</Button>
	</div>
</Card>

<Dialog bind:open={dialogOpen} title="Profile Preview" description="Confirm your profile details.">
	<p>Name: {name || '—'} ({role})</p>
</Dialog>
```

---

## Core Prop Axes & Type Vocabulary

Every component in `@fractaldesign/fractalsvelte-ui` draws its visual and structural props from a single canonical source of truth in `@fractaldesign/fractalsvelte-ui/types`.

```ts
import {
	Variants,
	Sizes,
	Shapes,
	Pads,
	Shadows,
	TextSizes,
	Surfaces,
	Borders,
	ThemeColors,
	Messages,
	MessageTexts,
	Frames,
	type Variant,
	type Icon,
	type Size,
	type Shape,
	type Pad,
	type Shadow,
	type TextSize,
	type Surface,
	type Border,
	type ThemeColor,
	type Message,
	type MessageText,
	type Frame,
	type Orientation
} from '@fractaldesign/fractalsvelte-ui';
```

### Shared Prop Reference

| Prop | Type | Allowed Values | Default | Description |
|---|---|---|---|---|
| `variant` | `Variant` | `'primary' \| 'secondary' \| 'themed' \| 'outline' \| 'ghost' \| 'link'` | `'primary'` / `'outline'` | Interactive visual treatment (buttons, inputs, badges, tabs, nav) |
| `icon` | `Icon` | `'primary' \| 'secondary' \| 'themed' \| 'outline' \| 'ghost' \| 'link'` | `'ghost'` / `'primary'` | 1:1 square icon-container styling (`IconButton`, `CloseButton`, `CopyButton`) |
| `size` | `Size` | `'h-xs' \| 'h-sm' \| 'h-md' \| 'h-bs' \| 'h-lg' \| 'h-xl'` | `'h-md'` | Fixed height scale (`24px`, `30px`, `36px`, `42px`, `48px`, `56px`) |
| `shape` | `Shape` | `'rect' \| 'min' \| 'modern' \| 'curved' \| 'round'` | `'modern'` | Corner radius (`0px`, `4px`, `8px`, `12px`, `9999px`) |
| `padding` / `pad` | `Pad` | `'pad-xs' \| 'pad-sm' \| 'pad-md' \| 'pad-bs' \| 'pad-lg' \| 'pad-xl'` | `'pad-md'` | Internal container spacing (`4px` to `32px`) |
| `shadow` | `Shadow` | `'shad-none' \| 'shad-xs' \| 'shad-sm' \| 'shad-md' \| 'shad-bs' \| 'shad-lg' \| 'shad-xl' \| 'shad-2xl' \| 'shad-3xl' \| 'shad-rim' \| 'shad-hover-*'` | `'shad-none'` | Elevation and hover shadow tokens |
| `textsize` | `TextSize` | `'text-xs' \| 'text-sm' \| 'text-md' \| 'text-bs' \| 'text-lg' \| 'text-xl' \| 'text-2xl' \| 'text-3xl' \| 'text-4xl' \| 'text-5xl'` | `'text-md'` | Typography size scale across all text-bearing components |
| `surface` | `Surface` | `'bg-main' \| 'bg-surface' \| 'bg-panel' \| 'bg-sunken' \| 'bg-raised' \| 'bg-extra' \| 'state-surface' \| 'state-hover' \| 'state-selected' \| 'bg-button' \| 'bg-input'` | `'bg-raised'` / `'bg-surface'` | Background surface token for containers, overlays, and cards |
| `border` | `Border` | `'border' \| 'border-subtle' \| 'border-strong' \| 'border-none'` | `'border'` | Border weight and visibility |
| `message` | `Message` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Status background + border + text color (`Alert`, `Banner`, `Toast`) |
| `messageText` | `MessageText` | `'text-info' \| 'text-success' \| 'text-warning' \| 'text-danger'` | — | Status text color (`FormField` validation messages) |
| `ratio` | `Frame` | `'frame-1-1' \| 'frame-4-3' \| 'frame-3-2' \| 'frame-16-9' \| 'frame-21-9' \| 'frame-3-4' \| 'frame-9-16'` | `'frame-16-9'` | Aspect ratio frame (`AspectRatio`) |

### Activation vs. Direct Classes

Under the hood, components compose two categories of CSS classes:
1. **Compound Activation Classes** (`.variant`, `.icon`, `.size`, `.shape`) — Pair an activation class with its modifier value (e.g. `class="variant primary size h-md shape modern"`).
2. **Direct Utility Classes** (`Pad`, `Shadow`, `TextSize`, `Surface`, `Border`, `Message`, `MessageText`, `Frame`) — Applied directly as standalone classes (e.g. `class="bg-raised border pad-md shad-sm text-md"`).

---

## Component Catalog (98 Components)

### 1. Actions (4)

| Component | Description | Key Props |
|---|---|---|
| `Button` | Standard action trigger with variant, size, shape, shadow, and loading state. | `variant`, `size`, `shape`, `shadow`, `textsize`, `loading`, `disabled`, `onclick` |
| `IconButton` | Square 1:1 icon action button with required accessible `ariaLabel`. | `ariaLabel`, `icon`, `size`, `shape`, `shadow`, `textsize`, `disabled`, `onclick` |
| `CloseButton` | Dismiss button rendering an `X` icon (`@fractaldesign/icons`). | `icon`, `size`, `shape`, `shadow`, `textsize`, `ariaLabel`, `onclick` |
| `CopyButton` | Clipboard copy trigger with automatic check-mark feedback state. | `value`, `timeout`, `icon`, `size`, `shape`, `shadow`, `textsize` |

### 2. Forms (24)

| Component | Description | Key Props |
|---|---|---|
| `Input` | Single-line text field with optional label, hint, error, and prefix/suffix snippets. | `bind:value`, `type`, `variant`, `size`, `shape`, `shadow`, `textsize`, `label`, `error`, `prefix`, `suffix` |
| `SearchInput` | Search field with leading search icon and quick-clear button. | `bind:value`, `variant`, `size`, `shape`, `shadow`, `textsize`, `onclear` |
| `Combobox` | Searchable combobox input with dropdown suggestions, keyboard navigation, and custom empty state. | `options`, `bind:value`, `placeholder`, `emptyText`, `variant`, `size`, `shape`, `shadow`, `textsize`, `onchoose` |
| `MultiSelect` | Multi-value selection input with chips, search filtering, and keyboard navigation. | `options`, `bind:value`, `placeholder`, `max`, `variant`, `size`, `shape`, `shadow`, `textsize` |
| `NumberInput` | Numeric stepper input with decrement/increment buttons and min/max clamping. | `bind:value`, `min`, `max`, `step`, `variant`, `size`, `shape`, `shadow`, `textsize` |
| `PinInput` | Multi-character OTP / verification code input with auto-advance and paste support. | `bind:value`, `length`, `mask`, `variant`, `size`, `shape`, `shadow`, `textsize`, `oncomplete` |
| `TextArea` | Multi-line text input with optional character counter and label/error wrapper. | `bind:value`, `rows`, `maxlength`, `showCount`, `variant`, `shape`, `shadow`, `textsize`, `label`, `error` |
| `Select` | Custom dropdown selector with keyboard navigation and outside-click handling. | `options`, `bind:value`, `placeholder`, `variant`, `size`, `shape`, `shadow`, `textsize`, `label`, `error` |
| `Checkbox` | Accessible checkbox control with checked, indeterminate, and label support. | `bind:checked`, `indeterminate`, `label`, `shape`, `shadow`, `textsize`, `disabled` |
| `Radio` | Single radio button option. | `name`, `value`, `bind:group`, `label`, `shadow`, `textsize`, `disabled` |
| `RadioGroup` | Grouped radio options with horizontal or vertical layout. | `options`, `bind:value`, `name`, `label`, `orientation`, `shadow`, `textsize` |
| `Switch` | Animated toggle switch for boolean states. | `bind:checked`, `label`, `shape`, `shadow`, `textsize`, `disabled` |
| `Slider` | Single-thumb range slider with fill bar and optional value readout. | `bind:value`, `min`, `max`, `step`, `label`, `showValue`, `shape`, `shadow`, `textsize` |
| `RangeSlider` | Dual-thumb range slider for selecting `[min, max]` intervals. | `bind:low`, `bind:high`, `min`, `max`, `step`, `label`, `showValues`, `shape`, `shadow`, `textsize` |
| `SliderTrack` | Low-level visual track primitive with customizable fill percentage and thumb. | `percent`, `shape`, `shadow`, `disabled`, `children` |
| `RotaryDial` | Drag-interactive circular rotary knob with SVG arc indicator. | `bind:value`, `min`, `max`, `step`, `diameter`, `label`, `shadow`, `textsize` |
| `ColorPicker` | Swatch preset picker + native color input with hex readout. | `bind:value`, `swatches`, `label`, `shape`, `shadow`, `textsize` |
| `TagInput` | Multi-tag chip input supporting `Enter`/comma creation and `Backspace` removal. | `bind:tags`, `placeholder`, `maxTags`, `variant`, `shape`, `shadow`, `textsize`, `label` |
| `FileUpload` | Drag-and-drop file upload dropzone with file picker, multiple selection, and removable file list. | `bind:files`, `label`, `hint`, `accept`, `maxSize`, `multiple`, `shape`, `shadow`, `textsize`, `onfiles` |
| `Fieldset` | HTML fieldset container with styled legend, borders, padding, and disabled cascade. | `legend`, `disabled`, `surface`, `border`, `shape`, `padding`, `shadow`, `textsize` |
| `FormField` | Label, required marker, hint, and status message wrapper for custom controls. | `label`, `htmlFor`, `hint`, `error`, `messageText`, `required`, `textsize` |
| `Label` | Accessible form label primitive with optional required indicator and description text. | `for`, `required`, `description`, `size`, `textsize`, `children` |
| `Fader` | Studio level fader with tactile grooved thumb marks and vertical/horizontal orientation. | `bind:value`, `min`, `max`, `step`, `orientation`, `thumbMarks`, `showValue`, `surface`, `shape` |
| `XYPad` | Interactive 2D coordinate pad with crosshair guides, draggable puck, and value readout. | `bind:value`, `minX`, `maxX`, `minY`, `maxY`, `stepX`, `stepY`, `showValues`, `surface`, `shape` |

### 3. Display (22)

| Component | Description | Key Props |
|---|---|---|
| `Badge` | Compact inline status pill or label. | `variant`, `size`, `shape`, `shadow`, `textsize` |
| `Tag` | Categorization chip with optional dismiss button. | `variant`, `size`, `shape`, `shadow`, `textsize`, `removable`, `onremove` |
| `Counter` | Numeric notification count pill with `max` overflow formatting (e.g. `99+`). | `count`, `max`, `variant`, `shape`, `shadow`, `textsize` |
| `Dot` | Status indicator dot with pulsing ripple animation and tone variants. | `variant`, `size`, `animated`, `textsize` |
| `Status` | Status pill pairing an indicator dot and label with subtle or tinted style. | `variant`, `size`, `shape`, `lite`, `animated`, `label`, `textsize` |
| `Stamp` | Prominent square/circular icon tile for metrics, dashboard stats, or card corners. | `variant`, `size`, `shape`, `position`, `icon`, `textsize` |
| `Ribbon` | Corner ribbon banner for cards and containers with bookmark styling. | `position`, `variant`, `bookmark`, `textsize` |
| `Kbd` | Styled keyboard shortcut keycap (`⌘K`, `Esc`). | `keys`, `shape`, `shadow`, `textsize` |
| `Avatar` | User avatar with image, automatic initials fallback, and status indicator dot. | `src`, `alt`, `name`, `size`, `shape`, `shadow`, `textsize`, `status` |
| `AvatarGroup` | Overlapping stack of avatars with automatic `+N` overflow badge. | `avatars`, `max`, `size`, `shape`, `shadow`, `textsize` |
| `Alert` | Contextual status callout with semantic icon, title, and optional dismiss button. | `message`, `title`, `shape`, `padding`, `shadow`, `textsize`, `dismissible`, `ondismiss` |
| `Banner` | Full-width announcement or status strip with action and dismiss slots. | `message`, `surface`, `border`, `shape`, `padding`, `shadow`, `textsize`, `dismissible`, `action` |
| `Progress` | Horizontal progress bar with determinate percentage or indeterminate animation. | `value`, `max`, `label`, `showValue`, `indeterminate`, `shape`, `shadow`, `textsize`, `color` |
| `Meter` | Threshold-aware scalar gauge (optimal, suboptimal, critical coloring). | `value`, `min`, `max`, `low`, `high`, `optimum`, `label`, `showValue`, `shape`, `shadow`, `textsize` |
| `Bar` | Proportional data bar for inline metrics and leaderboards. | `value`, `max`, `label`, `formatValue`, `color`, `shape`, `shadow`, `textsize` |
| `Spinner` | Animated SVG loading indicator. | `size`, `color`, `label` |
| `AspectRatio` | Responsive aspect-ratio frame container (`1:1`, `16:9`, `4:3`, etc.). | `ratio`, `shape`, `surface`, `border`, `shadow` |
| `Divider` | Horizontal or vertical divider separator rule with optional centered label. | `label`, `vertical`, `border`, `textsize` |
| `Img` | Enhanced image component with aspect ratio, object-fit, fallback snippet, and shape. | `src`, `alt`, `ratio`, `fit`, `shape`, `shadow`, `loading`, `fallback` |
| `Skeleton` | Animated shimmer placeholder for loading states with line count, dimensions, and shape. | `width`, `height`, `circle`, `lines`, `shape` |
| `Table` | Responsive data table supporting declarative columns and rows sorting or compound children. | `columns`, `rows`, `caption`, `striped`, `surface`, `border`, `shape`, `shadow`, `textsize`, `cell`, `empty` |
| `Datatable` | Rich data table with search filtering, sortable column headers, row selection checkboxes, and pagination. | `columns`, `rows`, `rowKey`, `caption`, `searchable`, `pageSize`, `selectable`, `selected`, `striped`, `surface`, `shape` |

### 4. Layout (7)

| Component | Description | Key Props |
|---|---|---|
| `Container` | Centered layout wrapper with max-width, surface, border, padding, and shadow. | `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `maxWidth`, `centered` |
| `Card` | Structured surface container with optional `header` and `footer` snippets. | `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `gap`, `header`, `footer` |
| `ClickableCard` | Interactive `<button>` or `<a>` card with hover feedback and focus ring. | `href`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `disabled`, `onclick` |
| `SelectableCard` | Toggleable selection card with check indicator for single/multi-choice grids. | `bind:selected`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `onchange` |
| `SplitPane` | Resizable two-panel split container (horizontal or vertical) with drag divider. | `orientation`, `bind:ratio`, `minRatio`, `maxRatio`, `surface`, `border`, `shape`, `shadow`, `first`, `second` |
| `Grid` | Responsive CSS Grid container with explicit columns or auto-fit/auto-fill minmax tracks. | `cols`, `min`, `gap`, `padding`, `textsize` |
| `Stack` | Flexible linear stack layout container with direction, gap, alignment, and wrap options. | `direction`, `gap`, `align`, `justify`, `wrap`, `padding`, `textsize` |

### 5. Navigation (12)

| Component | Description | Key Props |
|---|---|---|
| `AppShell` | Full-viewport application frame with header, sidebar, main content, and footer regions. | `surface`, `border`, `textsize`, `sidebarWidth`, `header`, `sidebar`, `footer` |
| `Header` | Top application bar with brand, navigation, and action slots. | `surface`, `border`, `padding`, `shadow`, `textsize`, `sticky`, `brand`, `nav`, `actions` |
| `TopNav` | Horizontal navigation link bar with active item highlighting. | `items`, `bind:activeId`, `variant`, `size`, `shape`, `shadow`, `textsize`, `onselect` |
| `SideNav` | Vertical sidebar navigation supporting grouped sections, badges, and icons. | `items`, `groups`, `bind:activeId`, `variant`, `size`, `shape`, `shadow`, `textsize`, `onselect` |
| `BottomNav` | Mobile/compact bottom bar with icon + label destinations. | `items`, `bind:activeId`, `surface`, `border`, `shape`, `shadow`, `textsize`, `onselect` |
| `MobileNav` | Responsive slide-out navigation drawer with backdrop and close button. | `bind:open`, `items`, `bind:activeId`, `title`, `surface`, `border`, `padding`, `shadow`, `textsize`, `footer` |
| `Tabs` | Tabbed interface with horizontal/vertical orientation and panel content rendering. | `tabs`, `bind:activeTab`, `variant`, `size`, `shape`, `shadow`, `textsize`, `orientation`, `panel` |
| `SegmentedControl` | Single-select segmented pill/button switcher. | `options`, `bind:value`, `size`, `shape`, `shadow`, `textsize`, `onchange` |
| `Breadcrumb` | Hierarchical path trail with custom separator and active current-page state. | `items`, `separator`, `textsize`, `onnavigate` |
| `Pagination` | Page navigation bar with previous/next buttons and smart ellipsis truncation. | `bind:currentPage`, `totalPages`, `siblingCount`, `variant`, `size`, `shape`, `shadow`, `textsize` |
| `Stepper` | Multi-step workflow progress indicator (completed, current, upcoming). | `steps`, `bind:currentStep`, `orientation`, `clickable`, `shape`, `shadow`, `textsize` |
| `TreeList` | Recursive hierarchical tree view with expand/collapse and node selection. | `nodes`, `bind:selectedId`, `bind:expandedIds`, `shape`, `shadow`, `textsize`, `onselect` |

### 6. Overlays (13)

| Component | Description | Key Props |
|---|---|---|
| `Modal` | Centered backdrop overlay with Escape key and backdrop-click dismissal. | `bind:open`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `maxWidth`, `onclose` |
| `Dialog` | Structured modal with title, description, body content, and footer actions. | `bind:open`, `title`, `description`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `footer` |
| `AlertDialog` | Confirmation dialog for destructive or critical actions with confirm/cancel buttons. | `bind:open`, `title`, `description`, `confirmLabel`, `cancelLabel`, `destructive`, `onconfirm`, `oncancel` |
| `Drawer` | Slide-in edge panel (`left`, `right`, `top`, `bottom`) with header and footer slots. | `bind:open`, `placement`, `title`, `size`, `surface`, `border`, `padding`, `shadow`, `textsize`, `footer` |
| `Popover` | Floating content panel anchored to a trigger snippet with outside-click closing. | `bind:open`, `placement`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `trigger` |
| `Tooltip` | Hover/focus contextual label anchored to a trigger element. | `text`, `placement`, `shape`, `shadow`, `textsize`, `children` |
| `Anchor` | Low-level relative positioning wrapper for floating panels (`top`, `bottom`, `left`, `right`). | `open`, `placement`, `align`, `offset`, `trigger`, `content` |
| `MenuList` | Keyboard-accessible vertical action list with shortcuts, dividers, and danger states. | `items`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `onselect` |
| `DropdownMenu` | Trigger-anchored dropdown menu combining `Anchor` and `MenuList`. | `items`, `bind:open`, `placement`, `align`, `surface`, `border`, `shape`, `shadow`, `textsize`, `trigger`, `onselect` |
| `ContextMenu` | Right-click (`contextmenu`) floating menu positioned at cursor coordinates. | `items`, `surface`, `border`, `shape`, `shadow`, `textsize`, `onselect`, `children` |
| `CommandPalette` | Searchable `⌘K` command modal with grouped actions and arrow-key navigation. | `bind:open`, `items`, `placeholder`, `surface`, `border`, `shape`, `shadow`, `textsize`, `onselect` |
| `Toast` | Notification card with status coloring, title, description, and dismiss button. | `message`, `title`, `description`, `shape`, `padding`, `shadow`, `textsize`, `dismissible`, `ondismiss` |
| `ToastStack` | Fixed-viewport container for rendering a stack of active toasts. | `toasts`, `placement`, `shape`, `shadow`, `textsize`, `ondismiss` |

### 7. Typography & Disclosure (7)

| Component | Description | Key Props |
|---|---|---|
| `Accordion` | Vertically stacked expandable panels supporting single or multiple open items. | `items`, `bind:openIds`, `multiple`, `surface`, `border`, `shape`, `shadow`, `textsize` |
| `Collapsible` | Single-section expand/collapse disclosure container. | `bind:open`, `title`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize`, `trigger` |
| `Heading` | Polymorphic heading element with semantic level, text size scale, tracking, and weight. | `level`, `size`, `textsize`, `weight`, `children` |
| `Text` | Polymorphic typography primitive supporting semantic tags, tone colors, weights, and truncation. | `as`, `tone`, `textsize`, `weight`, `mono`, `truncate`, `children` |
| `Blockquote` | Styled quotation block with accent left border, author, and citation metadata. | `cite`, `author`, `surface`, `padding`, `shape`, `shadow`, `textsize` |
| `Code` | Inline monospace code span. | `shape`, `shadow`, `textsize`, `children` |
| `CodeBlock` | Multi-line code viewer with language header, optional line numbers, and `CopyButton`. | `code`, `language`, `filename`, `showLineNumbers`, `copyable`, `surface`, `border`, `shape`, `shadow`, `textsize` |

### 8. Blocks (9)

| Component | Description | Key Props |
|---|---|---|
| `FeatureGrid` | Responsive multi-column feature showcase grid with icons, titles, and badges. | `features`, `columns`, `surface`, `border`, `padding`, `shape`, `shadow`, `textsize` |
| `ChatBubble` | Conversational message bubble with sender, timestamp, status, and alignment. | `sender`, `timestamp`, `align`, `variant`, `shape`, `padding`, `shadow`, `textsize`, `avatar`, `status` |
| `BeforeAfter` | Interactive split-screen comparison slider with mouse and touch drag handle. | `beforeLabel`, `afterLabel`, `bind:position`, `shape`, `border`, `shadow`, `textsize`, `before`, `after` |
| `FlowCanvas` | Node-and-edge diagram canvas with draggable nodes and smooth Bezier SVG connectors. | `bind:nodes`, `edges`, `height`, `surface`, `border`, `shape`, `shadow`, `textsize`, `onnodeselect` |
| `Waveform` | Interactive audio waveform visualizer and scrubber with progress fill and seek support. | `peaks`, `bind:progress`, `duration`, `barWidth`, `interactive`, `surface`, `border`, `shape` |
| `Video` | Styled media card with video player, title, caption, aspect ratio, poster, and tokenized frame. | `src`, `poster`, `title`, `caption`, `controls`, `ratio`, `surface`, `border`, `shape`, `shadow` |
| `Canvas` | High-DPI auto-resizing HTML5 canvas container with draw callback and aspect ratio. | `draw`, `ratio`, `label`, `surface`, `border`, `shape`, `shadow` |
| `Carousel` | Responsive draggable and swipeable carousel slider with slide snippet, next/prev arrow buttons, and indicator dots. | `items`, `slide`, `index`, `perView`, `gap`, `draggable`, `shape`, `shadow`, `textsize` |
| `EmptyState` | Zero-state placeholder illustration with title, description, and action button slot. | `title`, `description`, `surface`, `border`, `shape`, `shadow`, `padding`, `textsize`, `icon`, `actions` |

---

## Development & Documentation Scripts

Inside the repository (`packages/fractalsvelte-ui`):

```bash
# Start the interactive component explorer & documentation site
pnpm dev

# Regenerate component metadata (src/site/doc/data/{components,props}.json)
pnpm docs:components

# Run svelte-check & TypeScript validation
pnpm check

# Build the library (dist/) + compiled CSS (dist/css/) + run publint
pnpm prepack
```

---

## License

MIT © [Fractal Design](https://github.com/fractalmandala/fractalsvelte-ui)
