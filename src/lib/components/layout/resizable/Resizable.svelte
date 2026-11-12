<!-- @component Split panes that resize by dragging or keyboard, with collapsible panes that spring open and shut. -->

<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Orientation } from '../../../internal/tokens.js';
	import { ResizableState, setResizable } from './resizable.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The direction panes are laid out: `horizontal` puts them side by side, `vertical` stacks them. */
		orientation?: Orientation;
		/** The size of every pane in percent, in order. Bindable; reads and writes stay in step with dragging. */
		sizes?: number[];
		/** Called with the new sizes (percent, in order) whenever the user moves a handle. */
		onResize?: (sizes: number[]) => void;
		/** Saves the layout to `localStorage` under this key and restores it on the next visit. */
		storageKey?: string;
		/** The panes and the handles between them. */
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		sizes = $bindable([]),
		onResize,
		storageKey,
		class: klass,
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

	// A bound `sizes` that changes from outside moves the panes.
	$effect(() => {
		const next = sizes;
		untrack(() => {
			if (next.length === state.panes.length && next.length > 0 && !same(next, state.sizes)) state.seed(next);
		});
	});

	// The panes' sizes flow back out to the bound value.
	$effect(() => {
		const next = state.sizes;
		untrack(() => {
			if (!same(next, sizes)) sizes = next.slice();
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
	class={['wfull hfull min0 overflow-hidden', orientation === 'horizontal' ? 'row' : 'box', klass]}
	data-orientation={orientation}
	{@attach root}
>
	{@render children?.()}
</div>
