<!-- @component Text that enters one character, word or line at a time, staggered on the `--i` channel. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { inView, stagger } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** The text that is revealed. It is also the accessible name of the wrapper. */
		text: string;
		/** How the text is split into staggered pieces. */
		by?: 'char' | 'word' | 'line';
		/** The entrance each piece uses. */
		preset?: 'fade-up' | 'blur' | 'scale' | 'slide';
		/** Delay between one piece and the next, in milliseconds. Written to the `--stagger` channel. */
		step?: number;
		/** `mount` plays as soon as the element is created; `inView` waits until it enters the viewport. */
		trigger?: 'mount' | 'inView';
		/** The element tag to render as. */
		as?: string;
	}

	let {
		text,
		by = 'word',
		preset = 'fade-up',
		step = 60,
		trigger = 'mount',
		as = 'p',
		class: klass,
		...rest
	}: Props = $props();

	const presetClass = {
		'fade-up': 'enter-up',
		blur: 'enter-blur',
		scale: 'enter-scale',
		slide: 'enter-left'
	} as const;

	const parts = $derived(splitText(text, by));
	let entered = $state(false);
	const held = $derived(trigger === 'inView' && !entered);

	const revealWhenVisible = inView({
		once: true,
		onEnter() {
			entered = true;
		}
	});

	function splitText(value: string, how: 'char' | 'word' | 'line'): string[] {
		if (how === 'line') return value.split('\n');
		if (how === 'word') return value.split(/(\s+)/).filter((part) => part.length > 0);
		if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
			return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value)].map((part) => part.segment);
		}
		return [...value];
	}

	function glyph(part: string): string {
		return part === ' ' ? '\u00a0' : part;
	}
</script>

<svelte:element
	this={as}
	class={[held && 'held', klass]}
	aria-label={text}
	{@attach stagger({ step })}
	{@attach trigger === 'inView' ? revealWhenVisible : undefined}
	{...rest}
>
	{#each parts as part, i (`${i}-${part}`)}
		<span class={['anim-in', by === 'line' ? 'block' : 'inline-block', presetClass[preset]]} aria-hidden="true">{glyph(part)}</span>
	{/each}
</svelte:element>
