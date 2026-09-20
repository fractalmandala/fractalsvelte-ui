import type { ComponentDoc, Prop } from './catalogue.ts';

type Entry = [slug: string, name: string, category: ComponentDoc['category'], description: string, props: Prop[], usage: string];

const p = (name: string, type: string, defaultValue: string, description: string): Prop => ({ name, type, defaultValue, description });
const req = 'required';
const snippet = '—';

/**
 * Catalogue entries for the remaining public surface: layout primitives,
 * composites, and compound families. Sub-components of compound families
 * (AnimatedSidebar*, ContextMenu*, MorphPopover*, …) are documented on their
 * family page; they are catalogue aliases pointing at the same page rather
 * than separate routes.
 */
export const additionalComponents: Entry[] = [
	// --- Layout primitives -------------------------------------------------------
	['app-shell', 'App Shell', 'Layout', 'A page frame with slots for header, sidebar, and footer around the main content region.', [p('header', 'Snippet', snippet, 'Sticky top region.'), p('sidebar', 'Snippet', snippet, 'Left navigation region.'), p('footer', 'Snippet', snippet, 'Bottom region.')], `<script>
	import { AppShell } from 'fractalsvelte/components';
</script>

<AppShell header={<header>Top bar</header>}>
	<main>Page content</main>
</AppShell>`],
	['aspect-ratio', 'Aspect Ratio', 'Layout', 'A container that preserves a width-to-height ratio for media and embeds.', [p('ratio', 'string', "'16/9'", 'CSS aspect-ratio value, e.g. 16/9 or 4/3.')], `<script>
	import { AspectRatio } from 'fractalsvelte/components';
</script>

<AspectRatio ratio="4/3">
	<img src="/photo.jpg" alt="A landscape" />
</AspectRatio>`],
	['banner', 'Banner', 'Feedback', 'A full-width announcement bar for system-level messages, with optional dismissal.', [p('variant', "'default' | 'info' | 'success' | 'warning' | 'danger' | 'themed'", "'default'", 'The semantic treatment.'), p('title', 'string', snippet, 'Optional bold heading.'), p('layout', "'inline' | 'stacked'", "'inline'", 'Row or column arrangement.'), p('dismissible', 'boolean', 'false', 'Shows a dismiss button.'), p('onDismiss', '() => void', snippet, 'Dismiss callback.'), p('icon', 'Snippet', snippet, 'Leading icon slot.'), p('action', 'Snippet', snippet, 'Trailing action slot.')], `<script>
	import { Banner } from 'fractalsvelte/components';
</script>

<Banner variant="warning" title="Scheduled maintenance" dismissible>
	The API will be read-only on Sunday.
</Banner>`],
	['blockquote', 'Blockquote', 'Typography', 'A quoted content block with optional attribution.', [p('cite', 'string', snippet, 'Attribution source rendered under the quote.')], `<script>
	import { Blockquote } from 'fractalsvelte/components';
</script>

<Blockquote cite="Ada Lovelace">
	The analytical engine weaves algebraic patterns.
</Blockquote>`],
	['breadcrumbs', 'Breadcrumbs', 'Navigation', 'A hierarchical trail showing the path to the current page.', [p('crumbs', 'Crumb[]', req, 'Ordered segments with label and optional href.')], `<script>
	import { Breadcrumbs } from 'fractalsvelte/components';

	const crumbs = [
		{ label: 'Home', href: '/' },
		{ label: 'Library', href: '/library' },
		{ label: 'Book' }
	];
</script>

<Breadcrumbs {crumbs} />`],
	['button-group', 'Button Group', 'Actions', 'A joined row or column of related buttons with shared edges.', [p('variant', "'default' | 'segmented'", "'default'", 'Joining treatment.'), p('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Direction of the group.')], `<script>
	import { Button, ButtonGroup } from 'fractalsvelte/components';
</script>

<ButtonGroup>
	<Button variant="outline">Day</Button>
	<Button variant="outline">Week</Button>
	<Button variant="outline">Month</Button>
</ButtonGroup>`],
	['calendar', 'Calendar', 'Inputs', 'A month-grid date picker with min/max bounds, disabled dates, and locale-aware labels.', [p('value', 'string | null', snippet, 'Bind to the selected date (ISO).'), p('defaultValue', 'string | null', 'null', 'Initial date for uncontrolled use.'), p('defaultMonth', 'string', snippet, 'Month displayed on open (ISO).'), p('min', 'string', snippet, 'Earliest selectable date.'), p('max', 'string', snippet, 'Latest selectable date.'), p('isDateDisabled', '(iso: string) => boolean', snippet, 'Predicate for individually disabled dates.'), p('weekStartsOn', '0 | 1', '0', 'First day of the week.'), p('locale', 'string', snippet, 'BCP 47 locale for labels.'), p('onValueChange', '(iso: string | null) => void', snippet, 'Change callback.')], `<script>
	import { Calendar } from 'fractalsvelte/components';
	let date = $state(null);
</script>

<Calendar bind:value={date} weekStartsOn={1} />`],
	['clickable-card', 'Clickable Card', 'Layout', 'A Card that behaves as a single interactive target for navigation or selection.', [p('href', 'string', snippet, 'Renders an anchor when set.'), p('disabled', 'boolean', 'false', 'Prevents interaction.'), p('onclick', '(e: MouseEvent) => void', snippet, 'Click handler.'), p('children', 'Snippet', 'required', 'Card content.')], `<script>
	import { ClickableCard } from 'fractalsvelte/components';
</script>

<ClickableCard href="/projects/12">
	<strong>Project Twelve</strong>
</ClickableCard>`],
	['collapsible', 'Collapsible', 'Layout', 'A disclosure region for progressively revealed content with a custom trigger.', [p('open', 'boolean', 'false', 'Bind to control disclosure.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.'), p('trigger', 'Snippet', snippet, 'Custom trigger; defaults to a chevron button.')], `<script>
	import { Collapsible } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<Collapsible bind:open>
	<p>Hidden details live here.</p>
</Collapsible>`],
	['form-layout', 'Form Layout', 'Inputs', 'A responsive column grid that aligns form fields and groups.', [p('cols', '1 | 2 | 3 | 4', '1', 'Column count at the desktop breakpoint.')], `<script>
	import { FormLayout } from 'fractalsvelte/components';
</script>

<FormLayout cols={2}>
	<!-- fields -->
</FormLayout>`],
	['kbd', 'Kbd', 'Typography', 'A keyboard key or shortcut chip.', [p('children', 'Snippet', req, 'Key label; compose multiple Kbd chips for shortcut chords.'), p('class', 'string', "''", 'Extra classes merged onto the root element.')], `<script>
	import { Kbd } from 'fractalsvelte/components';
</script>

<Kbd>⌘</Kbd> <Kbd>K</Kbd>`],
	['resize-handle', 'Resize Handle', 'Layout', 'A draggable divider for adjustable split layouts.', [p('value', 'number', '50', 'Bind to the split percentage.'), p('min', 'number', '10', 'Lower bound percentage.'), p('max', 'number', '90', 'Upper bound percentage.'), p('label', 'string', snippet, 'Accessible handle label.'), p('left', 'Snippet', snippet, 'Content before the handle.'), p('right', 'Snippet', snippet, 'Content after the handle.')], `<script>
	import { ResizeHandle } from 'fractalsvelte/components';
	let split = $state(40);
</script>

<ResizeHandle bind:value={split} label="Adjust sidebar" />`],
	['table', 'Table', 'Layout', 'A data table with sortable columns, optional row selection, and typed column definitions.', [p('columns', 'TableColumn<T>[]', req, 'Column definitions with value, align, sortable, render.'), p('rows', 'T[]', req, 'Row data.'), p('rowKey', '(row: T, index: number) => string', snippet, 'Stable key extractor.'), p('selectable', 'boolean', 'false', 'Adds a selection checkbox column.'), p('selected', 'string[]', snippet, 'Bind to the selected row keys.'), p('sort', 'SortState | null', snippet, 'Bind to the current sort state.')], `<script>
	import { Table } from 'fractalsvelte/components';

	const columns = [
		{ key: 'name', header: 'Name', value: (r) => r.name, sortable: true },
		{ key: 'role', header: 'Role', value: (r) => r.role }
	];
	const rows = [{ id: '1', name: 'Ada', role: 'Engineer' }];
</script>

<table>
	<Table columns={columns} rows={rows} rowKey={(r) => r.id} />
</table>`],
	['thumbnail', 'Thumbnail', 'Layout', 'A small image preview with a square or round shape and initials fallback.', [p('src', 'string', snippet, 'Image URL.'), p('alt', 'string', snippet, 'Image alternative text.'), p('fallback', 'string', snippet, 'Initials or short text when no image loads.'), p('shape', "'square' | 'modern' | 'curved' | 'round'", "'square'", 'Corner treatment.'), p('width', 'string', "'3rem'", 'CSS width.'), p('height', 'string', "'3rem'", 'CSS height.')], `<script>
	import { Thumbnail } from 'fractalsvelte/components';
</script>

<Thumbnail src="/team/maya.jpg" alt="Maya Chen" shape="round" />`],

	// --- Actions & inputs --------------------------------------------------------
	['check-indicator', 'Check Indicator', 'Inputs', 'The visual check/indeterminate box used by Checkbox, without any input semantics.', [p('state', "'checked' | 'unchecked' | 'indeterminate'", "'unchecked'", 'The visual state.'), p('disabled', 'boolean', 'false', 'Dims the indicator.')], `<script>
	import { CheckIndicator } from 'fractalsvelte/components';
</script>

<CheckIndicator state="checked" />`],
	['date-picker', 'Date Picker', 'Inputs', 'A text field backed by the Calendar grid, with bounds, clearing, and disabled states.', [p('value', 'string | null', snippet, 'Bind to the selected date (ISO).'), p('defaultValue', 'string | null', 'null', 'Initial date for uncontrolled use.'), p('placeholder', 'string', "'Pick a date'", 'Empty-state text.'), p('min', 'string', snippet, 'Earliest selectable date.'), p('max', 'string', snippet, 'Latest selectable date.'), p('isDateDisabled', '(iso: string) => boolean', snippet, 'Predicate for individually disabled dates.'), p('clearable', 'boolean', 'false', 'Shows a clear button.'), p('closeOnSelect', 'boolean', 'true', 'Closes the grid after choosing.'), p('disabled', 'boolean', 'false', 'Prevents editing.'), p('onValueChange', '(iso: string | null) => void', snippet, 'Change callback.')], `<script>
	import { DatePicker } from 'fractalsvelte/components';
	let due = $state(null);
</script>

<DatePicker bind:value={due} clearable placeholder="Pick a due date" />`],
	['color-picker', 'Color Picker', 'Inputs', 'A color field with a native picker and optional preset swatches.', [p('value', 'string', snippet, 'Bind to the selected hex value.'), p('defaultValue', 'string', "'#000000'", 'Initial color for uncontrolled use.'), p('swatches', 'string[]', '[]', 'Preset colors rendered under the field.'), p('disabled', 'boolean', 'false', 'Prevents changes.'), p('onValueChange', '(value: string) => void', snippet, 'Change callback.')], `<script>
	import { ColorPicker } from 'fractalsvelte/components';
	let color = $state('#0f766e');
</script>

<ColorPicker bind:value={color} swatches={['#0f766e', '#04825b', '#d97706']} />`],
	['combobox', 'Combobox', 'Inputs', 'A select with typeahead filtering, optional clearing, and full keyboard navigation.', [p('options', 'ComboboxOption[]', req, 'Options with label and value.'), p('value', 'string', snippet, 'Bind to the selected value.'), p('placeholder', 'string', "'Select an option'", 'Empty-state text.'), p('searchable', 'boolean', 'true', 'Enables typeahead filtering.'), p('clearable', 'boolean', 'false', 'Shows a clear button.'), p('disabled', 'boolean', 'false', 'Prevents interaction.'), p('onValueChange', '(value: string) => void', snippet, 'Change callback.')], `<script>
	import { Combobox } from 'fractalsvelte/components';
	let picked = $state('');
</script>

<Combobox
	options={[{ label: 'Design', value: 'design' }, { label: 'Engineering', value: 'eng' }]}
	bind:value={picked}
	clearable
/>`],
	['command-palette', 'Command Palette', 'Navigation', 'A searchable command launcher with grouped actions and keyboard-first navigation.', [p('open', 'boolean', 'false', 'Bind to open or close the palette.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.'), p('placeholder', 'string', "'Type a command or search…'", 'Search placeholder.'), p('label', 'string', snippet, 'Accessible dialog label.')], `<script>
	import { Button, CommandPalette } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Commands ⌘K</Button>
<CommandPalette bind:open>
	{#each commands as command}
		<button onclick={command.onSelect}>{command.label}</button>
	{/each}
</CommandPalette>`],
	['complex-selector', 'Complex Selector', 'Inputs', 'A rich selection card with title, description, and selectable state.', [p('selected', 'boolean', 'false', 'Bind to the selected state.'), p('title', 'string', snippet, 'Card heading.'), p('description', 'string', snippet, 'Supporting copy.'), p('disabled', 'boolean', 'false', 'Prevents selection.'), p('onSelectedChange', '(selected: boolean) => void', snippet, 'Selection callback.')], `<script>
	import { ComplexSelector } from 'fractalsvelte/components';
	let picked = $state(false);
</script>

<ComplexSelector title="Pro workspace" description="Unlimited projects" bind:selected={picked} />`],
	['file-input', 'File Input', 'Inputs', 'A styled file field with drag-and-drop semantics and a visible file list.', [p('accept', 'string', snippet, 'Native accept attribute, e.g. image/*..'), p('multiple', 'boolean', 'false', 'Allows multiple files.'), p('disabled', 'boolean', 'false', 'Prevents interaction.'), p('onFilesChange', '(files: File[]) => void', snippet, 'Files-changed callback.')], `<script>
	import { FileInput } from 'fractalsvelte/components';
</script>

<FileInput accept="image/*" multiple onFilesChange={(files) => upload(files)} />`],
	['icon-button', 'Icon Button', 'Actions', 'A square button that carries its accessible name through a required label.', [p('label', 'string', req, 'Accessible name; required because there is no visible text.'), p('size', "'sm' | 'md' | 'bs' | 'lg'", "'md'", 'Density.'), p('variant', "'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'soft' | 'solid'", "'ghost'", 'Visual emphasis.'), p('disabled', 'boolean', 'false', 'Prevents interaction.'), p('type', "'button' | 'submit' | 'reset'", "'button'", 'Native button type.'), p('onclick', '(e: MouseEvent) => void', snippet, 'Click handler.')], `<script>
	import { Icon } from 'fractalicons';
	import { luSettings } from 'fractalicons/lucide';
	import { IconButton } from 'fractalsvelte/components';
</script>

<IconButton label="Open settings"><Icon icon={luSettings} /></IconButton>`],
	['multi-selector', 'Multi Selector', 'Inputs', 'A listbox supporting multiple selection with keyboard toggles.', [p('options', 'SelectorOption<T>[]', req, 'Options with label and value.'), p('values', 'T[]', '[]', 'Bind to the selected values.'), p('label', 'string', snippet, 'Accessible group label.'), p('onValuesChange', '(values: T[]) => void', snippet, 'Change callback.')], `<script>
	import { MultiSelector } from 'fractalsvelte/components';
	let picked = $state(['a']);
</script>

<MultiSelector options={teamOptions} bind:values={picked} label="Assignees" />`],
	['radio-indicator', 'Radio Indicator', 'Inputs', 'The visual radio dot used by RadioList, without any input semantics.', [p('state', "'checked' | 'unchecked'", "'unchecked'", 'The visual state.'), p('disabled', 'boolean', 'false', 'Dims the indicator.')], `<script>
	import { RadioIndicator } from 'fractalsvelte/components';
</script>

<RadioIndicator state="checked" />`],
	['radio-list', 'Radio List', 'Inputs', 'A stacked radio group with single selection.', [p('options', 'SelectorOption<T>[]', req, 'Options with label and value.'), p('value', 'T', snippet, 'Bind to the selected value.'), p('label', 'string', snippet, 'Accessible group label.'), p('onValueChange', '(value: T) => void', snippet, 'Change callback.')], `<script>
	import { RadioList } from 'fractalsvelte/components';
	let plan = $state('pro');
</script>

<RadioList
	options={[{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }]}
	bind:value={plan}
	label="Plan"
/>`],
	['rating', 'Rating', 'Inputs', 'A star-based rating control with keyboard support and read-only mode.', [p('value', 'number', snippet, 'Bind to the current rating.'), p('defaultValue', 'number', '0', 'Initial rating for uncontrolled use.'), p('max', 'number', '5', 'Maximum star count.'), p('disabled', 'boolean', 'false', 'Prevents interaction.'), p('readonly', 'boolean', 'false', 'Display-only mode.'), p('onValueChange', '(value: number) => void', snippet, 'Change callback.')], `<script>
	import { Rating } from 'fractalsvelte/components';
	let stars = $state(4);
</script>

<Rating bind:value={stars} />`],
	['segmented-control', 'Segmented Control', 'Inputs', 'A compact single-select control of joined segments.', [p('options', 'SegmentOption<T>[]', req, 'Segments with label and value.'), p('value', 'T', snippet, 'Bind to the selected value.'), p('label', 'string', snippet, 'Accessible control label.'), p('onValueChange', '(value: T) => void', snippet, 'Change callback.')], `<script>
	import { SegmentedControl } from 'fractalsvelte/components';
	let view = $state('grid');
</script>

<SegmentedControl
	options={[{ label: 'Grid', value: 'grid' }, { label: 'List', value: 'list' }]}
	bind:value={view}
	label="View"
/>`],
	['selectable-card', 'Selectable Card', 'Inputs', 'A card that toggles selected state on click, with title and description.', [p('selected', 'boolean', 'false', 'Bind to the selected state.'), p('title', 'string', snippet, 'Card heading.'), p('description', 'string', snippet, 'Supporting copy.'), p('disabled', 'boolean', 'false', 'Prevents selection.'), p('onSelectedChange', '(selected: boolean) => void', snippet, 'Selection callback.')], `<script>
	import { SelectableCard } from 'fractalsvelte/components';
	let active = $state(false);
</script>

<SelectableCard title="Starter" description="1 project" bind:selected={active} />`],
	['selector', 'Selector', 'Inputs', 'A choice group that renders its options as selectable rows or chips.', [p('options', 'SelectorOption<T>[]', req, 'Options with label and value.'), p('value', 'T', snippet, 'Bind for single selection.'), p('values', 'T[]', snippet, 'Bind for multiple selection.'), p('type', "'single' | 'multiple'", "'single'", 'Selection mode.'), p('label', 'string', snippet, 'Accessible group label.'), p('onValueChange', '(value: T) => void', snippet, 'Single-selection callback.'), p('onValuesChange', '(values: T[]) => void', snippet, 'Multi-selection callback.')], `<script>
	import { Selector } from 'fractalsvelte/components';
	let size = $state('m');
</script>

<Selector options={[{ label: 'S', value: 's' }, { label: 'M', value: 'm' }]} bind:value={size} label="Size" />`],
	['time-picker', 'Time Picker', 'Inputs', 'A time field with step granularity, 12/24-hour formatting, and min/max bounds.', [p('value', 'string | null', snippet, 'Bind to the selected time (HH:mm).'), p('defaultValue', 'string | null', 'null', 'Initial time for uncontrolled use.'), p('step', 'number', '60', 'Minute granularity.'), p('hour12', 'boolean', 'false', 'Use a 12-hour clock.'), p('min', 'string', snippet, 'Earliest allowed time.'), p('max', 'string', snippet, 'Latest allowed time.'), p('clearable', 'boolean', 'false', 'Shows a clear button.'), p('disabled', 'boolean', 'false', 'Prevents editing.'), p('onValueChange', '(time: string | null) => void', snippet, 'Change callback.')], `<script>
	import { TimePicker } from 'fractalsvelte/components';
	let at = $state(null);
</script>

<TimePicker bind:value={at} hour12 placeholder="Pick a time" />`],
	['toggle-button', 'Toggle Button', 'Actions', 'A button with a binary pressed state.', [p('pressed', 'boolean', 'false', 'Bind to the pressed state.'), p('onPressedChange', '(pressed: boolean) => void', snippet, 'Toggle callback.'), p('disabled', 'boolean', 'false', 'Prevents interaction.'), p('onclick', '(e: MouseEvent) => void', snippet, 'Click handler.')], `<script>
	import { ToggleButton } from 'fractalsvelte/components';
	let muted = $state(false);
</script>

<ToggleButton bind:pressed={muted}>Mute</ToggleButton>`],
	['toggle-button-group', 'Toggle Button Group', 'Actions', 'A group of toggle buttons with single or multiple selection semantics.', [p('options', 'ToggleOption<T>[]', req, 'Toggle entries with label and value.'), p('type', "'single' | 'multiple'", "'single'", 'Selection mode.'), p('value', 'T', snippet, 'Bind for single mode.'), p('values', 'T[]', snippet, 'Bind for multiple mode.'), p('label', 'string', snippet, 'Accessible group label.'), p('onValueChange', '(value: T) => void', snippet, 'Single-mode callback.'), p('onValuesChange', '(values: T[]) => void', snippet, 'Multi-mode callback.')], `<script>
	import { ToggleButtonGroup } from 'fractalsvelte/components';
	let formats = $state(['bold']);
</script>

<ToggleButtonGroup
	type="multiple"
	options={[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }]}
	bind:values={formats}
	label="Formatting"
/>`],
	['toolbar', 'Toolbar', 'Actions', 'A labeled container that groups tool controls into a single accessible region.', [p('label', 'string', "'Toolbar'", 'Accessible region label.')], `<script>
	import { Toolbar, ToolbarGroup } from 'fractalsvelte/components';
</script>

<Toolbar label="Editor tools">
	<ToolbarGroup label="Text">
		<!-- controls -->
	</ToolbarGroup>
</Toolbar>`],
	['toolbar-group', 'Toolbar Group', 'Actions', 'A labeled subgroup inside a Toolbar, separating control clusters.', [p('label', 'string', req, 'Accessible subgroup label.')], `<script>
	import { Toolbar, ToolbarGroup } from 'fractalsvelte/components';
</script>

<Toolbar label="Editor tools">
	<ToolbarGroup label="Clipboard">
		<!-- controls -->
	</ToolbarGroup>
</Toolbar>`],

	// --- Feedback & overlay ------------------------------------------------------
	['confetti', 'Confetti', 'Feedback', 'A celebratory particle burst rendered on a canvas layer.', [p('colors', 'string[]', '[]', 'Particle palette; defaults to the theme accents.')], `<script>
	import { Button, Confetti } from 'fractalsvelte/components';
</script>

<Button onclick={() => celebrate()}>Publish</Button>
<Confetti {trigger} colors={['#0f766e', '#d97706']} />`],
	['cookie-consent', 'Cookie Consent', 'Overlay', 'A dismissible consent notice that persists its decision to local storage.', [p('title', 'string', "'Cookies'", 'Notice heading.'), p('description', 'string', snippet, 'Notice body copy.'), p('acceptLabel', 'string', "'Accept'", 'Accept button text.'), p('rejectLabel', 'string', "'Reject'", 'Reject button text.'), p('storageKey', 'string', "'fractalsvelte.consent'", 'Local-storage key for the decision.'), p('position', "'bottom-right' | 'bottom-left' | 'bottom-center'", "'bottom-right'", 'On-screen placement.')], `<script>
	import { CookieConsent } from 'fractalsvelte/components';
</script>

<CookieConsent description="We use cookies to improve your experience." />`],
	['countdown', 'Countdown', 'Feedback', 'A live countdown to a target time with optional days display.', [p('to', 'number | Date', snippet, 'Target timestamp; omit to count down from seconds.'), p('seconds', 'number', snippet, 'Duration in seconds when no target is given.'), p('running', 'boolean', 'true', 'Bind to pause or resume.'), p('showDays', 'boolean', 'false', 'Include a days segment.'), p('onComplete', '() => void', snippet, 'Fires when the countdown reaches zero.')], `<script>
	import { Countdown } from 'fractalsvelte/components';
</script>

<Countdown to={launchTime} showDays onComplete={() => goLive()} />`],
	['drawer', 'Drawer', 'Overlay', 'A slide-in panel anchored to a screen edge with a dismissible backdrop.', [p('open', 'boolean', 'false', 'Bind to open or close the drawer.'), p('side', "'left' | 'right'", "'right'", 'The anchored edge.'), p('dismissable', 'boolean', 'true', 'Allow backdrop and Escape dismissal.'), p('ariaLabel', 'string', snippet, 'Accessible drawer label.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.')], `<script>
	import { Button, Drawer } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open drawer</Button>
<Drawer bind:open side="right" ariaLabel="Filters">
	<!-- filter controls -->
</Drawer>`],
	['empty', 'Empty', 'Feedback', 'A placeholder for empty states with title, description, and an optional action.', [p('title', 'string', req, 'Concise heading.'), p('description', 'string', snippet, 'Supporting copy.'), p('icon', 'Snippet', snippet, 'Leading illustration or icon.'), p('action', 'Snippet', snippet, 'Primary action button.')], `<script>
	import { Button, Empty } from 'fractalsvelte/components';
</script>

<Empty title="No projects yet" description="Create your first project to get started.">
	{#snippet action()}<Button>New project</Button>{/snippet}
</Empty>`],
	['lightbox', 'Lightbox', 'Overlay', 'A full-screen image viewer with keyboard navigation between images.', [p('images', 'LightboxImage[]', req, 'Gallery entries with src and alt.'), p('open', 'boolean', 'false', 'Bind to open or close.'), p('index', 'number', '0', 'Bind to the active image index.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.'), p('onIndexChange', '(index: number) => void', snippet, 'Index-changed callback.')], `<script>
	import { Lightbox } from 'fractalsvelte/components';
	let open = $state(false);
	let at = $state(0);
</script>

<Lightbox bind:open bind:index={at} images={gallery} />`],
	['menubar', 'Menubar', 'Navigation', 'A horizontal application menu bar with nested dropdown menus per top-level entry.', [p('label', 'string', "'Application menu'", 'Accessible menubar label.'), p('children', 'Snippet', 'required', 'Compose MenubarMenu entries; see the component source for the sub-component set.')], `<script>
	import { Menubar } from 'fractalsvelte/components';
</script>

<Menubar>
	<!-- MenubarMenu entries -->
</Menubar>`],
	['more-menu', 'More Menu', 'Navigation', 'A kebab-triggered overflow menu built on the DropdownMenu contract.', [p('items', 'MenuItem[]', req, 'Menu entries; same contract as DropdownMenu.'), p('label', 'string', "'More'", 'Accessible trigger label.'), p('align', "'start' | 'end'", "'end'", 'Menu alignment.'), p('open', 'boolean', 'false', 'Bind to control open state.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.')], `<script>
	import { MoreMenu } from 'fractalsvelte/components';

	const items = [
		{ label: 'Duplicate', onSelect: () => duplicate() },
		{ label: 'Archive', onSelect: () => archive() }
	];
</script>

<MoreMenu {items} />`],
	['overlay', 'Overlay', 'Overlay', 'A backdrop layer for custom floating content with modal and dismissal options.', [p('open', 'boolean', 'false', 'Bind to show or hide.'), p('modal', 'boolean', 'true', 'Traps focus while open.'), p('closeOnBackdrop', 'boolean', 'true', 'Close on backdrop click.'), p('label', 'string', snippet, 'Accessible region label.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.')], `<script>
	import { Overlay } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<Overlay bind:open label="Cookie settings">
	<!-- floating content -->
</Overlay>`],
	['outline', 'Outline', 'Navigation', 'A compact in-page section outline for documentation sidebars.', [p('items', 'OutlineItem[]', req, 'Entries with label, href, and optional nesting.'), p('label', 'string', "'On this page'", 'Accessible region label.')], `<script>
	import { Outline } from 'fractalsvelte/components';
</script>

<Outline items={sectionLinks} />`],
	['pagination', 'Pagination', 'Navigation', 'A page navigator with numbered pages and previous/next controls.', [p('page', 'number', '1', 'Bind to the current page.'), p('total', 'number', req, 'Total page count.'), p('siblings', 'number', '1', 'Pages rendered either side of the current one.'), p('onPageChange', '(page: number) => void', snippet, 'Page-changed callback.')], `<script>
	import { Pagination } from 'fractalsvelte/components';
	let page = $state(1);
</script>

<Pagination bind:page total={12} />`],
	['popover', 'Popover', 'Overlay', 'An anchored floating surface for rich interactive content, with placement control.', [p('open', 'boolean', 'false', 'Bind to open or close.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.'), p('placement', 'Placement', "'bottom'", 'Preferred placement against the trigger.'), p('label', 'Snippet', snippet, 'Custom trigger content.'), p('trigger', 'Snippet', snippet, 'Custom trigger element; overrides label.'), p('children', 'Snippet', 'required', 'Popover body content.')], `<script>
	import { Button, Popover } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<Popover bind:open>
	{#snippet trigger()}<Button>Filters</Button>{/snippet}
	<!-- popover body -->
</Popover>`],
	['hover-card', 'Hover Card', 'Overlay', 'A non-modal preview that appears on hover or focus with directional placement.', [p('text', 'string', snippet, 'Simple text body when no snippet is needed.'), p('placement', "'top' | 'bottom' | 'left' | 'right'", "'top'", 'Placement against the trigger.'), p('delay', 'number', '150', 'Open delay in milliseconds.'), p('children', 'Snippet', 'required', 'Trigger content.'), p('content', 'Snippet', snippet, 'Rich card body.')], `<script>
	import { HoverCard } from 'fractalsvelte/components';
</script>

<HoverCard text="Team plan: unlimited projects" placement="bottom">
	<a href="/pricing">Pricing</a>
</HoverCard>`],
	['toast-item', 'Toast Item', 'Feedback', 'A single toast surface for stacking in a viewport or rendering inline.', [p('variant', "'default' | 'info' | 'success' | 'warning' | 'danger' | 'themed'", "'default'", 'The severity treatment.'), p('title', 'string', snippet, 'Brief heading.'), p('description', 'string', snippet, 'Supporting copy.'), p('duration', 'number', '5000', 'Auto-dismiss delay in ms; 0 disables it.'), p('onDismiss', '() => void', snippet, 'Dismiss callback.')], `<script>
	import { ToastItem } from 'fractalsvelte/components';
</script>

<ToastItem title="Uploaded" variant="success" onDismiss={clear} />`],
	['toast-viewport', 'Toast Viewport', 'Feedback', 'A positioned region that renders a toast list with dismissal handling.', [p('toasts', 'ToastData[]', req, 'Active toasts with id, title, and variant.'), p('position', "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'", "'bottom-right'", 'Viewport corner.'), p('onDismiss', '(id: string) => void', snippet, 'Dismiss callback by toast id.')], `<script>
	import { ToastViewport } from 'fractalsvelte/components';
</script>

<ToastViewport toasts={toasts} onDismiss={(id) => remove(id)} />`],

	// --- Navigation --------------------------------------------------------------
	['mobile-nav', 'Mobile Nav', 'Navigation', 'A responsive navigation sheet for small viewports.', [p('open', 'boolean', 'false', 'Bind to open or close.'), p('items', 'MobileNavItem[]', '[]', 'Navigation entries.'), p('label', 'string', "'Menu'", 'Accessible label.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.')], `<script>
	import { MobileNav } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<MobileNav bind:open items={navItems} />`],
	['mobile-nav-toggle', 'Mobile Nav Toggle', 'Navigation', 'The hamburger button that drives a MobileNav, with pressed-state semantics.', [p('open', 'boolean', 'false', 'Bind to the open state.'), p('label', 'string', "'Toggle menu'", 'Accessible label.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.')], `<script>
	import { MobileNavToggle } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<MobileNavToggle bind:open />`],
	['side-nav', 'Side Nav', 'Navigation', 'A vertical navigation rail with grouped links and an active indicator.', [p('groups', 'SideNavGroup[]', req, 'Grouped entries with label and items.'), p('activeValue', 'string', snippet, 'The active item value.')], `<script>
	import { SideNav } from 'fractalsvelte/components';

	const groups = [{ label: 'Workspace', items: [{ label: 'Overview', value: 'overview', href: '/overview' }] }];
</script>

<SideNav {groups} activeValue="overview" />`],
	['tab-list', 'Tab List', 'Navigation', 'An accessible tab strip with keyboard arrows and an optional panel snippet.', [p('tabs', 'Tab<T>[]', req, 'Tabs with label and value.'), p('value', 'T', snippet, 'Bind to the active tab value.'), p('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Strip direction.'), p('label', 'string', snippet, 'Accessible tablist label.'), p('panel', 'Snippet<[T]>', snippet, 'Renders the panel for the active tab.'), p('onValueChange', '(value: T) => void', snippet, 'Change callback.')], `<script>
	import { TabList } from 'fractalsvelte/components';
	let active = $state('one');
</script>

<TabList tabs={[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]} bind:value={active} />`],
	['top-nav', 'Top Nav', 'Navigation', 'A horizontal site header navigation with item and snippet support.', [p('items', 'TopNavItem[]', req, 'Entries with label, href, and optional active.'), p('label', 'string', "'Main'", 'Accessible nav label.'), p('children', 'Snippet', snippet, 'Trailing slot for actions.')], `<script>
	import { TopNav } from 'fractalsvelte/components';
</script>

<TopNav items={[{ label: 'Docs', href: '/docs', active: true }]}>
	{#snippet children()}<Button size="sm">Sign in</Button>{/snippet}
</TopNav>`],
	['top-nav-menu', 'Top Nav Menu', 'Navigation', 'A dropdown item inside a TopNav with full keyboard support.', [p('label', 'string', req, 'Trigger text.'), p('items', 'MenuItem[]', req, 'Dropdown entries; same contract as DropdownMenu.'), p('active', 'boolean', 'false', 'Marks the item as the current page.'), p('open', 'boolean', 'false', 'Bind to control open state.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.')], `<script>
	import { TopNavMenu } from 'fractalsvelte/components';
</script>

<TopNavMenu label="Resources" items={resourceItems} />`],
	['top-nav-mega-menu', 'Top Nav Mega Menu', 'Navigation', 'A full-width dropdown panel with columnar link groups for dense top-level navigation.', [p('label', 'string', req, 'Trigger text.'), p('columns', 'MegaMenuColumn[]', req, 'Column groups of links.'), p('open', 'boolean', 'false', 'Bind to control open state.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.'), p('children', 'Snippet', snippet, 'Optional featured-card slot.')], `<script>
	import { TopNavMegaMenu } from 'fractalsvelte/components';
</script>

<TopNavMegaMenu label="Products" columns={productColumns} />`],
	['top-nav-mega-menu-featured-card', 'Top Nav Mega Menu Featured Card', 'Navigation', 'A promotional card rendered inside a TopNavMegaMenu panel.', [p('title', 'string', req, 'Card heading.'), p('eyebrow', 'string', snippet, 'Small kicker line above the title.'), p('description', 'string', snippet, 'Supporting copy.'), p('href', 'string', snippet, 'Destination link.'), p('cta', 'string', snippet, 'Call-to-action text.'), p('image', 'Snippet', snippet, 'Card image slot.')], `<script>
	import { TopNavMegaMenuFeaturedCard } from 'fractalsvelte/components';
</script>

<TopNavMegaMenuFeaturedCard title="New: Motion presets" href="/blog" cta="Read more" />`],
	['tree-list', 'Tree List', 'Navigation', 'A hierarchical list with expandable nodes and single selection.', [p('items', 'TreeNode[]', req, 'Nested entries with label, id, and children.'), p('selectedId', 'string', snippet, 'Bind to the selected node id.'), p('label', 'string', "'Tree'", 'Accessible tree label.'), p('onSelectedChange', '(id: string) => void', snippet, 'Selection callback.')], `<script>
	import { TreeList } from 'fractalsvelte/components';
</script>

<TreeList items={fileTree} label="Files" />`],

	// --- Morph family (page per family root) --------------------------------------
	['morphing-tabs', 'Morphing Tabs', 'Navigation', 'Reorderable tabs whose active pill morphs between positions using shared-layout motion.', [p('items', 'MorphingTabItem[]', req, 'Tabs with label, value, and optional closeable.'), p('value', 'string', snippet, 'Bind to the active tab.'), p('defaultValue', 'string', snippet, 'Initial tab for uncontrolled use.'), p('onValueChange', '(value: string) => void', snippet, 'Change callback.'), p('onOrderChange', '(values: string[]) => void', snippet, 'Reorder callback.'), p('onClose', '(value: string) => void', snippet, 'Tab-close callback.'), p('ariaLabel', 'string', "'Tabs'", 'Accessible tablist label.')], `<script>
	import { MorphingTabs } from 'fractalsvelte/components';
	let active = $state('a');
</script>

<MorphingTabs items={tabs} bind:value={active} />`],
	['center-morph-modal', 'Center Morph Modal', 'Overlay', 'A modal that morphs from its trigger element to the screen center with shared-layout motion.', [p('open', 'boolean', 'false', 'Bind to open or close.'), p('defaultOpen', 'boolean', 'false', 'Initial state for uncontrolled use.'), p('onOpenChange', '(open: boolean) => void', snippet, 'Open-state callback.'), p('children', 'Snippet', 'required', 'Modal body; compose with CenterMorphModalTrigger/Content.')], `<script>
	import { Button, CenterMorphModal, CenterMorphModalTrigger, CenterMorphModalContent, CenterMorphModalClose } from 'fractalsvelte/components';
	let open = $state(false);
</script>

<CenterMorphModal bind:open>
	<CenterMorphModalTrigger><Button>Open</Button></CenterMorphModalTrigger>
	<CenterMorphModalContent>
		<!-- body -->
		<CenterMorphModalClose>Done</CenterMorphModalClose>
	</CenterMorphModalContent>
</CenterMorphModal>`],
	['morph-popover', 'Morph Popover', 'Overlay', 'A popover whose panel morphs from the trigger to its anchored position.', [p('children', 'Snippet', 'required', 'Compose with MorphPopoverTrigger and MorphPopoverContent.'), p('side', "'top' | 'bottom' | 'left' | 'right'", "'bottom'", 'Preferred placement.'), p('align', "'start' | 'center' | 'end'", "'center'", 'Alignment against the trigger.')], `<script>
	import { MorphPopover, MorphPopoverTrigger, MorphPopoverContent } from 'fractalsvelte/components';
</script>

<MorphPopover>
	<MorphPopoverTrigger><Button>Details</Button></MorphPopoverTrigger>
	<MorphPopoverContent><!-- panel --></MorphPopoverContent>
</MorphPopover>`],
	['morph-select', 'Morph Select', 'Inputs', 'A select whose dropdown morphs from the trigger field with shared-layout motion.', [p('options', 'SelectorOption<T>[]', req, 'Options with label and value.'), p('value', 'T', snippet, 'Bind to the selected value.'), p('placeholder', 'string', "'Select an option'", 'Empty-state text.'), p('children', 'Snippet', 'required', 'Compose with MorphSelectTrigger/Content/Item/Value.'), p('onValueChange', '(value: T) => void', snippet, 'Change callback.')], `<script>
	import { MorphSelect, MorphSelectTrigger, MorphSelectContent, MorphSelectItem } from 'fractalsvelte/components';
</script>

<MorphSelect options={options} bind:value={picked}>
	<MorphSelectTrigger />
	<MorphSelectContent>
		{#each options as option}
			<MorphSelectItem value={option.value}>{option.label}</MorphSelectItem>
		{/each}
	</MorphSelectContent>
</MorphSelect>`],

	// --- Compound family roots ----------------------------------------------------
	['animated-sidebar', 'Animated Sidebar', 'Navigation', 'A collapsible sidebar family (provider, groups, menus, rail) with spring-animated state.', [p('side', "'left' | 'right'", "'left'", 'The anchored edge.'), p('variant', "'sidebar' | 'floating' | 'inset'", "'sidebar'", 'Layout treatment.'), p('collapsible', "'icon' | 'none' | 'offcanvas'", "'icon'", 'Collapse behavior.'), p('ariaLabel', 'string', "'Sidebar'", 'Accessible label.'), p('children', 'Snippet', 'required', 'Compose with the AnimatedSidebar* sub-components.')], `<script>
	import { AnimatedSidebar, AnimatedSidebarHeader, AnimatedSidebarContent, AnimatedSidebarGroup } from 'fractalsvelte/components';
</script>

<AnimatedSidebar>
	<AnimatedSidebarHeader>Workspace</AnimatedSidebarHeader>
	<AnimatedSidebarContent>
		<AnimatedSidebarGroup><!-- links --></AnimatedSidebarGroup>
	</AnimatedSidebarContent>
</AnimatedSidebar>`],
	['shared-layout-bg', 'Shared Layout Background', 'Layout', 'A shared-layout background layer that morphs behind the active item in a list.', [p('children', 'Snippet', 'required', 'Compose with SharedLayoutBgItem entries.')], `<script>
	import { SharedLayoutBg, SharedLayoutBgItem } from 'fractalsvelte/components';
</script>

<SharedLayoutBg>
	{#each items as item}
		<SharedLayoutBgItem active={item.id === currentId}>{item.label}</SharedLayoutBgItem>
	{/each}
</SharedLayoutBg>`],
	['toast-stack', 'Toast Stack', 'Feedback', 'An animated toast collection with spring layout as items enter and leave.', [p('toasts', 'ToastData[]', req, 'Active toasts.'), p('position', 'ToastPosition', "'bottom-right'", 'Viewport corner.'), p('onDismiss', '(id: string) => void', snippet, 'Dismiss callback by toast id.')], `<script>
	import { ToastStack } from 'fractalsvelte/components';
</script>

<ToastStack toasts={toasts} onDismiss={(id) => remove(id)} />`],
	['bouncy-accordion', 'Bouncy Accordion', 'Layout', 'An accordion family with spring-animated open and close; see the family page for row parts.', [p('items', 'BouncyAccordionItem[]', req, 'Sections with title and content.'), p('open', 'string | null', snippet, 'Bind to the open section id.'), p('children', 'Snippet', 'required', 'Compose with BouncyAccordionRow entries.')], `<script>
	import { BouncyAccordion, BouncyAccordionRow } from 'fractalsvelte/components';
</script>

<BouncyAccordion>
	<BouncyAccordionRow title="First section">
		<p>Content.</p>
	</BouncyAccordionRow>
</BouncyAccordion>`],
	['code', 'Code', 'Typography', 'An inline code chip matching the documentation typography scale.', [p('children', 'Snippet', req, 'Code text to render inline.'), p('class', 'string', "''", 'Extra classes merged onto the root element.')], `<script>
	import { Code } from 'fractalsvelte/components';
</script>

<p>Run <Code>pnpm dev</Code> to start.</p>`],
	['code-block', 'Code Block', 'Typography', 'A highlighted code surface with copy affordance and terminal styling.', [p('code', 'string', req, 'The source text to highlight.'), p('label', 'string', snippet, 'Accessible block label.'), p('noCopy', 'boolean', 'false', 'Hides the copy button.')], `<script>
	import { CodeBlock } from 'fractalsvelte/components';

	const sample = "const greeting = 'hello';";
</script>

<CodeBlock code={sample} label="Example" />`]
];

/**
 * Sub-components of compound families point at their family page via
 * `aliasOf`, so every public export has a discoverable docs URL without
 * duplicating prop tables that only make sense in composition context.
 */
export const familyAliases: ComponentDoc[] = [
	{ slug: 'animated-sidebar-close', name: 'Animated Sidebar Close', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-content', name: 'Animated Sidebar Content', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-footer', name: 'Animated Sidebar Footer', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-group', name: 'Animated Sidebar Group', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-group-content', name: 'Animated Sidebar Group Content', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-group-label', name: 'Animated Sidebar Group Label', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-header', name: 'Animated Sidebar Header', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-inset', name: 'Animated Sidebar Inset', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-menu', name: 'Animated Sidebar Menu', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-menu-button', name: 'Animated Sidebar Menu Button', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-menu-item', name: 'Animated Sidebar Menu Item', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-menu-sub', name: 'Animated Sidebar Menu Sub', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-menu-sub-button', name: 'Animated Sidebar Menu Sub Button', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-menu-sub-item', name: 'Animated Sidebar Menu Sub Item', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-mobile', name: 'Animated Sidebar Mobile', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-provider', name: 'Animated Sidebar Provider', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-rail', name: 'Animated Sidebar Rail', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'animated-sidebar-trigger', name: 'Animated Sidebar Trigger', description: 'A sub-component of the animated sidebar family; documented on the family page with props and composition examples.', category: 'Navigation', aliasOf: 'animated-sidebar', props: [], usage: '' },
	{ slug: 'bouncy-accordion-row', name: 'Bouncy Accordion Row', description: 'A sub-component of the bouncy accordion family; documented on the family page with props and composition examples.', category: 'Layout', aliasOf: 'bouncy-accordion', props: [], usage: '' },
	{ slug: 'center-morph-modal-close', name: 'Center Morph Modal Close', description: 'A sub-component of the center morph modal family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'center-morph-modal', props: [], usage: '' },
	{ slug: 'center-morph-modal-content', name: 'Center Morph Modal Content', description: 'A sub-component of the center morph modal family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'center-morph-modal', props: [], usage: '' },
	{ slug: 'center-morph-modal-trigger', name: 'Center Morph Modal Trigger', description: 'A sub-component of the center morph modal family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'center-morph-modal', props: [], usage: '' },
	{ slug: 'context-menu-checkbox-item', name: 'Context Menu Checkbox Item', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-content', name: 'Context Menu Content', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-item', name: 'Context Menu Item', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-label', name: 'Context Menu Label', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-radio-group', name: 'Context Menu Radio Group', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-radio-item', name: 'Context Menu Radio Item', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-separator', name: 'Context Menu Separator', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-shortcut', name: 'Context Menu Shortcut', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'context-menu-trigger', name: 'Context Menu Trigger', description: 'A sub-component of the context menu parts family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'context-menu', props: [], usage: '' },
	{ slug: 'morph-popover-content', name: 'Morph Popover Content', description: 'A sub-component of the morph popover family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'morph-popover', props: [], usage: '' },
	{ slug: 'morph-popover-trigger', name: 'Morph Popover Trigger', description: 'A sub-component of the morph popover family; documented on the family page with props and composition examples.', category: 'Overlay', aliasOf: 'morph-popover', props: [], usage: '' },
	{ slug: 'morph-select-content', name: 'Morph Select Content', description: 'A sub-component of the morph select family; documented on the family page with props and composition examples.', category: 'Inputs', aliasOf: 'morph-select', props: [], usage: '' },
	{ slug: 'morph-select-item', name: 'Morph Select Item', description: 'A sub-component of the morph select family; documented on the family page with props and composition examples.', category: 'Inputs', aliasOf: 'morph-select', props: [], usage: '' },
	{ slug: 'morph-select-trigger', name: 'Morph Select Trigger', description: 'A sub-component of the morph select family; documented on the family page with props and composition examples.', category: 'Inputs', aliasOf: 'morph-select', props: [], usage: '' },
	{ slug: 'morph-select-value', name: 'Morph Select Value', description: 'A sub-component of the morph select family; documented on the family page with props and composition examples.', category: 'Inputs', aliasOf: 'morph-select', props: [], usage: '' },
	{ slug: 'shared-layout-bg-item', name: 'Shared Layout Bg Item', description: 'A sub-component of the shared layout bg family; documented on the family page with props and composition examples.', category: 'Layout', aliasOf: 'shared-layout-bg', props: [], usage: '' },
	{ slug: 'toast-stack-item', name: 'Toast Stack Item', description: 'A sub-component of the toast stack family; documented on the family page with props and composition examples.', category: 'Feedback', aliasOf: 'toast-stack', props: [], usage: '' }
];
