<!-- @component A declarative spring element: states layer and animate() springs between them. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		animate,
		inView,
		setMotion,
		type AnimationHandle,
		type MotionValues,
		type SpringInput
	} from '../../../motion/index.js';

	type MotionTag = 'div' | 'span' | 'section' | 'article' | 'li';

	interface Interaction {
		hovered: boolean;
		pressed: boolean;
		focused: boolean;
		viewed: boolean;
	}

	const interaction = new WeakMap<HTMLElement, Interaction>();

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** The element to render. */
		as?: MotionTag;
		/** The starting motion values, applied instantly before the first spring. */
		initial?: MotionValues;
		/** The resting motion values. Reactive: a change springs from the current position, keeping velocity. */
		animate?: MotionValues;
		/** Motion values applied while the pointer hovers the element. */
		whileHover?: MotionValues;
		/** Motion values applied while the element is pressed, by pointer or by Enter/Space. */
		whilePress?: MotionValues;
		/** Motion values applied while the element or a descendant has focus. */
		whileFocus?: MotionValues;
		/** Motion values applied while the element is in view. When set, the element stays at `initial` until it enters the viewport. */
		whileInView?: MotionValues;
		/** The spring used for every state change. */
		spring?: SpringInput;
		/** Delay in milliseconds before the first spring (and before `whileInView` enters). Hover, press and focus are immediate. */
		delay?: number;
		/** Called when a spring settles, is stopped, or is taken over by a newer one. */
		onAnimationEnd?: () => void;
		/** The content. */
		children?: Snippet;
	}

	let {
		as: tag = 'div',
		initial,
		animate: animateTo,
		whileHover,
		whilePress,
		whileFocus,
		whileInView,
		spring = 'snappy',
		delay = 0,
		onAnimationEnd,
		class: klass,
		children,
		...rest
	}: Props = $props();

	const started = new WeakSet<HTMLElement>();

	function targetOf(state: Interaction, opts: typeof snapshot): MotionValues {
		if (opts.whileInView && !state.viewed) return { ...(opts.initial ?? {}) };
		let values: MotionValues = { ...(opts.animateTo ?? {}) };
		if (state.viewed && opts.whileInView) values = { ...values, ...opts.whileInView };
		if (state.hovered && opts.whileHover) values = { ...values, ...opts.whileHover };
		if (state.focused && opts.whileFocus) values = { ...values, ...opts.whileFocus };
		if (state.pressed && opts.whilePress) values = { ...values, ...opts.whilePress };
		return values;
	}

	let snapshot = $derived({
		initial,
		animateTo,
		whileHover,
		whilePress,
		whileFocus,
		whileInView,
		spring,
		delay,
		onAnimationEnd
	});

	function behavior(opts: typeof snapshot): Attachment<HTMLElement> {
		return (node) => {
			let state = interaction.get(node);
			if (!state) {
				state = { hovered: false, pressed: false, focused: false, viewed: !opts.whileInView };
				interaction.set(node, state);
			} else if (!opts.whileInView) {
				state.viewed = true;
			}
			let timer: ReturnType<typeof setTimeout> | undefined;
			let handle: AnimationHandle | undefined;
			let cancelled = false;

			const go = (useDelay: boolean): void => {
				clearTimeout(timer);
				const to = targetOf(state!, opts);
				const run = (): void => {
					if (cancelled) return;
					handle = animate(node, to, { spring: opts.spring });
					const thisHandle = handle;
					handle.finished.then(() => {
						if (!cancelled && handle === thisHandle) opts.onAnimationEnd?.();
					});
				};
				if (useDelay && (opts.delay ?? 0) > 0) timer = setTimeout(run, opts.delay);
				else run();
			};

			if (!started.has(node)) {
				started.add(node);
				if (opts.initial) setMotion(node, opts.initial);
				go(true);
			} else {
				go(false);
			}

			const onEnter = (): void => {
				state!.hovered = true;
				go(false);
			};
			const onLeave = (): void => {
				state!.hovered = false;
				state!.pressed = false;
				go(false);
			};
			const onDown = (e: PointerEvent): void => {
				if (e.pointerType === 'mouse' && e.button !== 0) return;
				state!.pressed = true;
				go(false);
			};
			const onUp = (): void => {
				if (!state!.pressed) return;
				state!.pressed = false;
				go(false);
			};
			const onKeyDown = (e: KeyboardEvent): void => {
				if (e.key !== 'Enter' && e.key !== ' ') return;
				if (e.repeat) return;
				state!.pressed = true;
				go(false);
			};
			const onKeyUp = (e: KeyboardEvent): void => {
				if (e.key !== 'Enter' && e.key !== ' ') return;
				if (!state!.pressed) return;
				state!.pressed = false;
				go(false);
			};
			const onFocus = (): void => {
				state!.focused = true;
				go(false);
			};
			const onBlur = (e: FocusEvent): void => {
				if (e.relatedTarget instanceof Node && node.contains(e.relatedTarget)) return;
				state!.focused = false;
				go(false);
			};

			if (opts.whileHover) {
				node.addEventListener('pointerenter', onEnter);
				node.addEventListener('pointerleave', onLeave);
			}
			if (opts.whilePress) {
				node.addEventListener('pointerdown', onDown);
				window.addEventListener('pointerup', onUp);
				window.addEventListener('pointercancel', onUp);
				node.addEventListener('keydown', onKeyDown);
				node.addEventListener('keyup', onKeyUp);
			}
			if (opts.whileFocus) {
				node.addEventListener('focusin', onFocus);
				node.addEventListener('focusout', onBlur);
			}

			let stopInView: void | (() => void);
			if (opts.whileInView) {
				stopInView = inView({
					once: false,
					amount: 0.2,
					onEnter: () => {
						state!.viewed = true;
						go(true);
					},
					onLeave: () => {
						state!.viewed = false;
						go(false);
					}
				})(node);
			}

			return () => {
				cancelled = true;
				clearTimeout(timer);
				if (opts.whileHover) {
					node.removeEventListener('pointerenter', onEnter);
					node.removeEventListener('pointerleave', onLeave);
				}
				if (opts.whilePress) {
					node.removeEventListener('pointerdown', onDown);
					window.removeEventListener('pointerup', onUp);
					window.removeEventListener('pointercancel', onUp);
					node.removeEventListener('keydown', onKeyDown);
					node.removeEventListener('keyup', onKeyUp);
				}
				if (opts.whileFocus) {
					node.removeEventListener('focusin', onFocus);
					node.removeEventListener('focusout', onBlur);
				}
				stopInView?.();
			};
		};
	}

	const attach = $derived(behavior(snapshot));
</script>

<svelte:element this={tag} class={['motion', klass]} {@attach attach} {...rest}>
	{@render children?.()}
</svelte:element>
