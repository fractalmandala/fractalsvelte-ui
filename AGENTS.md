# AGENTS

name - fractalsvelte-ui
description - A complete SvelteKit component super-library — component kits, spring physics, motion, view transitions and parametric themes — styled only with fractalstyler. A component and its documentation are one unit.
type - sveltekit (library + docs site)
status - current
tags - svelte package, svelte 5, sveltekit 3, fractalstyler

## 0. Commands

| | |
|:---|:---|
| `pnpm dev` | the docs site (every component page is generated from the component folder) |
| `pnpm gen` | regenerate everything generated: extension CSS, spring tokens, the barrel, `api.json` |
| `pnpm gate` | the contract for the whole library (also `pnpm gate <kit>` and `pnpm gate <kit>/<name>`) |
| `pnpm verify <kit>/<name>` | gen + gate + lint + type-check for ONE component — run this before you say "done" |
| `pnpm verify <kit>` | the same, for a whole kit |
| `pnpm lint` | fractalstyler's markup and token linter |
| `pnpm check` | gen + svelte-check + lint + gate (the whole tree) |
| `pnpm comments:strip [kit[/name]]` | move a folder's JSDoc into its `comments.md` |
| `pnpm comments:restore [kit[/name]]` | put it back from `comments.md` |
| `pnpm build` | docs site + the publishable package |

Node 26, pnpm 11, Svelte 5.57 (runes only), SvelteKit 3, TypeScript 6 strict.

**Read [`decisions.md`](./decisions.md) before you touch anything.** It holds what is settled and why.
Never re-raise a settled item as a finding.

## 1. The four laws

### Law 1 — fractalstyler only

Styling is **composition of registered classes in markup**. Nothing else.

- NO `<style>` blocks. NO `style="…"`. NO `style:prop` directives.
- NO raw hex colours, NO pixel literals above 2px, NO literal `border-radius`.
- NO inline `<svg>` and NO unicode glyph icons — icons are
  `import { Icon } from '@fractaldesign/icons'` +
  `import { luCheck } from '@fractaldesign/icons/lucide'` → `<Icon icon={luCheck} />`.
- Every class must exist in **fractalstyler's registry**
  (`node_modules/@fractaldesign/fractalstyler/registry.md`) or in the
  **fractalsvelte-ui extension layer** (`src/lib/styles/layers/components/<kit>.css`).
- Modifiers are never standalone: `.row.xcenter`, never a bare `.xcenter`.

### Law 2 — variable names are fixed, values are the themer's

fractalstyler extends one set of variables so a look can be swapped without reinventing a component.

- A **component** uses those names and never a raw value where one exists. Using a variable outside
  the set, or not using the set, narrows what the system can do.
- A **theme** sets values for those names and nothing else. A value in a theme is not a second source
  of truth — it is the point of the variable. Themes may be many; the count is never a defect.

### Law 3 — a component and its documentation are one

A component is a **folder**. It is not done until `pnpm verify <kit>/<name>` passes:

```
src/lib/components/<kit>/<name>/        # <name> is kebab-case
  <Name>.svelte                         # the primary component (PascalCase of <name>)
  <NamePart>.svelte …                   # optional further parts
  <name>.svelte.ts | <name>.ts          # optional logic/state modules
  index.ts                              # named exports of every public thing
  comments.md                           # the folder's annotations + the page's own prose
  examples/01-usage.svelte              # ≥ 1, ordered by numeric prefix
```

The docs page is **generated** from that folder — you never write a route:

- **Install / import** — from the package name and `index.ts`.
- **Examples** — each example file is rendered live *and* shown as source.
- **API tables** — extracted from each part's `interface Props`, described by `comments.md`.
- **Accessibility / keyboard** — from the `<!-- doc … -->` block in `comments.md`.

### Law 4 — no annotations in source

No JSDoc, no comments as justification, nowhere in `src/lib`.

- A component's prose lives in its folder's `comments.md` (`pnpm comments:strip` moves it there,
  `comments:restore` puts it back).
- The page prose is one `<!-- doc { … } -->` JSON block at the top of that file: `name`, `summary`,
  `description`, `parts`, `features`, `accessibility`, `keyboard`, `api`, `related`, `status`. A kit folder may
  hold `<!-- doc:<slug> { … } -->` blocks for group prose; the component's own block wins.
- A **decision** lives in `decisions.md`. Source comments are not a third place.

## 2. Canonical props — `src/lib/internal/tokens.ts`

The vocabularies live in one file and no component redefines a value from it, or invents a second
vocabulary for a prop that already has one.

| axis | type | values |
|:---|:---|:---|
| visual style of a control | `Variant` | primary · secondary · themed · outline · ghost · link · info · success · warning · danger · neutral |
| height | `Size` | `h-xs` · `h-sm` · `h-md` · `h-bs` · `h-lg` · `h-xl` · `h-2xl` · `h-3xl` |
| corner | `Shape` | rect · mincurved · modern · curved · round |
| spacing between members | `Gap` | `''` · gap-xs … gap-3xl |
| spacing inside a surface | `Pad` | pad-xs … pad-2xl |
| the rung itself (for a value) | `Space` | xs · sm · md · bs · lg · xl · 2xl · 3xl |
| how a group joins its members | `Grouping` | contained · separated · flush |
| surface of a container | `Surface` | elevated · outlined · vacant · overlayed · paneled · glass |
| text scale / colour | `TextSize`, `TextColor`, `ChildTextSize`, `ChildTextColor` | text-xs … text-3xl · text-primary … text-danger |
| text alignment | `TextAlign` | left · center · right |
| container alignment | `AlignContent` | xleft · xcenter · xright · xbetween · `xcenter mleft` · `xright mleft` |
| flow | `Orientation` | horizontal · vertical |
| floating placement | `Placement` | 12 values, top … right-end |
| measure | `Measure` | measure-xs … measure-4xl · measure-full |
| table row density | `Density` | compact · cozy · comfortable |
| motion | `MotionPreset` | off · calm · playful |
| tone of a status | `Tone` | neutral · info · success · warning · danger |

The rules that follow from it:

- **A text-bearing component never hardcodes the text prop.** It takes `textSize` + `textColor`, and
  where it has a second text section, `childTextSize` + `childTextColor`. A component that renders
  text the user cannot reach with `class` also takes `textAlign`.
- **A component must not inherit a container's text alignment**: a centred stage (`xcenter` carries
  `text-align: center`) leaks into labels and hints, so a text-bearing root sets `ta-l`.
- **`Align` does not exist.** Text alignment is `TextAlign`; container alignment is `AlignContent`.
  `between` is a container value, never a text one.
- **`Tone` is its own axis** — some components take only the five tones and must not accept
  primary/secondary/themed.
- **`Size` is the height class itself.** No layer translates a scale into a height.
- **No component imports `theme`.** Components style from `[data-mode]` and the token layer.
- **Maximum customizability, minimum props.** A new prop is the last resort, after composition
  (parts), the class vocabulary, snippets, `class` + `...rest`, and CSS variables. Two props that
  always move together are one axis; a prop whose values are class names spelled differently is not
  a prop at all.
- **A computed value needs a decision.** A helper, derived map or translation between vocabularies is
  guilty until a decision in `decisions.md` says what it is for, who consumes it and what a prop or
  class cannot do instead. No decision, no code.

## 3. Examples

- `examples/01-*` is always the minimal usage; each example starts with
  `<!-- @example Title :: One sentence describing what it shows. -->` and **carries no other
  comment**. The explanation belongs in that sentence.
- **Examples climb the ladder**: show `h-md`, `h-lg`, `h-xl` — never `h-xs` (too short for text),
  never `h-2xl`/`h-3xl` (too tall). The API table always shows the full ladder.
- **Coverage is transitive through composition.** The core primitive of a kit demonstrates the full
  prop set; the components built on it, or sharing its family module, inherit that demonstration and
  need not repeat it. The API table always lists every prop, whatever the examples show.
- **Props API tables are complete; demos need not be repetitive.** Every prop of every part appears
  in the table; a demo only has to show what is new to that component.

## 4. Authoring conventions

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Size, Shape, Variant, TextSize, TextColor } from '../../../internal/tokens.js';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		textSize?: TextSize;
		textColor?: TextColor;
		shape?: Shape;
		children?: Snippet;
	}

	let { variant = 'primary', size = 'h-lg', shape = 'modern', class: klass, children, ...rest }: Props = $props();
</script>

<button class={['button', variant, size, shape, klass]} {...rest}>
	{@render children?.()}
</button>
```

- Runes only: `$props`, `$state`, `$derived`, `$effect`, `$bindable`, `$props.id()` for ids.
  Snippets, never slots. `{@attach}`, never `use:`. Callback props (`onchange`), never
  `createEventDispatcher`. No `$:`, no `<slot>`, no `on:`.
- `class` is accepted and merged last via the array form `class={['…', cond && '…', klass]}`. Spread
  `...rest` onto the root element and extend the matching `svelte/elements` attribute type.
- Two-way state is `$bindable()` **and** a callback (`value = $bindable()`, `onValueChange`).
- Compound components share state with `createContext` from `svelte`, or plain
  `getContext`/`setContext`.
- Use the platform first: native `<dialog>`, the Popover API, CSS anchor positioning (`.anchor` /
  `.floating`), `<details>`, `:has()`, `@starting-style` (`.pop` + `.enter-*`). JavaScript only where
  the platform stops.
- SSR-safe: no `window`/`document` at module or init time — only inside `$effect`, attachments and
  handlers. Never `export const x = $state()` from a `.svelte.ts`: the server shares a module across
  requests.
- Accessible by construction: correct roles, `aria-*` wiring, labels, focus management, full keyboard
  support — documented in the `comments.md` block.
- Motion (all from `src/lib/motion`): springs for anything a user moves or triggers; honour reduced
  motion. Prefer CSS spring tokens (`.spring.snappy`, `.pop`) for state-driven motion; the JS spring
  engine (`animate`, `SpringValue`, the attachments) for gestures and layout.
- No new dependencies. No `any`. No `@ts-ignore`. No TODOs.
- **The twin rule**: a new file starts from an existing exemplar's shape, names and order. Field is
  the twin for every input; Button is the twin for actions. If two twins disagree, the shape is wrong
  in one of them — say so instead of picking one.
- Aesthetic bar: restrained, precise, premium. Hairline borders, the elevation ladder, generous but
  consistent spacing from the space ladder, `text-secondary`/`text-muted` for hierarchy, `.rim` +
  `.shad-*` on raised surfaces, `.glass` on floating ones, tabular numerals for numbers. Examples use
  realistic content (real product copy, never "foo"/"Lorem ipsum").

## 5. The linter

Two tools, one engine's worth of rules, no third.

| command | what it checks | when |
|:---|:---|:---|
| `pnpm gate` / `pnpm gate <kit>/<name>` | the contract rules: folder structure, props, docs, example coverage, classes, vocabulary ↔ stylesheet parity, the extension-CSS budget | every change; `pnpm verify <kit>/<name>` runs it for one folder |
| `pnpm lint` | fractalstyler's markup and token rules: `<style>`, `style=`, unknown classes, token purity, sass nesting, hardcoded radius | every change, and in CI |
| `pnpm check` | gen + `svelte-check` + lint + gate | before a commit that touches the library |

**Reading the output.** Every diagnostic is `rule file:line  message  → fix`. The fix is prescriptive;
if the fix is not obvious from the message, the rule's *reason* is a decision in `decisions.md` — read
it before you argue with the rule.

**Resolving an issue**, in order:

1. Do what the `→ fix` says. Most rules are literal: a missing example, a prop without a description,
   a class that is not in the registry.
2. If the fix is wrong, the **rule** is wrong: fix the rule, do not suppress it. There is no
   suppression mechanism and no `--force`.
3. If the rule is right but the tree disagrees, the **tree** is wrong. Fix the component, not the
   rule.
4. If the rule contradicts a decision, stop: the decision and the rule must change together, in that
   order.

**Updating the linter when a decision changes.** A rule exists because a decision exists:

1. Change or add the entry in `decisions.md` first.
2. Change the rule in `scripts/lib/checks.ts` (component and file rules) or in
   `scripts/lib/gate-core.ts` (what the gate runs), so that the code enforces the new wording.
3. Re-run `pnpm gate`: the new rule's violations are the worklist.
4. Never keep a rule that no decision backs, and never leave a decision with no rule.

The rule groups, and the decision behind each:

| group | rules | enforced decision |
|:---|:---|:---|
| `folder/*`, `kit/*`, `index/*` | structure, exports, kit membership | Law 3 |
| `props/*` | Props declared, documented, canon-typed, axis reachable | §2 canonical props |
| `doc/*` | the `<!-- doc … -->` block: keys, summary, description, parts, accessibility, keyboard, related | Law 3 + Law 4 |
| `examples/*` | the header, no other comment, the first example, coverage of props and values | §3 examples |
| `style/*`, `icons/*`, `class/unknown`, `import/*` | Law 1, statically | Law 1 |
| `class/hardcoded-prop` | a canon prop value written into markup where only a prop can reach it | "A text-bearing component never hardcodes the text prop"; "maximum customizability, minimum props" |
| `class/surface-composed` | a `Surface` spelled as its ingredients — in markup or in a script string — or a surface class with no `surface` prop | "`Surface` is the prop for fill + border + shadow + rim together" |
| `props/banned-name` | `look`, `soft` and their kind: a prop named for a speed of the eye, not for a decision | "`look` is not a prop name" |
| `props/own-vocabulary` | a local `type X = 'a' \| 'b'` that `decisions.md` does not name | "A component may hold a vocabulary only where it names a domain"; "a computed value exists only where a decision validates it" |
| `props/frozen-child` | a rendered child component's props passed as literals, so the caller of the outer component cannot reach them | "Any imported component's props are extended by the importing component" |
| `map/identity`, `map/derivable` | a table whose values equal its keys, or follow one prefix rule — in other words, a computed value with no consumer | "A computed value exists only where a decision in this file validates it" |
| `module/duplicate-type` | the same shape declared twice, or a canon vocabulary plus private extras | "one of them owns the shape"; "a private vocabulary that is canon plus extras is still a duplicate" |
| `export/dead` | an export nobody reads | "a computed value exists only where a decision validates it" |
| `svelte/legacy`, `svelte/module-state`, `svelte/props-in-state` | Svelte 4 idioms, cross-request state, props copied into state | §4 conventions |
| `vocabulary/*`, `layer/*` | tokens ↔ fractalstyler stylesheet parity, extension budget | Law 1 + Law 2 |

## 6. Map

| | |
|:---|:---|
| `decisions.md` | **what is settled and why.** Read first; update when you settle something |
| `src/lib/internal/tokens.ts` | the vocabularies. Nothing that translates between them |
| `src/lib/internal/helpers.ts` | behaviour: anchoring, popover/dialog sync, roving, max-height, the irregular class rules |
| `src/lib/internal/highlight.ts` | the syntax tokeniser |
| `src/lib/styles/layers/components/<kit>.css` | the extension layer — kit fragments only; `components.css` is the manifest `pnpm gen` concatenates |
| `src/lib/motion/` | spring solver, CSS spring tokens, `animate`, attachments, transitions, view transitions |
| `src/lib/theme/` | parametric theme runtime. **No component imports it** |
| `src/lib/components/<kit>/<name>/` | the components — see Law 3 |
| `src/lib/components/kits.ts` | the kit list (order, titles) |
| `src/lib/docs/` | `defineDoc` types, GENERATED `api.json` and `classes.json` |
| `src/lib/index.ts` | GENERATED barrel |
| `src/routes/` | the docs site — generated pages + hand-written guides |
| `scripts/` | `gen.ts`, `gate.ts`, `verify.ts`, `comments-strip.ts`, `comments-restore.ts`, `lib/` |
| `dist/` | build output. Never a source, never a snapshot — rollback is `git` |

Generated files carry a `GENERATED` banner — never edit them by hand.

## 7. House rules

- fractalstyler is consumed from `../fractalstyler` (linked). **Never edit anything in
  `../fractalstyler`.** Missing primitives go in the extension layer.
- Do not initialise git, commit, push or publish unless the user asks.
- Work only in the paths you were assigned; other agents are working in parallel in sibling folders.
  Never "fix" a sibling's files — report instead.
- Verification is `pnpm verify <kit>/<name>`, plus `svelte-check` for the tree and **a look at the
  running page**. The gate cannot see a centred label; the eye can. `svelte-check` stays at 0 errors.

## 8. Motion and theme quick reference

Import inside `src/lib` from `'../../../motion/index.js'` / `'../../../theme/index.js'`;
in examples from `'@fractaldesign/fractalsvelte-ui/motion'` / `'/theme'`.

```ts
// springs — presets: 'gentle' | 'snappy' | 'bouncy' | 'stiff' | 'slow', or { stiffness, damping, mass }
springs, resolveSpring(input?), springDuration(input?), springEasing(input?), springEase(input?)

// engine — element must carry class "motion" (x y scale rotate opacity) or "tilt"
animate(node, { x, y, scale, rotate, opacity, rotateX, rotateY, '--custom': n }, { spring, instant, onUpdate }) → { finished, stop() }
setMotion(node, values)   getMotion(node, channel)
new SpringValue(initial, spring?)  → .current (reactive) .target .set(v, { instant })
reducedMotion.current

// attachments — {@attach name(options)}
vars({ value: 0.4 })                    // writes --value (any custom properties)
press() hover() magnetic() tilt()       // interaction springs
pointer()                               // writes --px/--py for spotlights
inView({ class: 'in' }) reveal() stagger()   // entrance; stagger writes --i on children
drag({ prop, bounds, snapBack, momentum, onDragEnd })
parallax() scrollProgress()
createFlip() → { attach, read(), play(), run(fn) }   // FLIP layout springs; items carry data-flip-id

// Svelte transitions with spring easing — transition:springScale={{ spring: 'bouncy' }}
springFade springFly springScale springBlur springSlide

// view transitions
startViewTransition(update, { type: 'fade'|'slide'|'slide-back'|'scale'|'reveal'|'none', origin })
setupViewTransitions(onNavigate, { type })    vtName('hero')   // element also needs class "vt-name"

// theme
theme (ThemeState: mode theme hue chroma tint radius density motion resolvedMode; setTheme() setMode() toggleMode(event) reset())
themes, initTheme(), themeInitScript()
```

CSS side (see `@fractaldesign/fractalstyler` `motion-animation.css`): `.spring` + `.spring-<preset>`
for state transitions, `.pop` + `.enter-*` for anything that opens (works on `[popover]`,
`<dialog open>`, and `.open`), `.anim-in` (staggered by `--i`), `.reveal`/`.in`, `.lift`, `.press`.
