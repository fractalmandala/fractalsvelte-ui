# comments — components/actions/button-group

<!-- doc
{
	"name": "ButtonGroup",
	"summary": "Joins related buttons into one segmented control, or spaces them evenly.",
	"description": "A button group is layout, not behaviour: it lines its children up on one axis and, when `attached`, squares the inner corners and overlaps the hairlines so the buttons read as a single control. Each child keeps its own variant, size and handlers.\n\nGive the group a `label` so assistive technology announces what the buttons have in common. For single or multiple selection, reach for `ToggleGroup` instead.",
	"features": [
		"Attached (segmented) or spaced layout",
		"Horizontal or vertical",
		"Hovered and focused buttons rise above their neighbours so rings are never clipped",
		"Works with Button, IconButton and SplitButton children"
	],
	"accessibility": [
		"Renders role=\"group\"; pass label to name it.",
		"Every child remains an independent tab stop."
	],
	"related": [
		"button",
		"toggle-group",
		"split-button"
	]
}
-->

The JSDoc for this folder’s source lives here. `pnpm comments:restore` puts it back.

## ButtonGroup.svelte

### `interface Props`

- `label` :: The name the buttons share, set as `aria-label` on the group, so assistive technology says what the members have in common before it reads them.
- `orientation` :: Whether the buttons run across or down; a vertical group stacks them so each takes the group's full width.
- `gap` :: The space between members, from the space ladder. Any gap also separates them, so each button keeps its own corners instead of the joined look.
- `shape` :: The corner of the joined control — the outer radius of a segmented group, the corner of every button in a spaced one. `modern` by default.
- `attached` :: Whether the group reads as one segmented control, with inner corners squared and hairlines overlapped, or as buttons that stand apart. On by default.
- `children` :: The buttons. Each keeps its own variant, size and handler; the group only decides how they join.
