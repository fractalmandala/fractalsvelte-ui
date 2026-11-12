<!-- @component A floating button that appears after a scroll threshold, with a scroll-progress ring around it. -->

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Icon } from '@fractaldesign/icons';
	import { luArrowUp } from '@fractaldesign/icons/lucide';
	import { reducedMotion, scrollProgress } from '../../../motion/index.js';
	import { sizeClass, type Size } from '../../../internal/tokens.js';

	interface Props extends HTMLButtonAttributes {
		/** How far the page must be scrolled, in pixels, before the button appears. */
		threshold?: number;
		/** Accessible name of the button. */
		label?: string;
		/** The control height; the button is always square. */
		size?: Size;
	}

	let {
		threshold = 320,
		label = 'Back to top',
		size = 'md',
		class: klass,
		...rest
	}: Props = $props();

	let visible = $state(false);

	function update() {
		if (typeof document === 'undefined') return;
		const el = document.scrollingElement ?? document.documentElement;
		visible = el.scrollTop >= threshold;
	}

	function go() {
		if (typeof document === 'undefined') return;
		const el = document.scrollingElement ?? document.documentElement;
		if ('scrollTo' in el && typeof el.scrollTo === 'function') {
			el.scrollTo({ top: 0, behavior: reducedMotion.current ? 'auto' : 'smooth' });
		} else {
			el.scrollTop = 0;
		}
	}

	$effect(() => {
		threshold;
		update();
		if (typeof window === 'undefined') return;
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});
</script>

<div class={['layer at-bottom-end pop enter-up spring-snappy', visible && 'open', !visible && 'pointer-none']}>
	<div class="relative square h-3xl row xcenter ycenter">
		<span class="ring cover pointer-none" aria-hidden="true" {@attach scrollProgress()}></span>
		<button
			type="button"
			class={['button btn-icon primary modern no-scaling inline-flex z-raised', sizeClass[size], klass]}
			aria-label={label}
			tabindex={visible ? 0 : -1}
			aria-hidden={!visible || undefined}
			onclick={go}
			{...rest}
		>
			<Icon icon={luArrowUp} />
		</button>
	</div>
</div>
