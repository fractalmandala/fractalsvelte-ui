<script lang="ts">
	import { startViewTransition, vtName, type ViewTransitionType } from '@fractaldesign/fractalsvelte-ui/motion';
	import CodeBlock from '../../../docs-site/CodeBlock.svelte';
	import DocPage from '../../../docs-site/DocPage.svelte';
	import GuideFooter from '../../../docs-site/GuideFooter.svelte';
	import Rich from '../../../docs-site/Rich.svelte';
	import Section from '../../../docs-site/Section.svelte';

	const types: ViewTransitionType[] = ['fade', 'slide', 'slide-back', 'scale', 'reveal'];
	const plans = [
		{ name: 'Hobby', price: '$0', note: 'For side projects and experiments.' },
		{ name: 'Pro', price: '$20', note: 'For teams shipping every day.' },
		{ name: 'Enterprise', price: 'Custom', note: 'SSO, audit logs and a named engineer.' }
	];
	let index = $state(0);
	const plan = $derived(plans[index]);

	function go(type: ViewTransitionType, event: MouseEvent) {
		void startViewTransition(
			() => {
				index = (index + 1) % plans.length;
			},
			{ type, origin: event }
		);
	}

	const setup = `<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { setupViewTransitions } from '@fractaldesign/fractalsvelte-ui/motion';

	// back navigations slide back; everything else fades
	setupViewTransitions(onNavigate, {
		type: (nav) => (nav.type === 'popstate' && (nav.delta ?? 0) < 0 ? 'slide-back' : 'fade')
	});
</` + `script>`;

	const stateCode = `<script lang="ts">
	import { startViewTransition } from '@fractaldesign/fractalsvelte-ui/motion';
	let index = $state(0);
</` + `script>

<button onclick={(e) => startViewTransition(() => { index++; }, { type: 'reveal', origin: e })}>
	Next plan
</button>`;

	const shared = `<script lang="ts">
	import { vtName } from '@fractaldesign/fractalsvelte-ui/motion';
</` + `script>

<!-- the same name on the list page and the detail page morphs between them -->
<img class="vt-name" {@attach vtName(\`cover-\${album.id}\`)} src={album.cover} alt="" />`;

	const toc = [
		{ id: 'pages', label: 'Page transitions' },
		{ id: 'state', label: 'State transitions' },
		{ id: 'shared', label: 'Shared elements' },
		{ id: 'fallback', label: 'Fallback' }
	];
</script>

<DocPage
	title="View transitions"
	eyebrow="Motion"
	lead="Typed transitions on the View Transitions API — `fade`, `slide`, `slide-back`, `scale` and a circular `reveal` from the pointer — for navigations and for any state change."
	{toc}
>
	<Section id="pages" title="Page transitions">
		<p class="text-body text-secondary lh16">
			<Rich text="Call `setupViewTransitions(onNavigate)` once in the root layout and every SvelteKit navigation animates. This site does exactly that — follow any link." />
		</p>
		<CodeBlock code={setup} title="src/routes/+layout.svelte" />
	</Section>

	<Section id="state" title="State transitions">
		<p class="text-body text-secondary lh16">
			<Rich text={"`startViewTransition(update, { type, origin })` animates any DOM change. The type becomes a `vt-<type>` class on `<html>` for the transition's lifetime; the stylesheet does the rest. Pick one:"} />
		</p>
		<div class="box gap-md border radius-bs bg-surface pad-lg rim shad-sm">
			<div class="box gap-xs vt-name" {@attach vtName('plan-card')}>
				<p class="text-sm text-muted">Plan {index + 1} of {plans.length}</p>
				<p class="text-2xl weight-600 ls-tight-lg">{plan.name} · <span class="tabular-nums">{plan.price}</span></p>
				<p class="text-md text-secondary">{plan.note}</p>
			</div>
			<div class="row wrap gap-xs pt-sm bt-sub">
				{#each types as t (t)}
					<button type="button" class="button secondary h-bs px-md mincurved text-sm font-mono" onclick={(e) => go(t, e)}>{t}</button>
				{/each}
			</div>
		</div>
		<CodeBlock code={stateCode} />
	</Section>

	<Section id="shared" title="Shared elements">
		<p class="text-body text-secondary lh16">
			<Rich text="`vtName(name)` gives an element a `view-transition-name` through the `--vt-name` channel (the element also carries the `vt-name` class). Elements with the same name on both sides of a transition morph into each other." />
		</p>
		<CodeBlock code={shared} />
	</Section>

	<Section id="fallback" title="Fallback">
		<p class="text-body text-secondary lh16">
			<Rich text="Where the API is missing, or the visitor prefers reduced motion, the update runs immediately with no animation — `supportsViewTransitions()` tells you which you will get." />
		</p>
	</Section>

	{#snippet footer()}<GuideFooter href="/docs/view-transitions" />{/snippet}
</DocPage>
