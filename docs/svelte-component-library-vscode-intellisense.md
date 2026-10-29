---
title: Svelte Component Library VS Code Intellisense — End-to-End Setup
description: From-zero tutorial for making a Svelte/SvelteKit component library give consumers prop completion, type checking, and hover docs in VS Code.
source: pi-session-svelte-intellisense-2026-06-13
type: doc
---

# Svelte / SvelteKit component library: end-to-end intellisense

Goal: a consumer of a component library types `<Button ` and gets `variant`, `size`, `disabled`, correct types, red squiggles on bad values, and hover docs — in VS Code, with no custom extension.

---

## Step 0 — Understand the machinery first

Almost every failure in this space is a misunderstanding of what's actually running.

1. Install the **Svelte VS Code extension** (`svelte.svelte-vscode`).
2. That extension runs **`svelte-language-server`**, which speaks LSP to VS Code.
3. The language server converts every `.svelte` file to TypeScript in memory using **`svelte2tsx`**.
4. That TypeScript is handed to **TypeScript's language service** (`tsserver`).

So prop completion is not a Svelte feature. It is **TypeScript attribute completion on a JSX-ish tag**. Which means:

> **Nothing appears unless `tsserver` can resolve a type declaration for the component.**

Everything below is about making that true, and keeping it true after publish. There is no registry to register with, no manifest to write, no plugin to install.

Corollary: the same mechanism powers hover, go-to-definition, rename, and error squiggles. You get all of it for the price of one correct `.d.ts`.

---

## Step 1 — Prerequisites

```bash
node -v    # 20+ (22 LTS recommended)
npm -v
```

VS Code extension, install once:

```bash
code --install-extension svelte.svelte-vscode
```

Verify inside VS Code: Command Palette → `Svelte: Restart Language Server` should exist. If not, the extension isn't active.

Dev-time validators — they catch packaging bugs that silently kill consumer intellisense:

```bash
npx publint --version
npx @arethetypeswrong/cli --version
```

---

## Step 2 — Scaffold the library from zero

```bash
npx sv create my-ui
```

Answer the prompts:

| Prompt | Choice |
|---|---|
| Template | **Svelte library** |
| TypeScript | **Yes, using TypeScript syntax** |
| Add-ons | none required |

```bash
cd my-ui
npm install
```

This gives you `@sveltejs/package` and a `svelte-package` build script. That tool is the whole ballgame: it compiles `.svelte` → `.js` **and** emits a matching `.d.ts` per source file.

If you'd rather not use the CLI, the only requirements are:

```jsonc
// package.json
{
  "scripts": { "package": "svelte-package", "prepublishOnly": "svelte-package" },
  "devDependencies": {
    "@sveltejs/package": "^2",
    "svelte": "^5",
    "typescript": "^5"
  },
  "peerDependencies": { "svelte": "^5.0.0" }
}
```

> `svelte` must be a **peer** dependency, not a regular one. If you bundle your own `svelte`, consumers get two Svelte runtimes and their types resolve against the wrong `Component` type — intellisense degrades to `any` or vanishes.

---

## Step 3 — Write one component with an explicitly typed `Props`

Create the directory shape:

```
src/lib/
  index.ts
  components/
    button/
      button.svelte
      button.types.ts
      index.ts
```

### 3a. `src/lib/components/button/button.types.ts`

```ts
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface Props extends HTMLButtonAttributes {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: Snippet;
}

export type ButtonProps = Props;
```

Three things to internalize:

- **`HTMLButtonAttributes` from `svelte/elements`** is how `onclick`, `aria-*`, `disabled`, `type`, `form` etc. arrive in the completion list for free. There is a matching `HTMLDivAttributes`, `HTMLInputAttributes`, `HTMLAnchorAttributes`, `HTMLAttributes`, and a `SvelteHTMLElements` map for element-name-keyed typing.
- **String-literal unions are the autocomplete engine.** `'primary' | 'secondary' | 'ghost' | 'danger'` is what makes the editor suggest values. `string` suggests nothing.
- **Export `Props` unaliased** so component files can `import type { Props }` — and *also* alias it as `ButtonProps` so consumers can name the type without collisions.

Naming the interface `Props` is a convention; the name itself is irrelevant to the tooling. `export interface ButtonProps` works identically. Aliasing exists purely so a single public barrel can export many of them.

### 3b. `src/lib/components/button/button.svelte`

```svelte
<script lang="ts">
  import type { Props } from './button.types';

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(' ');
</script>

<button class={classes} aria-busy={loading} {...rest}>
  {@render children?.()}
</button>
```

**The annotation `: Props` is mandatory, not stylistic.**

Without it, Svelte infers prop types from the destructuring defaults, and `variant = 'primary'` infers as **`string`**, not `'primary'`. You then get prop *names* in completion but zero value completion and zero red squiggles on `variant="nonsense"`. This is the single most common reason people report "it half-works."

Also required: `lang="ts"`. A `<script>` without it is plain JS and `svelte2tsx` emits `any` props.

### 3c. `src/lib/components/button/index.ts`

```ts
export { default as Button } from './button.svelte';
export type { Props as ButtonProps } from './button.types';
```

### 3d. `src/lib/index.ts`

```ts
export * from './components/button/index';
```

Fine with one component. It breaks the moment two components both export a type named `Props` — `export *` collisions are a hard TS error, and the editor shows the consumer a broken module. From component two onward, use explicit exports:

```ts
export { Button } from './components/button/index';
export type { ButtonProps } from './components/button/index';
export { Card } from './components/card/index';
export type { CardProps } from './components/card/index';
```

**Requirement:** the public barrel must export the **component value**, not just a type. If `Button` never appears as a value export, `svelte2tsx` cannot resolve the tag and you get no completion at all.

---

## Step 4 — Confirm the build emits declarations

```bash
npm run package
find dist -name '*.d.ts' | sort
```

You need to see both files per component:

```
dist/index.d.ts
dist/components/button/button.svelte.d.ts
dist/components/button/button.types.d.ts
```

Inspect `dist/components/button/button.svelte.d.ts`. It should look roughly like:

```ts
import type { Props } from './button.types.js';
declare const Button: import("svelte").Component<Props, {}, "">;
export default Button;
```

If that file is **missing**, or contains `Component<any, ...>`, stop here. Everything downstream is decoration. Causes:

| Cause | Fix |
|---|---|
| No `typescript` installed | `npm i -D typescript` |
| `<script>` missing `lang="ts"` | add it |
| `tsconfig.json` missing or `allowJs`/`checkJs` misconfigured | copy from the scaffold |
| `.d.ts` hand-written and shadowing the generated one | delete it, let `svelte-package` generate |

Watch mode for development:

```bash
npx svelte-package --watch
```

---

## Step 5 — Wire `package.json` so `tsserver` can find the types

```jsonc
{
  "name": "my-ui",
  "version": "0.0.1",
  "type": "module",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "!dist/**/*.test.*", "!dist/**/*.spec.*"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "peerDependencies": { "svelte": "^5.0.0" },
  "sideEffects": ["**/*.css"]
}
```

Non-negotiable details:

1. **`"types"` must be the first key inside each export condition.** Condition order is resolution order. Put `"default"` first and TypeScript stops before reaching `types` in some resolution modes.
2. **`"svelte"` condition** lets Vite/Svelte tooling resolve your package as Svelte source rather than plain JS. Keep it even though `default` points at the same file.
3. **The top-level `"types"`** is a fallback for consumers on `moduleResolution: "node"` (older configs), which ignores `exports` entirely.
4. **`"files"` must include `dist`.** A missing or too-narrow `files` is the #1 cause of "works in the monorepo, dead after `npm install`."

Subpath exports (extra entry points) follow the same shape:

```jsonc
"./styles.css": "./dist/styles.css",
"./types": {
  "types": "./dist/props.types.d.ts"
}
```

---

## Step 6 — Prove the artifact before publishing

This is the step everyone skips, and it's the only one that tests what consumers actually get.

```bash
npm pack --dry-run
```

Read the file list. Confirm `dist/index.d.ts` and every `dist/components/**/*.d.ts` is present.

Then run the two validators:

```bash
npx publint
npx attw --pack .
```

- **`publint`** flags `exports`/`types`/`svelte` wiring mistakes.
- **`@arethetypeswrong/cli`** reports, per resolution mode, whether TypeScript will find your types. You want `✅` across the rows. A `❌ No types` row means a chunk of your consumers get no intellisense even though your own repo looks fine.

```bash
npm pack        # produces my-ui-0.0.1.tgz
```

Keep that tarball. You'll install it in Step 7.

> Do **not** validate using `npm link` or workspace path aliases alone. Both resolve through the source tree and will happily hide a broken `exports` map. Always test the packed tarball at least once before publishing.

---

## Step 7 — Consume it in a real app

```bash
cd ..
npx sv create my-app      # SvelteKit minimal, TypeScript yes
cd my-app
npm install
npm install ../my-ui/my-ui-0.0.1.tgz
```

`src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import { Button } from 'my-ui';
</script>

<Button />
```

Now, in the editor, with the cursor right after `<Button `:

1. **Trigger completion** (`Ctrl+Space` / `Cmd+Space`).
   → You should see `variant`, `size`, `loading`, `children`, plus DOM props from `HTMLButtonAttributes`: `onclick`, `disabled`, `type`, `aria-label`, `tabindex`, …
2. **Type `variant=` then a quote.**
   → Value completion offers `"primary" | "secondary" | "ghost" | "danger"`. Also works as `variant={'_'}`.
3. **Hover `variant`.**
   → Shows `(property) variant?: ButtonVariant | undefined` plus whatever JSDoc you wrote (Step 10).
4. **Write `<Button variant="nope" />`.**
   → Red squiggle: `Type '"nope"' is not assignable to type 'ButtonVariant'`.
5. **Go to definition (`F12`) on `variant`.**
   → Jumps into `node_modules/my-ui/dist/components/button/button.types.d.ts`.

If 1–5 pass, the library is done. If any fail, jump to Step 13.

---

## Step 8 — What the consumer must have configured

You cannot fix these from the library side. Put them in your README, because a consumer with a `boolean`-only tsconfig sees a much weaker experience.

**`tsconfig.json` (or `jsconfig.json` for JS consumers):**

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "checkJs": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "esnext",
    "skipLibCheck": true
  }
}
```

| Requirement | Why |
|---|---|
| `moduleResolution: "bundler"` (or `node16`/`nodenext`) | Only these honor the `exports` → `types` condition |
| `strict: true` | Nullable/optional prop errors actually surface |
| `checkJs: true` + `jsconfig.json` | Gives JS-only consumers *some* checking |
| `lang="ts"` on every `<script>` | `svelte2tsx` treats JS scripts as `any` |
| `skipLibCheck: true` | Recommended — keeps your `.d.ts` from being re-checked noisily |

In SvelteKit the root `tsconfig.json` extends `.svelte-kit/tsconfig.json`; don't overwrite `include`/`exclude`, extend the generated config instead.

---

## Step 9 — Scale past one component

Two rules, both about the barrel:

**Rule 1 — alias types per component.** Each `x.types.ts` should export both `Props` (for the component to import) and `XProps` (for consumers):

```ts
export interface Props extends HTMLDivAttributes { /* … */ }
export type CardProps = Props;
```

**Rule 2 — the public barrel uses explicit named exports, never `export *` once you have more than one component.** `export *` from two modules that both export `Props` is an `ambiguous export` error, and the consumer's editor reports the whole package as broken.

```ts
export { Button } from './components/button/index';
export type { ButtonProps } from './components/button/index';
export { Card } from './components/card/index';
export type { CardProps } from './components/card/index';
```

Generate this file with a script rather than by hand, plus a `--check` mode in CI so a new component that isn't exported fails the build. An unexported component is invisible to consumers and silent about it.

If you want a **single import path for all prop types**, add a declaration-only barrel — `src/lib/props.types.ts`:

```ts
export type { Props as ButtonProps } from './components/button/button.types';
export type { Props as CardProps } from './components/card/card.types';
```

```jsonc
"./types": { "types": "./dist/props.types.d.ts" }
```

Three constraints on that file:

- `export type` only, never `export *` — it must stay value-free.
- **Never import from it inside `.svelte` files.** Keep `import type { Props } from './button.types'`. A `.svelte` file importing a barrel of the entire library makes `svelte2tsx` walk the whole graph per file, and any non-`import type` becomes a runtime cycle.
- It is a *public surface*, not a source of truth. Keep the actual interfaces colocated with their components; consolidate only the re-exports.

---

## Step 10 — Hover documentation via JSDoc

Types alone tell the consumer `variant?: ButtonVariant`. They don't tell them what `ghost` looks like. That is JSDoc, and it costs nothing:

```ts
export interface Props extends HTMLButtonAttributes {
  /**
   * Visual weight of the button.
   *
   * @default 'primary'
   * @example <Button variant="ghost" />
   */
  variant?: ButtonVariant;

  /** Height/padding preset. */
  size?: ButtonSize;

  /** Shows a spinner and swallows `onclick` while true. */
  loading?: boolean;

  /** @deprecated Use `class`. `className` is a port artifact and will be removed in 1.0. */
  className?: string;
}
```

- `@deprecated` renders the prop **struck through** in the completion list and in hover.
- `@example` renders as a code block in hover.
- `@default` isn't a TS standard tag but renders as plain text in hover, which is enough.
- JSDoc on the interface itself shows in hover on the component tag.

This is the highest-value per-line investment in the whole setup, and it survives every build.

---

## Step 11 — The one case types cannot cover: `class="…"`

`class?: string` means `svelte-language-server` has nothing to complete inside the quotes. Neither does `style`. Neither does any free-form string prop (CSS class names, design tokens, animation names, icon names).

Three options, in order of cost:

**A. Accept it.** Push the value space into a union where you can: `tone?: 'brand' | 'neutral' | 'danger'` instead of a raw class. Works for anything enumerable.

**B. Ship a utility type that generates a union** from a `const` list, so the source of truth is code, not a hand-written union:

```ts
export const tones = ['brand', 'neutral', 'danger'] as const;
export type Tone = (typeof tones)[number];
```

**C. Write a completion provider extension.** Only if A and B genuinely can't cover it. Minimum viable version:

`package.json`:

```jsonc
{
  "name": "my-ui-intellisense",
  "engines": { "vscode": "^1.85.0" },
  "activationEvents": ["onLanguage:svelte"],
  "main": "./out/extension.js",
  "contributes": { "languages": [{ "id": "svelte" }] }
}
```

`src/extension.ts`:

```ts
import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface Token { name: string; doc?: string }

export function activate(ctx: vscode.ExtensionContext) {
  // Emit this file from your library build so it can never drift.
  const load = (): Token[] => {
    const p = path.join(ctx.extensionPath, 'tokens.json');
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
  };

  ctx.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'svelte' },
      {
        provideCompletionItems(document, position) {
          // Only fire when the cursor is inside class="…" / class='…'
          const linePrefix = document
            .lineAt(position)
            .text.slice(0, position.character);
          if (!/\bclass\s*=\s*["'][^"']*$/.test(linePrefix)) return;

          return load().map((t) => {
            const item = new vscode.CompletionItem(
              t.name,
              vscode.CompletionItemKind.Value
            );
            if (t.doc) {
              item.documentation = new vscode.MarkdownString(t.doc);
            }
            return item;
          });
        },
      },
      ' ',
      '-',
      ':',
      '"',
      "'"
    )
  );
}

export function deactivate() {}
```

Generate `tokens.json` from the CSS/design-token build so it's always in sync, and build with `tsc` to `out/`. Publish to the marketplace or ship the `.vsix` and tell consumers to install it.

**Be honest about the cost:** this is a second artifact your consumers must install, and the "am I inside a class attribute?" heuristic is regex-based and will misfire on multiline attributes and nested quotes. `svelte-language-server` exposes no extension API, so anything richer — custom diagnostics, required-prop checks beyond TS, "prefer `variant` over `className`" lint — requires you to re-parse `.svelte` files yourself and maintain it against an LSP you don't control. Prefer JSDoc: same information, zero distribution burden.

---

## Step 12 — Live development in a monorepo

Running `svelte-package --watch` in the library and consuming it via a workspace link gives you instant feedback: edit `button.types.ts`, the `.d.ts` regenerates, and the consumer editor updates within a second or two.

Two caveats:

- Workspace links resolve through the source tree, so they mask `exports` bugs. Re-run Step 6 (`npm pack` + `attw`) on every release, not just the first.
- TS caches aggressively. When types look stale: Command Palette → `Svelte: Restart Language Server`, or `TypeScript: Restart TS Server`.

---

## Step 13 — Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| No prop completion at all | Component not resolvable — no `.d.ts`, or barrel doesn't export it as a value | Step 4, Step 5, Step 9 |
| Completion shows only DOM props, not yours | Public export is a type-only re-export | export the component value |
| Prop names complete, but values don't | `$props()` not annotated with an interface → inferred as `string` | Step 3b |
| Values complete, but wrong ones (e.g. `string`) | Union widened; missing `as const` on the source list | Step 11B |
| No red squiggles | consumer lacks `lang="ts"`, `strict`, or a tsconfig | Step 8 |
| Works locally, dead after publish | `files` excludes `dist`; `exports.types` missing or not first | Step 5, `npm pack --dry-run` |
| `Module has no exported member 'Props'` | `export *` collision across components | alias per component |
| Hover shows `any` | `svelte` bundled instead of peer; duplicate Svelte runtimes | move to `peerDependencies` |
| `Cannot find module 'my-ui'` in editor but builds fine | `moduleResolution: "node"` and no top-level `"types"` | add it, or upgrade to `bundler` |
| Stale types after edit | LSP/TS cache | restart language server |
| `attw` reports `No types` on a row | resolution mode mismatch across `exports` conditions | fix `exports` ordering |

---

## Step 14 — Release checklist

```bash
npm run package                  # 1. emit .js + .d.ts
find dist -name '*.d.ts' | wc -l # 2. one per component, non-zero
npm pack --dry-run               # 3. dist is in the tarball
npx publint                      # 4. exports map is valid
npx attw --pack .                # 5. TS finds types in every mode
npm pack && npm install ./my-ui-*.tgz   # 6. in a scratch app, from scratch
```

Step 6 is the one that matters. If `<Button ` doesn't complete in a fresh app after installing the tarball, no amount of repo-local green checks means anything.

---

## Appendix — Svelte 4 differences

The flow is identical; only the component authoring changes:

```svelte
<script lang="ts">
  import type { Props } from './button.types';
  export let variant: ButtonVariant = 'primary';
  export let size: ButtonSize = 'md';
</script>
```

Rules:

- Every `export let` **must carry an explicit annotation** for the same reason as Svelte 5 — a bare `export let variant = 'primary'` widens to `string`.
- `svelte-package` emits `SvelteComponentTyped<Props>` in the `.d.ts` instead of `Component<Props, {}, "">`.
- `children` is a `Snippet` in Svelte 5 and a `<slot>` / `$$slots` type in Svelte 4; `HTMLButtonAttributes` from `svelte/elements` still works.
- Everything in Steps 4–8 is unchanged.

## Appendix — Key takeaways

1. Intellisense for props is **TypeScript**, not Svelte. Ship resolvable `.d.ts` or nothing happens.
2. `svelte-package` is the generator. Verify its output in `dist/` before debugging anything else.
3. Annotate `$props()` with an exported interface. Unannotated defaults widen to `string` and kill value completion.
4. String-literal unions are the autocomplete engine. `string` is autocomplete dead air.
5. `exports` condition order matters — `"types"` first.
6. Test the **packed tarball**, not the workspace. `npm pack` + `attw` are the only honest checks.
7. JSDoc gives more real value per line than any custom extension.
8. Custom extensions are justified only for free-form string values (`class`, tokens); everything else belongs in types.
