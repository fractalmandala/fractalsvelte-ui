# fractalstyler ↔ fractalsvelte-ui sync audit

`fractalsvelte-ui` is supposed to be a component library built *on* `fractalstyler`: every class a component emits should already be a fractalstyler class, and every axis a component exposes should be a fractalstyler vocabulary. This is the diff of the two, by **definition** — which class names and which value vocabularies exist — not by token values, since values are meant to be themed.

- **Compared:** `packages/fractalstyler/src/lib/**/*.css` (651 class selectors) against `packages/fractalsvelte-ui/src/lib/components/**/*.{svelte,ts}` (124 components) and `packages/fractalsvelte-ui/src/lib/styles/layers/**/*.css` (the extension layer, 229 classes).
- **Not compared:** variable values (`--h-md: 20px` …). Only names, rungs and vocabularies.
- **Result:** the **class surface is in sync** — 0 emitted classes are undefined. The axis surface was in sync except five points, two of which were the library's *defaults* silently resolving to nothing. **All five are fixed in §9.**

---

## 1. Method

| Step | What |
| --- | --- |
| Styler classes | every `.name` selector in `fractalstyler/src/lib/styles/*.css` → **651** |
| Extension-layer classes | every `.name` in `fractalsvelte-ui/src/lib/styles/layers/**/*.css` → **229** (**187** unique to the UI, **42** names shared with fractalstyler) |
| Emitted statically | `class="…"`, `class={[…]}` array literals and `*Class`/`classes` maps in the 124 components → **369** distinct tokens |
| Emitted dynamically | template literals (`h-${…}`, `at-${placement}`, `gap-${…}`, `anim-…`) cannot be scanned, so each axis was verified rung by rung in §3 |

## 2. Static class audit — clean

| Bucket | Count |
| --- | --- |
| Defined in **fractalstyler** | **232** |
| Defined in the **fractalsvelte-ui extension layer** | **109** |
| **Undefined anywhere** | **0** |

The 28 tokens that matched neither set were verified individually and are not classes: data-attribute values (`dark`, `system`, `horizontal`, `top`, `lazy`, `region`, `polite`), `vars()` custom-property keys (`pattern-size`, `pattern-tone`, `ramp-max`), union members (`ellipsis`, `fade-up`, `scale-down`, `loading`), and CSS values quoted in prose (`field-sizing`, `content`, `none`, `true`).

So the two libraries agree on *what to call things*. The disagreements are all in §3.

### The 42 shared names are compositions, not redefinitions

Both libraries define `ghost`, `outline`, `danger`, `info`, `success`, `warning`, `filled`…, but in the extension layer they appear only inside compound selectors that compose with a styler class — `.button[aria-pressed='true']:is(.ghost…)`, `.msg.outline.danger`, `.fill.scaled`, `.track.slim`. No extension rule redefines a styler utility from scratch.

**One exception:**

| Class | fractalstyler | fractalsvelte-ui | Note |
| --- | --- | --- | --- |
| `.match-anchor` | `layout-shell.css:104` → `.floating.match-anchor { min-width: anchor-size(width) }` | `layers/components/actions.css:6` → `.match-anchor { min-width: anchor-size(width) }` | The UI's unscoped copy applies to *everything* with the class; fractalstyler scopes it to `.floating`. Delete the UI rule and use `.floating.match-anchor`. |

## 3. Axis audit — where the real drift is

Every axis the UI exposes, and every rung it can emit, checked against fractalstyler's definitions.

| Axis (UI definition) | fractalstyler provides | Status |
| --- | --- | --- |
| `Size` — 8 rungs (`tokens.ts:41,44`) | `h-xs…h-3xl`, `text-xs…text-3xl`, `pad-xs…pad-3xl`, `--space-*`, `--h-*` — all 8 rungs | ✅ every rung present |
| `Size` → `maxHeightClass` (`tokens.ts:212`) | `max-h-xs…max-h-3xl` — **no `max-h-bs`** (`shapes-sizes.css:68-75`) | ❌ §4.1 |
| `Gap` — 8 rungs (`tokens.ts:91`) → `var(--space-*)` | `--space-xs…--space-3xl`, `gap-xs…gap-3xl` | ✅ |
| `Align` — `left·center·right·between` (`tokens.ts:116`) | flex: `xleft·xcenter·xright·xbetween`; text: `ta-l·ta-c·ta-r` | ✅ one class per word; `between` is flex-only and text props are narrowed to the other three (§7) |
| `Shape` — `rect·mincurved·modern·curved·round` | the same five classes, each reading a radius token: `rect` → 0, `mincurved` → `--radius-sm`, `modern` → `--radius-md`, `curved` → `--radius-bs`, `round` → `--radius-full` | ✅ |
| `Variant` — 11 values | `.primary … .danger` (+ composed `.soft`, `.tint`) in `component-props.css` | ✅ |
| `Tone` — 5 values → ink classes | `text-secondary · text-info · text-success · text-warning · text-danger` (`colors-themes.css`) | ✅ |
| `Measure` — `sm·md·lg·xl·2xl·full` (`tokens.ts:130`) | `measure-xs…measure-4xl` + `wfull` | ⚠️ subset: `xs`, `3xl`, `4xl` unreachable |
| Radius tokens — `xs·sm·md·bs·lg·full` | `--radius-*` in `:root` (`shapes-sizes.css:2-7`) and one `.radius-*` class per rung (`:29-34`) | ✅ 1:1. `[data-shape='sharp'|'soft'|'round']` only **re-values** those six tokens; there is no `data-radius` |
| `Density` — `compact·cozy·comfortable` (one word: `tokens.ts`, `table.ts`, `theme.svelte.ts`) | `DENSITIES` = the same three; `[data-density='cozy']` now answers too (the base token blocks carry both selectors) | ✅ universalised |
| `ThemeMotion` — `off·calm·snappy·playful` (`theme.svelte.ts:10`) | `[data-motion='off'|'calm'|'playful']` (`configurations.css:138-140`) — **no `snappy`** | ❌ §4.3 |
| `ThemeName` — 8 themes | `[data-theme=…]` for `fractalsvelte aurora ocean ember rose lime amber mono` (+ `dark`) | ✅ all 8 present |
| `Placement` — 8 values (`tokens.ts:74`) | `PLACEMENTS` declares **12** (`types.ts:20`) but only **10** `at-*` classes exist | ❌ §4.4 (both sides) |
| `Mode` — `light·dark·system` | `[data-mode='light'|'dark']` | ✅ |

## 4. Defects (all fixed in §9 — kept as the record)

### 4.1 `max-h-bs` does not exist — `Code` height silently no-ops on the base rung
`Size` has eight rungs; fractalstyler's max-height ladder has seven (`shapes-sizes.css:68-75` skips `bs`). `maxHeightClass('bs')` therefore returns a class that styles nothing.
`Code.svelte` works around it by clamping (`bs: 'max-h-md'`), which makes `maxHeight="bs"` render **20px instead of the 27px** the word means — and the same trap is waiting for any future `maxHeight` consumer.
**Fix:** add `.max-h-bs { max-height: var(--measure-bs) }` — and `--measure-bs` itself, which fractalstyler does not define either (see §4.7) — then drop the clamp in `Code.svelte`.

### 4.2 The default density is a value fractalstyler does not define
`ThemeDensity` includes `cozy`, and `defaultTheme.density` **is** `'cozy'` (`theme.svelte.ts:9,52`). The theme runtime writes `data-density="cozy"` (`theme.svelte.ts:144`). fractalstyler only has rules for `compact` and `comfortable`, so the library's default density emits an attribute that matches nothing — the token ladder falls back to the base values, which happens to look right, so the bug is invisible until someone reads the attribute or picks "cozy" expecting a third step.
**Fix (pick one):** rename the UI's middle value to `default` (and treat the absence of the attribute as it) or add a real `[data-density='cozy']` rung in fractalstyler.

### 4.3 The default motion is a value fractalstyler does not define
Same shape, worse consequence: `ThemeMotion` includes `snappy`, `defaultTheme.motion` **is** `'snappy'` (`theme.svelte.ts:10,53`), and fractalstyler defines only `off`, `calm`, `playful` (`configurations.css:138-140`). So the default writes `data-motion="snappy"` and no rule fires — the spring stays at `--spring`'s base value, i.e. "snappy" is a label with no definition behind it. Anyone picking `off`, `calm` or `playful` *does* get a change; the default is the only value that does nothing.
**Fix:** drop `snappy` (make `playful` or `calm` the default) or add `[data-motion='snappy']` to fractalstyler.

### 4.4 Placement: the UI models 8 of 12, and fractalstyler's own 12 are 10
- fractalstyler's `PLACEMENTS` (`types.ts:20`) declares `left-start`, `left-end`, `right-start`, `right-end` as well as the eight the UI has. `fractalsvelte-ui`'s `Placement` (`tokens.ts:74`) exposes only the eight, and `placementClass` has no mapping for the other four — so four styler placements are unreachable from any component.
- fractalstyler itself is inconsistent here: `at-left-end` and `at-right-end` have **no rule** (`at-left`, `at-left-start`, `at-right`, `at-right-start` exist), while `PLACEMENTS` promises them.
**Fix:** either drop the four from `PLACEMENTS` (and document that only edge-anchored placements ship), or define `at-left-end`/`at-right-end` and widen the UI's `Placement` + `placementClass` to match.

### 4.5 `Measure` exposes 6 of fractalstyler's 8 widths
The UI's `Measure` is `sm · md · lg · xl · 2xl · full`; fractalstyler ships `measure-xs … measure-4xl` (`configurations.css`). `measure-xs`, `measure-3xl` and `measure-4xl` cannot be reached from `Container`, `Dialog` or `Drawer`.
**Fix:** widen `Measure` to `xs · sm · md · lg · xl · 2xl · 3xl · 4xl · full` — additive, no visual change.

### 4.6 Nothing type-checks the vocabulary against the CSS
fractalstyler exports no `Size`, `Shape`, `Variant`, `Tone`, `Gap` or `Align` type — only `PLACEMENTS`/`Placement`. `fractalsvelte-ui/src/lib/internal/tokens.ts` is therefore the **only** declaration of the shared vocabulary, and it is kept in step with the CSS by hand (plus `pnpm run lint`, which validates that *classes used* exist, not that *every advertised value* has one).
That is exactly how §4.1–§4.5 went unnoticed: each is a value with no class, which no TypeScript and no lint currently catches.

**Fix (structural):** define the vocabularies once in fractalstyler (export `SIZES`, `SHAPES`, `VARIANTS`, `TONES`, `GAPS`, `ALIGNS`, `MEASURES` alongside `PLACEMENTS`) and import them in `tokens.ts`; then extend the existing `lint`/`gate` with one assertion — *for every axis value, a matching class (or data-attribute rule) exists*. That single check would have caught 4.1, 4.2, 4.3 and half of 4.4 mechanically.

### 4.7 fractalstyler's own measure ladder has two holes
Found while working out the fix for §4.1:

| Problem | Evidence |
| --- | --- |
| `--measure-bs` is **used but never defined** | `.clamp-bs { max-width: var(--measure-bs) }` (`configurations.css:145`) vs the definitions at `configurations.css:94-102`, which go `xs sm md md lg xl 2xl 3xl 4xl` — no `bs`. The declaration is invalid at computed-value time, so `.clamp-bs` has no max-width at all. |
| `--measure-md` is **declared twice, with different values** | `configurations.css:96` (28rem) and `:97` (32rem). The second wins; the first is dead code that will mislead the next reader. |

Neither is caused by `fractalsvelte-ui`, but both matter here: the `bs` gap in §4.1 is the same missing rung, and any component that reaches for a `bs` measure would hit it.

## 5. Scale of the two libraries

| | fractalstyler | fractalsvelte-ui (extension layer) |
| --- | --- | --- |
| CSS files | 17 (`src/lib/styles`) | 14 (`src/lib/styles/layers/components`) |
| Classes | 651 | 229 (187 unique) |
| Lines | 1945 | 345 (17.7% — the gate's budget line) |

The extension layer's unique classes are all component-specific: `tok-*` (syntax highlighting), `avatar-*`, `ink-*`, `pattern-*`, `ring-*`, `mask-*`, `resize-*`, `timeline-*`, `fade-*`, `hint-*`, `light-*`, `range-*`, `choice-*`. That is the intended split — structure and tokens in fractalstyler, components on top — with no structural overlap.

## 6. What to change (one line per finding; the plan is §7)

**fractalstyler (definition side)**
1. Add `--measure-bs` and `.max-h-bs` (4.1, 4.7), and delete the duplicate `--measure-md` at `configurations.css:96` (4.7).
2. Add `at-left-end`, `at-right-end` — or trim `PLACEMENTS` to the 10 that exist (4.4).
3. Add a `[data-density='cozy']` rung, or accept `compact · default · comfortable` as the vocabulary (4.2).
4. Add `[data-motion='snappy']`, or drop the word (4.3).
5. Export the axis vocabularies next to `PLACEMENTS` (4.6).

**fractalsvelte-ui**
6. Delete the unscoped `.match-anchor` rule and use `.floating.match-anchor` (§2).
7. Widen `Measure` to the full width ladder (4.5), and `Placement` to whatever fractalstyler settles on (4.4).
8. Point the default `density`/`motion` at defined values (4.2, 4.3) — this one is worth doing even if fractalstyler adds the missing rules, because a default should be a value the CSS proves.
9. Remove the `bs` clamp in `Code.svelte` once 4.1 lands.
10. Add the "every axis value has a class" assertion to `scripts/gate.ts`.

## 7. Fix plan — closing every gap without moving a pixel

The rule for all of it: **fractalstyler is the source of truth and the UI follows.** Each fix is one of three shapes — *additive* (a class, token or type nothing uses yet), *type-only*, or *behaviour-preserving* (it changes a value that currently resolves to nothing). None of them re-lays out or re-colours a component.

### Phase 1 — parity, provably inert

| # | Change | Why the rendering cannot move |
| --- | --- | --- |
| 1 | **Delete `.match-anchor` from `layers/components/actions.css:6`** | All four emitters already carry `.floating`: `SplitButton.svelte:109`, `Combobox.svelte:331`, `Select.svelte:218` and `Popover.svelte:127` (onto the element at `:123`). fractalstyler's `.floating.match-anchor` declares the identical `min-width: anchor-size(width)`, so the rule that wins is the same one. |
| 2 | **`configurations.css:96`: `--measure-md: 28rem` → `--measure-bs: 28rem`**, add `.max-h-bs { max-height: var(--measure-bs) }` | The ladder then reads 14 · 20 · **28** · 32 · 36 · 48 · 64 · 80 · 100 — monotonic, which is what a duplicated `md` was hiding. `md` is unchanged (28rem never won; 32rem at `:97` did), so no existing width moves. `--measure-bs` fixes `.clamp-bs` (`:145`), which the UI does not use. `.max-h-bs` is new, so nothing resolves differently — keep `Code`'s clamp for now (see Phase 3). |
| 3 | **Placement parity**: styler adds `.at-left-end` / `.at-right-end`; the UI widens `Placement` to those 10 and adds the two `placementClass` entries | Additive on both sides. The eight values components already pass keep the same class. `PLACEMENTS` stops promising two classes that do not exist. |
| 4 | **Widen the UI's `Measure`** to `xs … 4xl` + `full`, adding entries to `Container.measureClass`, `dialog.dialogWidth` and `Dialog.outsideWidth` | Additive. Defaults (`Container` `lg`, `Dialog`/`Drawer` `md`) and the six existing widths are untouched; `measure-xs`/`3xl`/`4xl` stop being unreachable. |
| 5 | **Export the vocabularies from fractalstyler** (`SIZES`, `SHAPES`, `VARIANTS`, `TONES`, `GAPS`, `ALIGNS`, `MEASURES`, next to `PLACEMENTS`), and have `internal/tokens.ts` import them | Type- and const-only. No class a component builds changes; it just stops being declared twice. |
| 6 | **One gate assertion**: for every axis value, a matching class (or `[data-*]` rule) exists in the styler CSS | CI-only, and it is the check that would have caught 4.1, 4.2, 4.3 and half of 4.4 mechanically. |

### Phase 2 — stop writing values that do not exist

Both of these change an attribute, never a pixel, because the value being written is a value the CSS has no rule for — it already falls through to the base tokens.

| # | Change | Why it is inert |
| --- | --- | --- |
| 7 | **Density**: in `theme.svelte.ts:144` (and the boot script at `:207`), omit `data-density` when the value is the middle one (`cozy`) | `[data-density='cozy']` has no rule, so today the tokens come from `:root`. Omitting the attribute gives the same `:root` tokens. This also matches what `ThemeProvider` already does: it writes `data-density={density}` (`ThemeProvider.svelte:101`) and Svelte drops an `undefined` attribute, so subtree "base density" is already "no attribute". |
| 8 | **Motion**: the same for `snappy` | `--spring: var(--spring-snappy)` **is** the base (`configurations.css:63`); `calm` and `playful` re-point it, `off` zeroes `--motion-scale`. Writing `data-motion="snappy"` matches no rule and leaves the base spring in place — exactly what omitting does. |

**Why not rename `cozy` → `default` and `snappy` → `balanced` instead?** Because both words are persisted: `ThemeSettings` goes to `localStorage` and into the inline boot script, and both are printed in `ThemeCustomizer`/`ThemePicker`. Renaming needs a stored-value migration or it silently resets a user's saved choice — a much bigger change than the bug warrants, and it buys nothing the omission does not.

**Why not add `[data-density='cozy']` rules instead?** A `cozy` block would have to restate ~144 `--space-*`/`--h-*`/`--text-*` tokens from `gaps-pads-margins.css` — duplicating the ladder is the exact drift this audit is trying to remove.

### Phase 3 — the one intentional delta

| # | Change | Effect |
| --- | --- | --- |
| 9 | Remove the `bs → max-h-md` clamp in `Code.svelte` | `maxHeight="bs"` caps at 28rem instead of 32rem. One prop value, one component, and only for content taller than 28rem. Do it as its own commit so it can be reverted on sight. |

### Left alone on purpose

- **Alignment words are physical.** `ta-l` is `text-align: left` and `ta-c` / `ta-r` are `center` / `right` — nothing else, ever. The axis therefore speaks those words (`left · center · right · between`) instead of logical `start`/`end`, and `textAlignClass` maps one word to one class. `between` is `justify-content: space-between` only, so `textAlignClass` is typed `Record<Exclude<Align, 'between'>, string>` and the text-facing props (`TableAlign`, `ColumnAlign`, `Typography.align`) are narrowed to the other three — `between` cannot reach a text cell, and a mapping like `start → ta-l` (which would quietly mean "right" under RTL) cannot be written without a type error.
- **`start` / `end` stay where they are genuinely logical and emit no class:** `Switch.align` (which side the label sits on, by DOM order) and `InputGroupAddon.align` (a `data-align` marker; no stylesheet rule reads it). `VirtualList.scrollToIndex({ align })` also keeps `start`/`end` — it is a scroll offset, not a text edge.
- **The UI's `AvatarSize`** five-rung ladder and `Table`'s `density` words: they are component vocabularies, not styler axes, and every rung they emit has a class.

After Phases 1–2 every row in §3 reads ✅ except the `Measure`/`Placement` *widths of the ladder* which Phase 1 aligns, leaving §3 with no ❌ at all.

## 8. Re-running this audit

Everything above is mechanical: the class sets come from scanning `.name` selectors in both `src/lib/styles` trees, the emitted set from `class=` attributes, `class={[…]}` arrays and `*Class` maps in the components (examples excluded), and the axis checks from the rung lists in `internal/tokens.ts` and the `[data-*]` rules in `fractalstyler/src/lib/styles/configurations.css`. The only judgement calls were the 28 non-class tokens in §2, all listed there.

## 9. What landed (Phases 1–2)

| # | Change | Where |
| --- | --- | --- |
| 1 | Duplicate `.match-anchor` deleted | `fractalsvelte-ui/src/lib/styles/layers/components/actions.css` — every emitter already carried `.floating`, so the styler rule is the one that now applies |
| 2 | `--measure-md: 28rem` corrected to `--measure-bs: 28rem`; `.max-h-bs` added | `fractalstyler/src/lib/styles/configurations.css:96`, `shapes-sizes.css:71`. `md` still 32rem, so no width moved; `.clamp-bs` gained the max-width it referenced |
| 3 | `.at-left-end` / `.at-right-end` added; the UI's `Placement` widened to 12 with `placementClass` + `enterFrom` entries | `layout-shell.css:104-105`, `internal/tokens.ts`, `popover.ts`, `hover-card.ts`, `tooltip.ts` |
| 4 | `Measure` widened to the whole width ladder (`xs … 4xl`, `full`) with entries in `Container`, `dialogWidth`, `outsideWidth` | `internal/tokens.ts:137` and the three maps |
| 5 | The vocabulary now has one home: `fractalstyler/src/lib/vocabulary.ts` (`SIZES`, `GAPS`, `MEASURES`, `SHAPES`, `ALIGNS`, `VARIANTS`, `TONES`, `RADII`, `DENSITIES`, `MOTIONS`, `PLACEMENTS`), exported from the package and from the new `@fractaldesign/fractalstyler/vocabulary` subpath. `src/lib/types.ts` re-exports `PLACEMENTS`/`Placement` from it | `vocabulary.ts`, `index.ts`, `types.ts`, `package.json` |
| 6 | New gate rules `vocabulary/drift` and `vocabulary/class`: the UI's eight axis lists must equal fractalstyler's, and **every** advertised value must resolve to a class or a `[data-*]` rule | `scripts/lib/checks.ts` (`checkVocabulary`), wired in `gate-core.ts`. Both were tested negatively — adding `4xl` to `Sizes` fails with *“Size drifted from fractalstyler — extra 4xl”*, and asking for a missing class fails with *“Size max-height value "bs" has no class”* |
| 7 | Density universalised: `compact · cozy · comfortable` in styler's `DENSITIES`, in one UI const, on the table's `density` prop and on the theme axis; `cozy` now has a rule (the base token blocks answer to `[data-density='cozy']`) | `types.ts`, `gaps-pads-margins.css`, `shapes-sizes.css`, `typography.css`, `tokens.ts`, `table.ts`, `theme.svelte.ts` |
| 8 | `data-motion="snappy"` is no longer written: no `[data-motion='snappy']` rule exists, and `--spring: var(--spring-snappy)` *is* the base | `theme.svelte.ts:148` and the boot script |
| 8b | `data-radius` removed everywhere: the axis is `[data-shape='sharp'\|'soft'\|'round']` in styler, and the UI writes `data-shape` (`theme.svelte.ts`, `ThemeProvider`, `ThemeCustomizer`) | `configurations.css:118-120`, `theme.svelte.ts:143`, `ThemeProvider.svelte:102` |

**Verification after the change**

| Check | Result |
| --- | --- |
| every advertised value resolves (32 size classes, 8 gaps, 5 shapes, 11 variants, 5 tones, 7 aligns, 9 measures, 12 placements, 3 radius / 2 density / 3 motion data rules) | **all present** |
| `scripts/gate.ts` | 124/124 components, 0 errors, 0 warnings |
| `svelte-check` (1348 files) | 0 errors, 0 warnings |
| `fractalstyler` build (`registry` + `tokens` + `prepack`) | all good, 651 classes / 488 tokens |
| `pnpm run lint` | 0 violations |
| `pnpm check` | exit 0 |

### Phase 3 — no code change was needed, and that is the finding

The `bs → max-h-md` clamp was already gone: `Code` was refactored onto the shared `maxHeightClass()` helper, which is generic over `Sizes`. So the earlier audit's "Code clamps `bs` to 20px" had stopped being true — the *only* thing missing was the class and the token, which Phase 1 supplied. Proof, run against the source:

```
maxHeightClass('bs')      → "max-h-bs"
maxHeightClass('24rem')   → ""            (maxHeightStyle returns "24rem")
Sizes.map(maxHeightClass) → max-h-xs max-h-sm max-h-md max-h-bs max-h-lg max-h-xl max-h-2xl max-h-3xl
```

and the compiled stylesheet carries both `.max-h-bs { max-height: var(--measure-bs) }` and `--measure-bs: 28rem`. The one observable delta, now that it is correct: a `Code` with `maxHeight="bs"` and content taller than 28rem scrolls at 28rem instead of 32rem. The vocabulary gate (§9, rule `vocabulary/class`) asserts that class exists for the rung, so it cannot regress.

### A silent-failure guard added on the way

The `variant` → `look`/`form` renames left four call sites writing an axis attribute the component does not take — `<Button form="ghost">` and friends. They type-checked, because `form`, `look` and `variant` are also plain HTML attributes, so Svelte's checker accepted them while they rendered nothing. All four are fixed, and the gate now fails on that pattern:

```
props/axis-attr  src/lib/components/display/code/examples/05-wrap-and-height.svelte:44
                 <Button> takes no `form` prop — it would render nothing
                 → use the prop Button declares (variant)
```

Rule `props/axis-attr` walks every component and example file, resolves each `<Component …>` tag against the generated API, and errors when `variant`, `look` or `form` is written on a component that does not declare it. Verified negatively by re-introducing one of the four.
