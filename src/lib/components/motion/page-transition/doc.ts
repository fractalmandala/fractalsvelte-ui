import { defineDoc } from '../../../docs/define.js';

export default defineDoc({
	name: 'PageTransition',
	summary: 'Declarative route transitions for SvelteKit, with a keyed spring fallback when view transitions are unavailable.',
	description: `Pass SvelteKit's \`onNavigate\` from \`$app/navigation\` and a \`type\`. The component renders nothing by itself and calls \`setupViewTransitions(onNavigate, { type })\` during init, so it belongs in the root layout. \`type\` may be a fixed \`ViewTransitionType\` (\`fade\`, \`slide\`, \`slide-back\`, \`scale\`, \`reveal\`, \`none\`) or a function of the navigation — the usual pattern is back → \`slide-back\`.

The library never imports \`$app/*\`; the consumer passes the hook in.

\`\`\`svelte
<script>
	import { onNavigate } from '$app/navigation';
	import { PageTransition } from '@fractaldesign/fractalsvelte-ui';
</script>

<PageTransition {onNavigate} type={(nav) => ((nav.delta ?? 0) < 0 ? 'slide-back' : 'slide')} key={pathname}>
	{@render children()}
</PageTransition>
\`\`\`

When \`key\` and children are set and the browser has no view transitions (or reduced motion is on), the children are wrapped in a keyed spring transition (\`.overlap\`, so the outgoing and incoming views overlap). The spring matches the type: fade, fly for slide / slide-back, scale, blur for reveal, or none. When view transitions are available, route changes are handled by the View Transition API and children render as they are.`,
	features: [
		'Wires SvelteKit onNavigate without importing $app',
		'All ViewTransitionType values, or a function of the navigation',
		'Keyed spring fallback when view transitions are missing',
		'Renders nothing when used only as a hook'
	],
	accessibility: [
		'Route transitions are visual only. Focus management stays with the page that is being navigated to; SvelteKit still handles that.',
		'prefers-reduced-motion skips view transitions and the keyed spring fallback, so the new page or panel appears immediately.',
		'type="none" also skips the transition, which is useful when a navigation should not be animated.'
	],
	related: ['shared-element']
});
