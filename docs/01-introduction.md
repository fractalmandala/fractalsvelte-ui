---
title: Introduction
description: Fractalsvelte UI is a component library for Svelte and SvelteKit, with component kits, spring engine, view transitions and parametric themes — styled using Fractalstyler - a lean and customizable modular styling system.
id: 1
---

126 components across 14 kits, written in the Svelte 5 way - $props, $state, snippets and attachments. Motion is physical. Anything pressed, dragged, or opened moves on a spring that keeps its velocity when interrupted, and stands still when the operating system asks for reduced motion. Colour is parametric - a theme is three numbers, so you can turn it like a dial. 

Two rules help keep it all tight and consistent -

**1. Fractalstyler under the hood**
Styling is composition of registered classes in markup. There are no style blocks, no inline styles, no style directives and no inline SVG anywhere in the library. Every class comes from Fractalstyler's registry or from Fractalsvelte UI's small extension layer, and dynamic values travel through custom properties - JavaScript writes `--value`, a class owns the real property.

[Fractalstyler on Github](https://github.com/fractalmandala/fractalstyler) | [Fractalstyler Docs](https://github.com/fractalmandala/fractalstyler/blob/main/docs/README.md)

**2. A component and its documentation are one entity**
A component is a folder - the component, its parts, an index.ts, a doc.ts manifest and numbered examples. The examples render live and show their own source, the API tables are extracted from interface Props and its annotations. The gate fails a folder that leaves anything out - an undocumented prop, a variant no example shows, an unknown class.

## Why Fractalstyler?

Frankly, if you're fluent and habitual with Tailwind, and already know the BitsUI and/or Shadcn-Svelte systems, then this library doesn't add much to your workflows. It is **especially useful** though for those who do not want to be dependent on Tailwind, and 

## Get Started

1. Install Fractalsvelte UI along with Fractalstyler as a peer dependency:

```bash
pnpm add @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
# or
npm install @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
# or
yarn add @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
# or
bun add @fractaldesign/fractalsvelte-ui @fractaldesign/fractalstyler
```

2. Import Fractalstyler first, the Fractalstyler UI's extension layer, into the root layout. Order matters - the extension layer builds on Fractalstyler's tokens.

```svelte
<script lang="ts">
	import '@fractaldesign/fractalstyler/styles';
	import '@fractaldesign/fractalsvelte-ui/styles';
	let { children } = $props();
</script>

{@render children()}
```

3. Set resolvers for mode and theme in the `app.html` file of your Svelte project. This is to ensure fidelity from first paint, and no off-putting flashes.

```html
<!--in the app.html file-->
<!doctype html>
<html lang="en" data-mode="dark" data-theme="fractalsvelte">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body>
		%sveltekit.body%
	</body>
</html>
```

4. Initialize themeing in the root layout. `initTheme()` makes the settings live, restores and preserves user choice, and follows operating system when mode is set to `system`. 

```svelte
<!--in root layout.svelte-->
<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { initTheme } from '@fractaldesign/fractalsvelte-ui/theme';
	import { setupViewTransitions } from '@fractaldesign/fractalsvelte-ui/motion';

	initTheme();                          // restores, follows the OS, persists
	setupViewTransitions(onNavigate);     // page transitions on every navigation
</script>
```

## Using a Component

Every component, attachment and helper is a named export of `@fractaldesign/fractalsvelte-ui`; motion and theme also have their own entry points.

```svelte
<!--on a +page.svelte, for example-->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<Button onclick={() => count++}>Deploy to production</Button>
<p class="text-sm text-muted tabular-nums">Deployed {count} times</p>
```


