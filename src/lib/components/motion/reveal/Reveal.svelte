<!-- @component Springs its contents in when they scroll into view. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { animate, inView, reducedMotion, setMotion, type MotionValues, type SpringInput } from '../../../motion/index.js';

	type RevealDirection = 'up' | 'down' | 'left' | 'right';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The side the element springs in from. */
		direction?: RevealDirection;
		/** How far the element starts from rest, in pixels. */
		distance?: number;
		/** The starting scale. `1` leaves scale unchanged. */
		scale?: number;
		/** The starting blur, in pixels. `0` leaves the image sharp. */
		blur?: number;
		/** Delay in milliseconds after the element enters the viewport. */
		delay?: number;
		/** When true, the entrance plays once and does not reverse on leave. */
		once?: boolean;
		/** Visible fraction of the element that counts as in view. */
		amount?: number;
		/** The spring used for the entrance (and the exit, when `once` is false). */
		spring?: SpringInput;
		/** The content that is revealed. */
		children?: Snippet;
	}

	let {
		direction = 'up',
		distance = 24,
		scale = 1,
		blur = 0,
		delay = 0,
		once = true,
		amount = 0.2,
		spring = 'gentle',
		class: klass,
		children,
		...rest
	}: Props = $props();

	const offset = $derived.by((): MotionValues => {
		const values: MotionValues = { scale, opacity: 0 };
		if (direction === 'up') values.y = distance;
		else if (direction === 'down') values.y = -distance;
		else if (direction === 'left') values.x = distance;
		else values.x = -distance;
		if (blur > 0) values['--blur'] = blur;
		return values;
	});

	const restValues = $derived.by((): MotionValues => {
		const values: MotionValues = { x: 0, y: 0, scale: 1, opacity: 1 };
		if (blur > 0) values['--blur'] = 0;
		return values;
	});

	function revealInView(opts: {
		offset: MotionValues;
		rest: MotionValues;
		delay: number;
		once: boolean;
		amount: number;
		spring: SpringInput;
	}): Attachment<HTMLElement> {
		return (node) => {
			if (reducedMotion.current) {
				setMotion(node, opts.rest);
				return;
			}
			setMotion(node, opts.offset);
			let timer: ReturnType<typeof setTimeout> | undefined;
			const stop = inView({
				once: opts.once,
				amount: opts.amount,
				onEnter: () => {
					clearTimeout(timer);
					if (opts.delay > 0) timer = setTimeout(() => animate(node, opts.rest, { spring: opts.spring }), opts.delay);
					else animate(node, opts.rest, { spring: opts.spring });
				},
				onLeave: () => {
					clearTimeout(timer);
					animate(node, opts.offset, { spring: opts.spring });
				}
			})(node);
			return () => {
				clearTimeout(timer);
				stop?.();
			};
		};
	}

	const attach = $derived(
		revealInView({ offset, rest: restValues, delay, once, amount, spring })
	);
</script>

<div class={['motion', blur > 0 && 'blur-in', klass]} {@attach attach} {...rest}>
	{@render children?.()}
</div>
