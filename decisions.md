# Decisions

What is already settled about `fractalsvelte-ui`, and what is known and open. Read this before
working on the package. Never re-raise a **Settled** item as a finding; when a new fact shows a
decision was wrong, say which fact, once, under **Revisit**.

Last reviewed: 2026-11-21.

## Settled

- **Canon lives in `src/lib/internal/tokens.ts`.** 
- No component redefines a value from that list, and no component invents a second vocabulary for a prop that already has one.
- This means - usage of these in a `class=` instance is wrong: `pad-*`, `gap-*`, `text-*`, `border-`, `bg-`
- A component with a `look` prop is wrong — fix it to `variant: Variant`.
- **`Size` is the height class itself.** The frame composes `size` + `textSize` (default `text-md`).
- **Maximum customizability, minimum props.** The library exists to be shapeable, not to be configured: a new prop is the last resort, after composition (parts), the class vocabulary, snippets, `class` + `...rest`, and CSS variables (`--anchor`, `--gap`).
- Two props that always move together are one prop.
- **Variable names are fixed; values are the themer's.** fractalstyler extends one set of variables so a look can be swapped without reinventing a component. A component uses those names and never a raw value where one exists; a theme sets values for those names and nothing else. Using a variable outside the set, or not using the set, narrows what the system can do. So a value living in a theme is not a second source of truth — it is the whole point of the variable.
- **Themes are values, and they may be many.** A theme is a set of values for the fixed variables. A pack of a thousand is content, not bloat. A provider must not be structured to assume a small fixed set; a theme that fails the invariants (contrast pairs, elevation monotonicity) does not ship — that is the only gate on a theme list.
- **A computed value exists only where a decision in this file validates it.** 
- A function, derived map or helper that turns one vocabulary into another — or into a class, a length, a number — is guilty until a **decision here** states what it is for, who consumes it, and what a prop or a class cannot
  do instead. No decision, no code.
- When its last consumer goes, the decision is deleted and the code with it. The justification is never a JSDoc, never a registry file: it is one entry in this file.
- **a `tokens.ts` value set a component takes as a prop needs no argument.** Only the things built *on top* of the vocabularies have to argue.
- **No parallel registries.** There is no `props.md`, no `computed.md`, an inventory is never recorded anywhere, because it can drift.
- **`SPACES`/`Space` is the rung vocabulary** (`xs` · `sm` · `md` · `bs` · `lg` · `xl` · `2xl` · `3xl`). `Gap` and `Pad` are its class projections; `spaceValue(space)` is the only derivation, and only for a site that computes with the length.
- **`surfaceClass` justifies itself per component.** It stays only where a component needs surface *classes* because the `Surface` prop cannot express the element's composition. Where no component does, it goes, and `surfaceClasses()` needs the same proof.
- **`roving` lives in `helpers.ts`**, one copy.
- **A class the design system lacks is an extension-layer primitive.** If fractalstyler ships a class, use it; if it does not, add the smallest general primitive to the owning kit fragment (`enter-*`, `pop`, `reveal`).
- **`GROUPINGS`/`Grouping` is canon** (`contained` · `separated` · `flush`): how a group joins its members. Every group component takes `grouping`. `attached: boolean` — in `ButtonGroup`, `ToggleGroup` and `ToolbarGroup` — is that same prop under another name and is replaced by it. `contained` means one surface with the members divided and no gap; `separated` means each member has its own edges with a gap; `flush` means no outer surface and no padding, only the rules between members.
- **`Accordion` takes `surface: Surface` and `grouping: Grouping`.** How its items are surfaced is a `Surface`; whether they are boxed, separated or flush is a `Grouping`. It does not take `variant`.
- **`Tabs` takes `surface: Surface` and `grouping: Grouping`.** `TabsVariant` is deleted: underline is `flush`, pill is `separated`, enclosed is `contained`. The indicator is not a prop — it follows the grouping (`flush` rides the list's rule; the other two float an overlay pill).
- **Example coverage is transitive through composition.** A component inherits the props its kit's core demonstrates, so a demo is not repeated for its own sake: the core primitive demonstrates the full prop set, and the components built on it — or sharing its family module — inherit that. The API table always lists every prop, whatever the examples show. Nothing is written down to say which component is the core: the gate reads it from the imports, and the folder that owns the shared module is the core.
- **A theme count is never a defect.** Eight themes today, a thousand later — the number is content, not bloat, and nothing may be structured to assume a small set. A hand-written list is fine to start with; when it has to scale, a theme is data (`{ id, label, hue, chroma, tint }`) and a pack is read or generated. What it may emit is values for the fixed variable names — adding a name, or styling a component with a raw value, is the defect, never the number of themes.
- **A group owns its `grouping` classes.** The joinery differs per kit (rules, borders, or nothing), so each component maps `Grouping` to its own kit-fragment classes. It is the one kind of table that needs no further argument: the mapping is irregular and the classes are the kit's own.
- **`Tone` is its own prop, not a subset of `Variant`.** Some components take only the five tones
  (neutral, info, success, warning, danger) and must not accept primary/secondary/themed.
- **`MOTIONS`/`MotionPreset` (off, calm, playful) stay.** The motion components will take them; they are unused today because that family has not had its pass.
- **No component imports `theme`.** Components style from `[data-mode]` and the token layer; the theme runtime is for the app and the docs site. A component that imports `theme` is a defect.
- **A text-bearing component never hardcodes the text prop.** It takes `textSize` + `textColor`, and where it has a second text section, `childTextSize` + `childTextColor`. Field and Fieldset are the reference implementations. Raw `text-sm`/`text-muted`/`text-danger` in a component's markup is a defect, not a style preference.
- **Text alignment is its own prop.** `TextAlign` (`left` · `center` · `right`) in `tokens.ts`, classed `ta-l` · `ta-c` · `ta-r`. A component that renders text the user cannot target with `class` exposes `textAlign`.
- **Container alignment is `AlignContent`.** `xleft` · `xcenter` · `xright` · `xbetween`, plus the mobile compounds (`xcenter mleft`, `xright mleft`): the styling system's own idiom, where the second word left-aligns below the mobile breakpoint. It applies to flex and grid containers only.
- **`Align` is deleted.** Text alignment is `TextAlign`, container alignment is `AlignContent`. `between` is a container value (`xbetween`), never a text one.
- The page prose (name, summary, description, features, accessibility, keyboard, parts, api, related) is a `<!-- doc { … } -->` JSON block in the component folder's `comments.md`. A kit folder may hold `<!-- doc:<slug> { … } -->` blocks for group prose; the component's own block wins. `scripts/lib/comments.ts#readDocBlock` reads it, `api.json` carries it as `summary`, `description` and `doc`, and the gate no longer requires a manifest to exist.
- **No JSDoc, no annotations in source.** Not in a component, not on a helper, not as a justification. A component's prose lives in its folder's `comments.md` (`pnpm comments:strip` moves it there, `comments:restore` puts it back; the strip merges and never drops the `<!-- doc … -->` block). A decision lives in this file. Source comments are not a third place.
- **`internal/` and `motion/` get a `comments.md` each.** They are not component folders, but their source carries prose today; it moves to one file per folder rather than living in the source. Same strip machinery, one file, no per-file annotation.
- **`dist/` is output, never a snapshot.** `svelte-package` writes compiled `.js` and `.d.ts` there, and restoring sources from it produces a tree of typeless JavaScript. Rollback is `git`; `pnpm verify` tells you whether a folder is sound. `dist/` and `priors/` stay gitignored.
- A folder under `components/` that is not listed in `kits.ts` is an error, never a new kit.
- **The core is a work order, not a folder.** No physical `core/` kit: primitives stay in their kits and are tracked by in-degree — Field 17, Button 17, Dialog 10, IconButton 6.
- **The twin rule.** A new component starts from an existing exemplar's shape, names and order. Field is the twin for every input. Button becomes the twin for actions once its pass is done.
- **Examples climb the ladder.** `h-md`, `h-lg`, `h-xl` in demos — never `h-xs` (too short for text) and never `h-2xl`/`h-3xl` (too tall). `examples/01-*` is always the minimal usage, each example starts with `<!-- @example Title :: One sentence. -->`, and no other comments belong in an example.
- **A component must not inherit a container's text alignment.** Field sets `ta-l` on its root; a centred stage (`xcenter` also sets `text-align: center`) otherwise leaks into labels and hints.
- **Verification is `pnpm verify <kit>/<name>`**, plus `svelte-check` for the tree and a look at the running page. `svelte-check` stays at 0 errors. The gate is the contract; the types are not.

- **The dark theme's structure is cool and fixed; the accent is the only saturated thing.** Greys,
  borders, inks and the neutral ramp sit on hue 265 at chroma <= 0.01 regardless of `--hue`, so a warm
  theme never turns the interface brown. `--theme-color` keeps the theme's hue and chroma. Elevation
  ascends by ~0.04 OKLCH lightness per step (bg 0.165 → surface 0.205 → panel 0.245 → overlay 0.285),
  each step a 1.07-1.13 contrast ratio, with borders rather than shadow carrying the separation.
- **A semantic ramp runs wash → ink in both modes.** `-00` is the surface wash a message sits on and
  `-100` the ink that reads on it; in dark the prop flips direction but the meaning does not. The
  single token (`--danger`) is an ink between `-75` and `-100` and shares its ramp's hue exactly — the
  pair and the ladder must never drift apart, which is what the old set did (success at 149.6 next to
  a 138 ramp).

- **`Surface` is the prop for fill + border + shadow + rim together.** fractalstyler says so in its
  own source: `.elevated`, `.glass`, `.paneled` and `.overlayed` each set `background-color`, `border`
  and `box-shadow: var(--shadow-rim), var(--shadow-md)` in one rule. So `border`, `rim`, `shad-*` and
  the `bg-*` fills are *ingredients of a surface*, not separate axes, and `glass rim shad-md border
  bg-overlay` on one element is one surface spelled twice (`class/surface-composed`). A lone `border`
  on a divider is still legal; two or more ingredients on one element without a surface class is a
  surface built by hand.
- **A canon literal is a defect where the caller owns the element.** The discriminator is the
  element, not the prop: on a component's **root** — the tag that carries `class` and the rest props —
  every canon prop class is unreachable and must come through a prop (`pad-xs gap-bs` on a card's
  root is a defect). On an **inner** element an inset, a measure or a gap is the component's own
  chrome and stays a literal; a prop for each is the bloat this canon exists to prevent. The text
  prop is the exception either way: text a consumer reads is always theirs, so `textSize`/`textColor`
  and one `child*` pair are reported wherever they appear — except on a glyph, which fractalstyler
  sizes with the text ladder because there is no icon prop (`class/hardcoded-prop`).

- **The table family keeps its own typography, spacing and alignment.** `TableSize`, `TableAlign` and
  `ColumnAlign` stay theirs: a table's row height, cell inset and column alignment are tuned against
  each other and against the data, not taken from a global step ladder. This is the one family that
  may hold vocabularies of its own, and the reason is in this line rather than in the code.

- **A component may hold a vocabulary of its own only where it names a domain, never a style.** A
  styling value belongs in `tokens.ts`; a domain value names something the component models, and
  renaming it to a canon word would misdescribe it. The allowed list is exactly this, and nothing may
  be added to it without a line here:

  | vocabulary | names |
  |:--|:--|
  | `AccordionType` | one panel open or many |
  | `SortDirection` | ascending or descending |
  | `AvatarStatus` | presence: online, away, busy, offline |
  | `QrCodeEcc` | error-correction level L, M, Q, H, as the QR standard defines them |
  | `MeterRegion` | optimum, suboptimum, even-less-good — the `<meter>` element's own three regions |
  | `StepStatus` | complete, current, upcoming, error |
  | `TabsActivation` | automatic or manual, the ARIA term for when a tab activates |
  | `DialogScrollBehavior` | whether the body behind the dialog scrolls |
  | `PopoverTrigger` | click, hover or manual |
  | `DateFormat` | short, medium, long — the `Intl` presets |
  | `TimeGranularity` | hour, minute, second |
  | `DateGranularity` | day, month, year |
  | `EditableType` | the segments a date field edits |
  | `ColorFormat` | hex, rgb, oklch — an output format, not a style |
  | `CropHandle` | the eight resize handles |
  | `CustomizerSection` | which sections a customizer shows |

  Every other local vocabulary is either canon (`Size`, `Shape`, `Surface`, `Placement`, `Measure`,
  `Grouping`, `TextAlign`, `Tone`, `Gap`, `Pad`) or a defect. `TableSize`, `TableAlign` and
  `ColumnAlign` are the exception under the table rule above.

- **Any imported component's props are extended by the importing component.** A component that renders
  another and passes its props as literals freezes them: nobody using `Dialog` can make its close
  button `primary`. Each rendered child takes one bag per role, typed
  `ComponentProps<typeof Child>` (or `Partial<…>` where the child has required props) and spread after
  the defaults, with `class` composed so the caller's class adds rather than replaces
  (`class/frozen-child`). One bag per role, never one prop per child prop.

- **A prop is named for the decision it carries.** `look`, `soft` and their kind are not prop names —
  they name a speed of the eye, not a decision. The name is `variant`, `surface`, `tone`, `ink`, `line`,
  `ring` or `gradient`, whichever the values actually are (`props/banned-name`).

## Known and open (do not report again; check whether fixed)

- `actions/link` still types its ink as `look?: 'theme' | 'plain' | 'subtle'`, and `Text`,
  `GlowCard` and `GradientText` carry a local `look` of their own. A `look` prop is not allowed;
  these four need their pass (the name changes, so the public prop list changes with it).
- `.rail-backdrop` in `styles/layers/components/navigation.css` sits outside its
  `@media (max-width: 768px)` block, so `SidebarNav` paints a full-viewport backdrop at desktop
  widths too.
- `theme/theme.svelte.ts` types fractalstyler's preset list out by hand, eight entries, while the
  values live in fractalstyler's `colors-themes.css`. The number of themes is not the problem — the
  hand copy is: it decides which themes this package can offer, so it should be read from the
  stylesheet or generated.
- fractalstyler's own package declares a `./presets` export that points at `dist/presets.svelte.js`,
  which is not in the build, and its theme values exist only inside `colors-themes.css`. There is no
  data export of the theme list to read.
- `Tabs`'s enclosed list paints itself with `bg-input`, the form kit's fill, instead of the fill of
  the `Surface` it is given.
- `.indicator` has no bare declaration in the extension layer — only `.indicator.rule` — so the
  token `indicator` is unknown to the styling linter.
- fractalstyler has no "align-items: center without text-align: center" utility — `.xcenter` couples
  them — so any row that centres content leaks centring into its text.
- `bleed-full` is `width: 100vw`, so its own demo is clipped inside the docs stage; an unscoped
  demo needs a change in `layout.css`.
- `priors/` (untracked, gitignored) duplicates the pre-pass tree; delete it once the prose is filled in.
- Everything since `5baa8fb` is **uncommitted** (the Field pass, the `doc.ts` → `comments.md`
  migration, the linter rules, `decisions.md`, `AGENTS.md`, and the sweep to a clean gate).

- **A dedicated sizes example may show the whole ladder.** `coverage/value` requires every `Size`
  value to appear in an example, while every other example stays on `h-md`/`h-lg`/`h-xl`. Both hold
  by keeping the extremes in the one example whose subject is the ladder, and nowhere else.

## Revisit

- **Input variants.** `variant` on an input honours `outline`, `secondary` (the tinted surface) and
  `ghost`; every other canon value falls back to `outline`. Open: should an input take a brand or
  status fill, and which values with what look?
- **`Field`'s required marker** stays `text-danger` and its label weight stays `weight-500`; both are
  semantic, not part of the text prop. Revisit only if the marker should follow `textColor`.
