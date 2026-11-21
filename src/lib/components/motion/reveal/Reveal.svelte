<!-- @component Springs its contents in when they scroll into view. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  Attachment  } from 'svelte/attachments';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { animate, inView, reducedMotion, setMotion, type MotionValues, type SpringInput } from '../../../motion/index.js';

	type RevealDirection = 'up' | 'down' | 'left' | 'right';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		from?: RevealDirection;
		distance?: number;
		scale?: number;
		blur?: number;
		delay?: number;
		once?: boolean;
		amount?: number;
		spring?: SpringInput;
		children?: Snippet;
	}

	let {
		from = 'up',
		distance = 24,
		scale = 1,
		blur = 0,
		delay = 0,
		once = true,
		amount = 0.2,
		spring = 'gentle',
		class: className,
		children,
		...rest
	}: Props = $props();

	const offset = $derived.by((): MotionValues => {
		const values: MotionValues = { scale, opacity: 0 };
		if (from === 'up') values.y = distance;
		else if (from === 'down') values.y = -distance;
		else if (from === 'left') values.x = distance;
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

<div class={['motion', blur > 0 && 'blur-in', className]} {@attach attach} {...rest}>
	{@render children?.()}
</div>
