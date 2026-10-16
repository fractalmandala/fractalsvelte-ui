<script lang="ts">
	import type { Snippet } from 'svelte';
	import { motion, useScroll, useTransform, useSpring } from '@humanspeak/svelte-motion';
	import type { RevealDirection } from '$lib/motion/transitions/reveal.js';
	import { areMotionAnimationsDisabled } from '../motionPreference.svelte';

	interface Props {
		visible?: boolean;
		direction?: RevealDirection;
		/** Whether to link progress continuously to scroll (scrub) or trigger on view */
		scrub?: boolean | number;
		/** Scroll offset: e.g. ['start 0.9', 'start 0.4'] */
		offset?: [string, string];
		/** Spring stiffness for scrub smoothing. Default: 120 */
		stiffness?: number;
		/** Spring damping for scrub smoothing. Default: 25 */
		damping?: number;
		children: Snippet;
		[key: string]: unknown;
	}

	let {
		visible = true,
		direction = 'down',
		scrub = 3,
		offset = ['start 0.8', 'start 0.4'],
		stiffness = 120,
		damping = 25,
		children,
		...rest
	}: Props = $props();

	let containerEl = $state<HTMLElement>();

	function getClipRange(dir: RevealDirection): [string, string] {
		switch (dir) {
			case 'left':
				return ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'];
			case 'right':
				return ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'];
			case 'up':
				return ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'];
			case 'down':
				return ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'];
			case 'diagonal':
				return [
					'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
					'polygon(0% 0%, 120% 0%, 100% 100%, 0% 100%)'
				];
		}
	}

	function getClipPath(dir: RevealDirection, t: number, slant = 20): string {
		const u = 1 - t;
		switch (dir) {
			case 'left':
				return `inset(0% ${u * 100}% 0% 0%)`;
			case 'right':
				return `inset(0% 0% 0% ${u * 100}%)`;
			case 'up':
				return `inset(0% 0% ${u * 100}% 0%)`;
			case 'down':
				return `inset(${u * 100}% 0% 0% 0%)`;
			case 'diagonal': {
				const p = t * (100 + slant);
				const topX = Math.max(0, p);
				const botX = Math.max(0, p - slant);
				return `polygon(0% 0%, ${topX}% 0%, ${botX}% 100%, 0% 100%)`;
			}
		}
	}

	const clipRange = $derived(getClipRange(direction));

	// svelte-ignore state_referenced_locally
	// 1. Scroll-linked tracking on real DOM container
	const { scrollYProgress } = useScroll({
		target: () => containerEl,
		offset
	});

	// svelte-ignore state_referenced_locally
	// 2. Physics-based spring smoothing (or direct 1:1 if scrub === true)
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness,
		damping
	});

	// 3. Map spring progress to clip-path dynamically via closure
	const clipPathValue = useTransform(smoothProgress, (p) => getClipPath(direction, p));
</script>

{#if visible}
	<div bind:this={containerEl} {...rest}>
		{#if areMotionAnimationsDisabled()}
			{@render children()}
		{:else if scrub}
			<!-- Continuous scroll-linked scrub with spring physics -->
			<motion.div style={{ clipPath: clipPathValue }}>
				{@render children()}
			</motion.div>
		{:else}
			<!-- In-view trigger with spring entrance (re-triggers on scroll in/out) -->
			<motion.div
				initial={{ clipPath: clipRange[0], opacity: 0 }}
				whileInView={{ clipPath: clipRange[1], opacity: 1 }}
				viewport={{ once: false, margin: '-10%' }}
				transition={{ type: 'spring', stiffness, damping }}
			>
				{@render children()}
			</motion.div>
		{/if}
	</div>
{/if}
