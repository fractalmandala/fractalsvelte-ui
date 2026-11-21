<!-- @component Split panes that resize by dragging or keyboard, with collapsible panes that spring open and shut. -->

<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import type {  Orientation  } from '../../../internal/tokens.js';
	import { ResizableState, setResizable } from './resizable.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		orientation?: Orientation;
		sizes?: number[];
		onResize?: (sizes: number[]) => void;
		storageKey?: string;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		sizes = $bindable([]),
		onResize,
		storageKey,
		class: className,
		children,
		...rest
	}: Props = $props();

	const state = new ResizableState({ orientation: () => orientation });
	setResizable(state);

	const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.01);
	const key = () => (storageKey ? `fractalsvelte-ui:resizable:${storageKey}` : null);

	// Restore a saved layout once the panes have registered.
	$effect(() => {
		const k = key();
		if (!k) return;
		try {
			const saved: unknown = JSON.parse(localStorage.getItem(k) ?? 'null');
			if (Array.isArray(saved) && saved.every((v) => typeof v === 'number')) untrack(() => state.seed(saved));
		} catch {
			/* storage unavailable or unreadable — keep the defaults */
		}
	});

	// Two-way binding between the panes and `sizes`, with echo suppression: writing the
	// bound value re-runs this pair, and without the guard each round seeds the panes
	// again, which writes again — the loop Svelte reports as update depth exceeded.
	let echo: number[] | null = null;

	$effect(() => {
		const next = sizes;
		untrack(() => {
			if (echo && same(next, echo)) {
				echo = null;
				return;
			}
			if (next.length === state.panes.length && next.length > 0 && !same(next, state.sizes)) state.seed(next);
		});
	});

	$effect(() => {
		const next = state.sizes;
		untrack(() => {
			if (same(next, sizes)) return;
			echo = next.slice();
			sizes = next.slice();
		});
	});

	// User-made changes are announced and saved.
	$effect(() => {
		const next = state.sizes;
		if (!state.touched) return;
		untrack(() => {
			onResize?.(next.slice());
			const k = key();
			if (!k) return;
			try {
				localStorage.setItem(k, JSON.stringify(next));
			} catch {
				/* storage unavailable — the layout simply is not remembered */
			}
		});
	});

	const root = (node: HTMLElement) => {
		state.root = node;
		return () => {
			state.root = undefined;
		};
	};
</script>

<div
	{...rest}
	class={['wfull hfull min0 overflow-hidden', orientation === 'horizontal' ? 'row' : 'box', className]}
	data-orientation={orientation}
	{@attach root}
>
	{@render children?.()}
</div>
