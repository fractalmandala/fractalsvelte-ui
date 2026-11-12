<!-- @component Types and deletes its way through a list of words, with a blinking caret. -->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { reducedMotion } from '../../../motion/index.js';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		/** The words to type, in order. */
		words: string[];
		/** Milliseconds spent typing each character. */
		speed?: number;
		/** Milliseconds spent deleting each character. */
		deleteSpeed?: number;
		/** How long to hold a completed word before deleting it, in milliseconds. */
		pause?: number;
		/** Starts again from the first word after the last one is deleted. When off, the last word stays. */
		loop?: boolean;
		/** Shows a blinking caret after the typed text. */
		cursor?: boolean;
	}

	let {
		words,
		speed = 70,
		deleteSpeed = 45,
		pause = 1600,
		loop = true,
		cursor = true,
		class: klass,
		...rest
	}: Props = $props();

	const firstWord = $derived(words[0] ?? '');
	let typed = $state<string | null>(null);
	const shown = $derived(typed ?? firstWord);
	const label = $derived(words.filter((word) => word.length > 0).join(', '));

	$effect(() => {
		const list = words;
		const typeMs = speed;
		const delMs = deleteSpeed;
		const pauseMs = pause;
		const shouldLoop = loop;

		if (list.length === 0) {
			typed = '';
			return;
		}

		if (reducedMotion.current) {
			typed = list[0] ?? '';
			return;
		}

		let index = 0;
		let count = (list[0] ?? '').length;
		typed = list[0] ?? '';
		let phase: 'type' | 'pause' | 'delete' = 'pause';
		let timer: ReturnType<typeof setTimeout> | undefined;

		const tick = () => {
			const word = list[index] ?? '';
			if (phase === 'type') {
				count += 1;
				typed = word.slice(0, count);
				if (count >= word.length) {
					phase = 'pause';
					timer = setTimeout(tick, pauseMs);
				} else {
					timer = setTimeout(tick, typeMs);
				}
				return;
			}
			if (phase === 'pause') {
				const last = index >= list.length - 1;
				if (!shouldLoop && last) return;
				if (list.length === 1 && !shouldLoop) return;
				phase = 'delete';
				timer = setTimeout(tick, delMs);
				return;
			}
			count -= 1;
			typed = word.slice(0, Math.max(0, count));
			if (count <= 0) {
				index = (index + 1) % list.length;
				count = 0;
				phase = 'type';
				timer = setTimeout(tick, typeMs);
			} else {
				timer = setTimeout(tick, delMs);
			}
		};

		timer = setTimeout(tick, pauseMs);
		return () => {
			if (timer !== undefined) clearTimeout(timer);
		};
	});
</script>

<span class={klass} aria-label={label} {...rest}>
	<span aria-hidden="true" aria-live="off">{shown}{#if cursor}<span class="cursor anim-blink"></span>{/if}</span>
</span>
