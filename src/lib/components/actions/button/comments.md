# comments — components/actions/button

<!-- doc
{
	"name": "Button",
	"summary": "Triggers an action or navigates, with a spring-loaded press.",
	"description": "The button is the library's reference component: eleven variants, six sizes and five shapes.\n\nIt renders a native `<button>` — or an `<a>` when you pass `href` — and forwards every attribute and event to it. Pressing it drives a real spring through the motion channel rather than a CSS keyframe, so a quick tap and a long hold both feel right.",
	"features": [
		"Eleven variants, five sizes, five shapes — shared with every other control",
		"Leading and trailing icons from @fractaldesign/icons, plus leading and trailing snippets",
		"Loading state that keeps the layout stable",
		"Renders a link when given href; a disabled link stays an anchor with aria-disabled",
		"Interruptible spring press, disabled under reduced motion"
	],
	"accessibility": [
		"Renders a native <button>, or an <a> when href is set. A disabled or loading link keeps the <a>, drops href, and sets aria-disabled and tabindex=\"-1\".",
		"While loading, the button is disabled and exposes aria-busy=\"true\".",
		"An icon-only button needs an aria-label; icons are decorative and hidden from assistive technology.",
		"The focus ring is drawn only for keyboard focus (:focus-visible)."
	],
	"keyboard": [
		{
			"keys": "Enter / Space",
			"action": "Activates the button."
		},
		{
			"keys": "Tab",
			"action": "Moves focus to the next focusable element."
		}
	]
}
-->

The JSDoc for this folder’s source lives here. `pnpm comments:restore` puts it back.

## Button.svelte

### `interface Props`

- `variant` :: The visual weight of the control: `primary` for the one action a view commits with, quieter values for everything else. The label ink follows it unless you set `textColor`.
- `size` :: The height from the shared ladder, `h-lg` by default — the same rung an input or select of the same size takes, so a row of controls lines up.
- `textSize` :: The label's text scale, independent of the height: a compact label in a tall target, or a roomy one beside small inputs.
- `textColor` :: The ink of the label and icons. Left unset it takes the pair the variant is designed for — `text-inverse` or `text-white` on a filled variant, `text-primary` on a quiet one.
- `shape` :: The corner shape shared with every other control; `round` makes a pill, `rect` a hard edge.
- `icon` :: A leading icon from `@fractaldesign/icons`, before the label. While `loading` the spinner takes its place.
- `iconEnd` :: A trailing icon for direction or affordance — an arrow for a step onward, a chevron for a menu.
- `leading` :: A snippet before the label, for content an icon cannot carry: a count, an avatar, a swatch.
- `trailing` :: A snippet after the label — a keyboard hint, a badge, a chevron.
- `loading` :: Swaps a spinner into the icon slot, keeps the label so the width does not jump, and blocks activation while exposing `aria-busy`.
- `block` :: Stretches the button to the full width of its container, for a form's single submit or a menu's last row.
- `href` :: Renders an anchor rather than a button, so the action can be opened in a new tab, copied or bookmarked like any link.
- `target` :: Where the link opens; `_blank` also adds `rel="noopener noreferrer"`. It means nothing without `href`.
- `pressable` :: Whether a press drives the spring. Turn it off where many small presses in a row would be noisy.
- `children` :: The label. An icon-only button needs `aria-label` instead, since its icons are hidden from assistive technology.
- `disabled` :: Removes the control from interaction and the tab order; `null` counts as unset, so an attribute passed straight through may stay null. On a link the anchor stays, without `href`.
