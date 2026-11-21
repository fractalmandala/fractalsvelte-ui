<!-- @component A scroll-linked offset layer, with a group for stacking a scene at several speeds. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  Attachment  } from 'svelte/attachments';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { parallax, reducedMotion } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		speed?: number;
		axis?: 'x' | 'y';
		children?: Snippet;
	}

	let { speed = 0.2, axis = 'y', class: className, children, ...rest }: Props = $props();

	const layer = (s: number, ax: 'x' | 'y'): Attachment<HTMLElement> => (node) => {
		const css =
			typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: view()');
		if (css && !reducedMotion.current) {
			node.classList.add('parallax-view');
			if (ax === 'x') node.classList.add('axis-x');
			node.style.setProperty('--speed', String(s));
			return () => {
				node.classList.remove('parallax-view', 'axis-x');
				node.style.removeProperty('--speed');
			};
		}
		node.classList.add('motion');
		const stop = parallax({ speed: s, axis: ax })(node);
		return () => {
			stop?.();
			node.classList.remove('motion');
		};
	};
</script>

<div class={className} {@attach layer(speed, axis)} {...rest}>
	{@render children?.()}
</div>
