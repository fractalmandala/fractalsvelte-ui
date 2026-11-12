# fractalsvelte-ui

name - fractalsvelte-ui (`@fractaldesign/fractalsvelte-ui`)
description - A complete SvelteKit component super-library: component kits, spring physics, motion, view transitions and parametric themes — styled only with fractalstyler. A component and its documentation are one unit.
type - sveltekit (library + docs site)
status - current

---

## Two laws

1. **fractalstyler only.** Every component is markup composed from
   [fractalstyler](../fractalstyler)'s class registry plus one small extension
   layer (`src/lib/styles/layers`, shipped as `@fractaldesign/fractalsvelte-ui/styles`).
   No `<style>` blocks, no inline styles, no hex, no stray pixels. Dynamic
   values travel through CSS custom properties.
2. **A component and its documentation are one.** A component is a folder —
   source, `doc.ts`, and runnable examples. The docs page (install, usage,
   every variant, the full props table) is generated from that folder, and
   `pnpm gate` fails the build when anything is undocumented or unshown.

## Use it

```sh
pnpm add @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';
	import { initTheme } from '@fractaldesign/fractalsvelte-ui/theme';

	let { children } = $props();
	initTheme();
</script>

{@render children()}
```

```html
<!-- src/app.html -->
<html lang="en" data-mode="dark" data-theme="fractalsvelte">
```

```svelte
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<Button variant="themed" onclick={() => console.log('shipped')}>Ship it</Button>
```

## Develop

```sh
pnpm install
pnpm dev                       # the docs site
pnpm gen                       # regenerate custom.css, spring tokens, the barrel, api.json
pnpm verify actions/button     # gen + gate + lint + type-check for one component
pnpm check                     # the whole tree: gen, svelte-check, fractalstyler lint, gate
pnpm build                     # docs site + the publishable package (publint)
```

Requires Node ≥ 22.18 and pnpm. fractalstyler is linked from `../fractalstyler`.

See [AGENTS.md](./AGENTS.md) for the full contract and [DESIGN.md](./DESIGN.md)
for the design language.
