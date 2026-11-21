<!-- @component Declarative route transitions for SvelteKit, with a keyed spring fallback when view transitions are unavailable. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import {
		reducedMotion,
		setupViewTransitions,
		springBlur,
		springFade,
		springFly,
		springScale,
		supportsViewTransitions,
		type OnNavigateLike,
		type SpringTransitionParams,
		type ViewTransitionSetupOptions,
		type ViewTransitionType
	} from '../../../motion/index.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		onNavigate?: OnNavigateLike;
		transition?: ViewTransitionType | ((navigation: { from: { url: URL } | null; to: { url: URL } | null; type: string; delta?: number }) => ViewTransitionType);
		key?: string | number;
		children?: Snippet;
	}

	let { onNavigate, transition = 'fade', key, class: className, children, ...rest }: Props = $props();

	const options: ViewTransitionSetupOptions = {};

	$effect(() => {
		options.type = transition;
	});

	$effect(() => {
		const nav = onNavigate;
		if (!nav) return;
		setupViewTransitions(nav, options);
	});

	let fallback = $state(false);
	$effect(() => {
		fallback = !supportsViewTransitions() || reducedMotion.current;
	});

	const useKey = $derived(fallback && key !== undefined && !!children);
	const resolvedType = $derived(typeof transition === 'function' ? 'fade' : transition);

	function enter(node: Element, params: SpringTransitionParams = {}) {
		return fallbackIn(node, resolvedType, params);
	}

	function exit(node: Element, params: SpringTransitionParams = {}) {
		return fallbackIn(node, resolvedType, params);
	}

	function fallbackIn(node: Element, kind: ViewTransitionType, params: SpringTransitionParams) {
		if (kind === 'slide') return springFly(node, { ...params, x: 24, y: 0 });
		if (kind === 'slide-back') return springFly(node, { ...params, x: -24, y: 0 });
		if (kind === 'scale') return springScale(node, params);
		if (kind === 'reveal') return springBlur(node, params);
		if (kind === 'none') return { duration: 0, css: () => '' };
		return springFade(node, params);
	}
</script>

{#if children}
	{#if useKey}
		<div class={['overlap', className]} {...rest}>
			{#key key}
				<div in:enter out:exit>
					{@render children()}
				</div>
			{/key}
		</div>
	{:else}
		<div class={className} {...rest}>
			{@render children()}
		</div>
	{/if}
{/if}
