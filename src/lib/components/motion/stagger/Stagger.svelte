<!-- @component Reveals its children in sequence, staggered from first, last or centre. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { inView, stagger } from '../../../motion/index.js';

	type EnterPreset = 'fade' | 'scale' | 'fly-up' | 'fly-down' | 'fly-left' | 'fly-right' | 'blur' | 'slide';
	type StaggerFrom = 'first' | 'last' | 'center';
	type StaggerTrigger = 'mount' | 'inView';

	const enterClass: Record<EnterPreset, string> = {
		fade: 'enter-fade',
		scale: 'enter-scale',
		'fly-up': 'enter-up',
		'fly-down': 'enter-down',
		'fly-left': 'enter-left',
		'fly-right': 'enter-right',
		blur: 'enter-blur',
		slide: 'enter-edge-bottom'
	};

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** Delay in milliseconds between each child. Written to the `--stagger` channel. */
		step?: number;
		/** Where the stagger originates: the first child, the last, or the middle. */
		from?: StaggerFrom;
		/** When the entrance plays: immediately on mount, or when the group scrolls into view. */
		trigger?: StaggerTrigger;
		/** The enter preset applied to each child, via `.anim-in` or `.reveal` and the matching `.enter-*` class. */
		enter?: EnterPreset;
		/** The children to number and reveal. Direct element children receive `--i`. */
		children?: Snippet;
	}

	let {
		step = 60,
		from = 'first',
		trigger = 'mount',
		enter = 'fade',
		class: klass,
		children,
		...rest
	}: Props = $props();

	function dress(opts: { enter: EnterPreset; trigger: StaggerTrigger }): Attachment<HTMLElement> {
		const motionClass = opts.trigger === 'mount' ? 'anim-in' : 'reveal';
		const preset = enterClass[opts.enter];
		return (node) => {
			const applied: HTMLElement[] = [];
			const apply = (): void => {
				for (const el of applied) {
					if (!el.isConnected) {
						el.classList.remove('anim-in', 'reveal', 'in', ...Object.values(enterClass));
					}
				}
				applied.length = 0;
				for (const child of node.children) {
					if (!(child instanceof HTMLElement)) continue;
					child.classList.remove('anim-in', 'reveal', ...Object.values(enterClass));
					child.classList.add(motionClass, preset);
					applied.push(child);
				}
			};
			apply();
			const mo = new MutationObserver(apply);
			mo.observe(node, { childList: true });
			return () => {
				mo.disconnect();
				for (const el of applied) el.classList.remove('anim-in', 'reveal', 'in', preset);
			};
		};
	}

	function markIn(): Attachment<HTMLElement> {
		return (node) =>
			inView({
				once: true,
				amount: 0.2,
				onEnter: () => {
					for (const child of node.children) {
						if (child instanceof HTMLElement) child.classList.add('in');
					}
				}
			})(node);
	}

	const staggerAttach = $derived(stagger({ step, from }));
	const dressAttach = $derived(dress({ enter, trigger }));
	const inViewAttach = $derived(trigger === 'inView' ? markIn() : undefined);
</script>

<div class={klass} {@attach staggerAttach} {@attach dressAttach} {@attach inViewAttach} {...rest}>
	{@render children?.()}
</div>
