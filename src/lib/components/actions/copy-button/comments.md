# comments — components/actions/copy-button

<!-- doc
{
	"name": "CopyButton",
	"summary": "Copies text to the clipboard and confirms it with a spring-morphed check.",
	"description": "The copy button writes `text` to the clipboard and answers with a small, unmistakable change: the copy glyph shrinks away and a check springs in, then everything settles back after `timeout`.\n\nIt is icon-only by default; give it children to show a visible label that swaps to `copiedLabel`. The result is announced politely to screen readers through a live region, so the confirmation is never visual-only.",
	"features": [
		"Spring morph from copy to check, interruptible and reduced-motion safe",
		"Screen-reader announcement through an aria-live region",
		"Icon-only or labelled copy trigger",
		"onCopy callback with the copied text",
		"Shares variants, sizes and shapes with Button"
	],
	"accessibility": [
		"Renders a native <button>; an icon-only one is named by label.",
		"After a copy, copiedLabel is announced through a polite live region (role=\"status\").",
		"Does nothing, and announces nothing, if the browser refuses the clipboard write.",
		"The clipboard API needs a secure context (HTTPS or localhost)."
	],
	"keyboard": [
		{
			"keys": "Enter / Space",
			"action": "Copies the text."
		},
		{
			"keys": "Tab",
			"action": "Moves focus to the next focusable element."
		}
	],
	"related": [
		"icon-button",
		"button"
	]
}
-->

The JSDoc for this folder’s source lives here. `pnpm comments:restore` puts it back.

## CopyButton.svelte

### `interface Props`

- `text` :: What is written to the clipboard, exactly as given — the raw command or token, not the label drawn beside it.
- `label` :: The name of the action: it is the accessible name of an icon-only button and the tooltip of every one, and the copy state swaps it.
- `copiedLabel` :: What the button says for `timeout` milliseconds after a copy — the visible text of a labelled button, and the tooltip of an icon-only one.
- `timeout` :: How long the confirmation holds, in milliseconds. Longer for something a user needs to read, such as a label the copy replaces.
- `onCopy` :: Called with the copied text after the write, for a toast, an analytics event, or dismissing the field the value came from.
- `variant` :: The visual weight of the trigger, from the same set as Button; `secondary` by default so a copy affordance stays quiet beside its value.
- `size` :: The height from the shared ladder, matching the control or row the button sits in.
- `textSize` :: The label's text scale, set apart from the height for a labelled copy trigger.
- `textColor` :: The ink of the glyph and label. Left unset it follows the variant.
- `childTextColor` :: The ink of the confirming check after a copy; the success tone by default, so the change of state is visible on any variant.
- `shape` :: The corner shape; `rect` by default, so an icon-only trigger reads as a small square tool beside its text.
- `children` :: A visible label. Giving one drops the icon-only `aria-label`, and it is replaced by `copiedLabel` after a copy.
- `disabled` :: Removes the trigger from interaction when the value is not there to copy.
