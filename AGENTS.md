# AGENTS

name - fractalsvelte-ui
description - A complete SvelteKit component super-library — component kits, spring physics, motion, view transitions and parametric themes — styled only with fractalstyler. A component and its documentation are one unit.
type - sveltekit (library + docs site)
status - current
tags - svelte package, svelte 5, sveltekit 3, fractalstyler

---

This file is the **contract**. Every rule below is enforced by a script
(`pnpm gate`, `pnpm lint`, `pnpm check`). If a rule and a script disagree, the
script is the truth — fix the file, never the gate.

## 0. Commands

| | |
|:---|:---|
| `pnpm dev` | the docs site (every component page is generated from the component folder) |
| `pnpm gen` | regenerate everything generated: `custom.css`, spring tokens, the barrel, `api.json` |
| `pnpm verify <kit>/<name>` | gen + gate + lint + type-check for ONE component — run this before you say "done" |
| `pnpm verify <kit>` | the same, for a whole kit |
| `pnpm gate` | the component↔docs contract for the whole library |
| `pnpm lint` | the fractalstyler closed-world linter |
| `pnpm check` | gen + svelte-check + lint + gate (the whole tree) |
| `pnpm build` | docs site + the publishable package |

Node 26, pnpm 11, Svelte 5.57 (runes only), SvelteKit 3, TypeScript 6 strict.

## 1. The two laws

### Law 1 — fractalstyler only

Styling is **composition of registered classes in markup**. Nothing else.

- NO `<style>` blocks. NO `style="…"`. NO `style:prop` directives.
- NO raw hex colours, NO pixel literals above 2px, NO literal `border-radius`.
- NO inline `<svg>` and NO unicode glyph icons — icons are
  `import { Icon } from '@fractaldesign/icons'` +
  `import { luCheck } from '@fractaldesign/icons/lucide'` → `<Icon icon={luCheck} />`.
  (Check a name exists: `grep -c "luName\b" node_modules/@fractaldesign/icons/dist/lucide.d.ts`.)
- Every class must exist in **fractalstyler's registry**
  (`node_modules/@fractaldesign/fractalstyler/registry.md` — read it) or in the
  **fractalsvelte-ui extension layer** (`src/lib/styles/layers/*.css` — read them; they
  are short).
- Modifiers are never standalone: `.row.xcenter`, never a bare `.xcenter`.
- There is no `.w-*`, `.pad-x-*`, `.border-top`. Search the registry; never guess.

**Dynamic values travel through custom properties.** JavaScript may write
*only* custom properties — `node.style.setProperty('--x', …)` — and a class
owns the real property (`translate: calc(var(--mx, 0) * 1px) …`). Use the
`vars()` attachment (`src/lib/motion`) to bind values:
`<div class="fill" {@attach vars({ value: 0.4 })}>`. Never assign
`node.style.transform = …` or any real property.

**The extension layer is small on purpose.** Compose first. If the system
genuinely cannot express something, add the *smallest general primitive* to
your kit's fragment `src/lib/styles/layers/kits/<kit>.css`:

- plain CSS, tokens only (`var(--space-*)`, `var(--radius-*)`, colour roles),
  `rem`/`em`/`%` — no px above 2, no hex, no `&` nesting;
- named in the system's voice (`.track`, `.thumb`, `.indicator`) — a
  primitive several components could use, not `.my-component-inner`;
- hard budget: **90 lines per kit fragment**. The gate fails above it;
- only edit your own kit's fragment. Never edit `custom.css` (generated) or
  another layer file. After editing run `pnpm gen`.

### Law 2 — a component and its documentation are one

A component is a **folder**. It is not done until the folder passes
`pnpm verify <kit>/<name>`:

```
src/lib/components/<kit>/<name>/        # <name> is kebab-case
  <Name>.svelte                         # the primary component (PascalCase of <name>)
  <NamePart>.svelte …                   # optional further parts (DialogTitle.svelte)
  <name>.svelte.ts | <name>.ts          # optional logic/state modules
  index.ts                              # named exports of every public thing
  doc.ts                                # the documentation manifest
  examples/01-usage.svelte              # ≥ 1, ordered by numeric prefix
  examples/02-….svelte
```

The docs page is **generated** from that folder — you never write a route:

- **Install / import** — generated from the package name and `index.ts`.
- **Examples** — each example file is rendered live *and* shown as source
  (the same file, so demo and code cannot drift).
- **API tables** — extracted from each part's `interface Props` and its JSDoc.
- **Accessibility / keyboard** — from `doc.ts`.

What the gate requires:

1. `index.ts` exports the primary component and every part
   (`export { default as Button } from './Button.svelte';`).
2. Every exported `.svelte` part declares `interface Props` in its instance
   script. **Every prop has a JSDoc comment** (one sentence or more). Defaults
   are documented by the destructuring default or an explicit `@default` tag.
3. `doc.ts` default-exports `defineDoc({...})` (shape below), nothing empty.
4. Each example starts with the header line
   `<!-- @example Title :: One sentence describing what it shows. -->`
   and example 01 is the minimal usage.
5. **Coverage — nothing is left out.** Across the folder's examples:
   every value of every string-literal-union prop (`variant`, `size`, `shape`,
   `placement`, …) appears; every prop name declared in `Props` (of every part)
   appears. (`class`, `children`, `ref` are exempt.)
6. Law 1, statically: no style blocks/attributes/directives, no `<svg`, no
   `.style.` writes other than `setProperty('--…')`, and every class token in a
   `class="…"` / `class={…}` literal is registered.
7. Inside `src/lib`, imports are **relative** (no `#lib`, no `$lib`). Examples
   import only from `@fractaldesign/fractalsvelte-ui` (and `/motion`, `/theme`),
   `@fractaldesign/icons*`, and `svelte*` — exactly what a consumer would write.

### `doc.ts`

```ts
import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'Button',                       // the primary export
	summary: 'One sentence. Shown in the index and the page header.',
	description: `One to three paragraphs. Blank line = new paragraph. \`code\` allowed.`,
	parts: { ButtonGroup: 'One line: what this part is for.' },   // optional, every non-primary .svelte export
	features: ['Spring-pressed', '…'],    // optional bullets
	accessibility: ['Renders a native <button> …'],               // ≥ 1
	keyboard: [{ keys: 'Enter / Space', action: 'Activates the button.' }],   // when interactive
	api: [{ name: 'toast(message, options?)', type: '(…) => string', description: '…' }], // non-component exports
	related: ['icon-button']              // optional slugs
});
```

## 2. Authoring conventions

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { sizeClass, type Size, type Shape, type Variant } from '../../../internal/tokens.js';

	interface Props extends HTMLButtonAttributes {
		/** The visual style of the button. */
		variant?: Variant;
		/** The control height and text scale. */
		size?: Size;
		/** The content. */
		children?: Snippet;
	}

	let { variant = 'primary', size = 'md', class: klass, children, ...rest }: Props = $props();
</script>

<button class={['button', variant, sizeClass[size], klass]} {...rest}>
	{@render children?.()}
</button>
```

- Runes only: `$props`, `$state`, `$derived`, `$effect`, `$bindable`,
  `$props.id()` for ids. Snippets, never slots. `{@attach}`, never `use:`.
  Callback props (`onchange`), never `createEventDispatcher`.
- `class` is always accepted and merged last via the array form
  `class={['…', cond && '…', klass]}`. Spread `...rest` onto the root element
  and extend the matching `svelte/elements` attribute type.
- Two-way state is `$bindable()` **and** has a callback
  (`value = $bindable()`, `onValueChange`). Works controlled and uncontrolled.
- Shared axes come from `src/lib/internal/tokens.ts` — do not redefine:
  `Variant` (`primary secondary themed outline ghost link soft info success
  warning danger`), `Size` (`xs sm md lg xl` → `sizeClass[size]`), `Shape`
  (`rect mincurved modern curved round`), `Tone` (`neutral info success
  warning danger`), `Placement`.
- Compound components share state with `createContext` from `svelte`
  (`const [getTabs, setTabs] = createContext<TabsState>()`).
- Use the platform first: native `<dialog>`, the Popover API (`popover`
  attribute), CSS anchor positioning (`.anchor` / `.floating`, see
  `src/lib/internal/floating.ts`), `<details>`, `:has()`, `@starting-style`
  enter/exit (`.pop` + `.enter-*`). JavaScript only where the platform stops.
- SSR-safe: no `window`/`document` at module or init time — only inside
  `$effect`, attachments and event handlers.
- Accessible by construction: correct roles, `aria-*` wiring, labels, focus
  management, full keyboard support (document it in `doc.ts`).
- Motion (all from `src/lib/motion`): springs for anything a user moves or
  triggers; honour reduced motion (the motion layer already does — do not
  bypass it). Prefer CSS spring tokens (`.spring.snappy`, `.pop`) for
  state-driven motion; the JS spring engine (`animate`, `SpringValue`, the
  attachments) for gestures and layout.
- No new dependencies. No `any`. No `@ts-ignore`. No TODOs.
- Aesthetic bar: restrained, precise, premium. Hairline borders, the
  elevation ladder, generous but consistent spacing from the space ladder,
  `text-secondary`/`text-muted` for hierarchy, `.rim` + `.shad-*` on raised
  surfaces, `.glass` on floating ones, tabular numerals for numbers. Examples
  use realistic content (real product copy, never "foo"/"Lorem ipsum").

## 3. Map

| | |
|:---|:---|
| `src/lib/styles/layers/*.css` | the fractalsvelte-ui extension layer — sources. `kits/<kit>.css` are the kit fragments |
| `src/lib/styles/custom.css` | GENERATED concat of the layers — fractalstyler's sanctioned `custom.css` extension point; the linter reads it |
| `src/lib/internal/` | shared tokens, floating/anchor helpers, list navigation, highlight |
| `src/lib/motion/` | spring solver, CSS spring tokens, `animate`, attachments, transitions, view transitions |
| `src/lib/theme/` | parametric theme runtime (mode, theme, hue/chroma, radius, density, motion) |
| `src/lib/components/<kit>/<name>/` | the components — see Law 2 |
| `src/lib/components/kits.ts` | the kit list (order, titles) |
| `src/lib/docs/` | `defineDoc`, doc types, GENERATED `api.json` |
| `src/lib/index.ts` | GENERATED barrel |
| `src/routes/` | the docs site — generated pages + hand-written guides |
| `scripts/` | `gen.ts`, `gate.ts`, `verify.ts` and friends |

Generated files carry a `GENERATED` banner — never edit them by hand.

## 4. House rules

- fractalstyler is consumed from `../fractalstyler` (linked). **Never edit
  anything in `../fractalstyler`.** Missing primitives go in the extension layer.
- Do not initialise git, commit, push or publish unless the user asks.
- Work only in the paths you were assigned; other agents are working in
  parallel in sibling folders. Never "fix" a sibling's files — report instead.

## 5. Motion and theme quick reference

Import inside `src/lib` from `'../../../motion/index.js'` / `'../../../theme/index.js'`;
in examples from `'@fractaldesign/fractalsvelte-ui/motion'` / `'/theme'` (also re-exported
from the root). Read the sources for the full JSDoc.

```ts
// springs — presets: 'gentle' | 'snappy' | 'bouncy' | 'stiff' | 'slow', or { stiffness, damping, mass }
springs, resolveSpring(input?), springDuration(input?), springEasing(input?), springEase(input?)

// engine — element must carry class "motion" (x y scale rotate opacity) or "tilt" (rotateX rotateY)
animate(node, { x, y, scale, rotate, opacity, rotateX, rotateY, '--custom': n }, { spring, instant, onUpdate }) → { finished, stop() }
setMotion(node, values)   getMotion(node, channel)
new SpringValue(initial, spring?)  → .current (reactive) .target .set(v, { instant })
reducedMotion.current

// attachments — {@attach name(options)}
vars({ value: 0.4 })                    // writes --value (any custom properties)
press() hover() magnetic() tilt()       // interaction springs
pointer()                               // writes --px/--py for spotlights
inView({ class: 'in' }) reveal() stagger()   // entrance; stagger writes --i on children
drag({ axis, bounds, snapBack, momentum, onDragEnd })
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

CSS side (see `src/lib/styles/layers/10-motion.css`): `.spring` + `.spring-<preset>`
for state transitions, `.pop` + `.enter-*` for anything that opens (works on
`[popover]`, `<dialog open>`, and `.open`), `.anim-in` (staggered by `--i`),
`.reveal`/`.in`, `.lift`, `.press`.
