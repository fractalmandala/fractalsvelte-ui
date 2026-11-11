# AGENTS

Fractalsvelte UI is a Sveltekit components library.

## Rules

- The components are those in `lib/components` ONLY. Any other files in other folders are not components.
- The canonical props are at `types.ts` at `lib/types.ts`. Any other file is to be ignored. In case of conflicts or ambiguities `lib/types.ts` is the final word.
- The canonical styling for all the canonical props is the CSS in `lib/styles/`, chiefly `component-props.css` (variant, shape, size) and `components.css` (component classes). Components are styled with these classes only: no `<style>` blocks, no inline styles, no hardcoded radius or height.
- The canonical list of tokens and their current default values is the `:root` and `[data-mode]` blocks in `lib/styles/*.css` (`colors-themes.css`, `shapes-sizes.css`, `gaps-pads-margins.css`, `typography.css`). In case of conflicts or ambiguities, those files are the final word. See section `## Tokens` below.
- `src/lib` should only contain components and any/all supporting files for them that should be accessible to the user. That is, it should only contain what is to be published in the package as part of fractalsvelte-ui. 
	- `src/routes` is for preview pages, doc testing etc.
	- everything else should be in `src/site`.
- Use Bend!
When using Bend:
- run `bend guide` to learn it
- use `LAWS.bend` to keep important rules
- run `bend PROOF.bend` before committing
- parallelize the code whenever possible

> A component, its canonical props, styling, AND the setup for its documentation are ONE SINGLE UNIT. That is, a component is not complete till its documentation is also prepared, in the form of:
1. Component file path
2. Component name
3. One line description
4. Component group
5. Preview Props - the props for this component that must be shown on its documentation page. see sections `## Documentation` and `## Props` below.
6. Demo Usage - a `<component-name>.svelte` file in `lib/demos` which imports and uses the component exactly as it would be by a user. It acts as the simulation of real-world component usage.

> The canonical preview props per component are at `component-previews.ts` at `site/data/component-previews.ts`. Any other file is to be ignored. In case of conflicts or ambiguities `site/data/component-previews.ts` is the final word.

## Component Workflow

1. New component goes in `lib/components/<group-name>/`
2. It must use from `lib/types.ts`, and if additional are needed they should be added there.
3. See `## Tokens` and `## Props` to see which classes, props, variables to use.
4. Add to `site/data/component-previews.ts` the props which should be used for this component's documentation page.
5. Add a `site/demos/<group-name>/<component-name>.svelte` as the component's import and usage demo.
6. Begin every component file with:
> `<!-- @component <add component description here>. -->`
7. Add and use 'TextSize` prop in components that have text, so that users can decide their own text sizes. Use `text-bs` or `text-md` as defaults. 
8. Always keep the `{className}` in component classes, so that users can set their own classes.

## Documentation

> **A component, its canonical props, styling, AND the setup for its documentation are ONE SINGLE UNIT. That is, a component is not complete till its documentation is also prepared**
> **The documentation becomes the proof. If a component is complete, its documentation must by definition be complete and ready and functioning. If documentation is not complete and functioning, the component is not complete.**
> **Therefore, the definition of "done" in this project is "component + component documentation complete."**

### Documentation Structure

```
Component Name
Component Description
Component Group

Component Hero Demo - this is the component demo added at `site/demos/<group-name>/<component-name>.svelte`

Installation and Usage

Component Prop Previews - Preview areas showing all iterations of the component given variation in prop values. Definitions must be given for each prop, from `site/data/prop-definitions.ts`. See section `## Props` below.

Props Table - A table showing all props the component uses and explaining each.
```

## Props

The universal canonical file of all prop types is `src/lib/types.ts`. 
Also important is `src/site/data/component-previews.ts`, which lists which props should be in the documentation page of each component. The demos for any prop type should be such:

Ex: take prop 'variant' which has possible values - 'primary', 'secondary', 'themed', 'outline', 'ghost', 'link'. 
So, for all components that have `variant` listed in the `component-previews.ts` file, the demo for variants should be:

```
<div class="row wrap gap-bs ycenter">
	<Component variant="primary">Primary</Component>
	<Component variant="secondary">Secondary</Component>
	<Component variant="themed">Themed</Component>
	<Component variant="outline">Outline</Component>
	<Component variant="ghost">Ghost</Component>
	<Component variant="link">Link</Component>
</div>
```