<!-- @component One pane of the group, with its default, minimum, maximum and collapse sizes. -->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { untrack } from 'svelte';
	import { vars } from '../../../motion/index.js';
	import { getResizable, type PaneEntry } from './resizable.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** The starting size in percent. Panes without one share what the others leave. */
		defaultSize?: number;
		/** The smallest size in percent the pane may be dragged to. */
		minSize?: number;
		/** The largest size in percent the pane may be dragged to. */
		maxSize?: number;
		/** Lets the pane collapse to `collapsedSize` when dragged past its minimum, or toggled with Enter on its handle. */
		collapsible?: boolean;
		/** The size in percent the pane rests at when collapsed. `0` hides it entirely. */
		collapsedSize?: number;
		/** Whether the pane is collapsed. Bindable; set it to open or close the pane with a spring. */
		collapsed?: boolean;
		/** The pane's content. */
		children?: Snippet;
	}

	let {
		defaultSize,
		minSize = 10,
		maxSize = 100,
		collapsible = false,
		collapsedSize = 0,
		collapsed = $bindable(false),
		class: klass,
		children,
		...rest
	}: Props = $props();

	const group = getResizable();
	const id = $props.id();
	const entry: PaneEntry = {
		id,
		get defaultSize() {
			return defaultSize;
		},
		get minSize() {
			return minSize;
		},
		get maxSize() {
			return maxSize;
		},
		get collapsible() {
			return collapsible;
		},
		get collapsedSize() {
			return collapsedSize;
		},
		el: undefined
	};
	const unregister = group.register(entry);
	$effect(() => unregister);

	const size = $derived(group.sizeOf(id));
	const shut = $derived(group.isCollapsed(id));

	// `collapsed` drives the pane, and the pane drives `collapsed`.
	$effect(() => {
		const want = collapsed;
		untrack(() => group.setCollapsed(id, want));
	});
	$effect(() => {
		const now = shut;
		untrack(() => {
			if (collapsed !== now) collapsed = now;
		});
	});

	const mount = (node: HTMLElement) => {
		entry.el = node;
		group.sort();
		return () => {
			entry.el = undefined;
		};
	};
</script>

<div
	{...rest}
	{id}
	class={['pane', !group.dragging && 'settle', klass]}
	data-collapsed={shut || undefined}
	inert={shut && collapsedSize === 0 ? true : undefined}
	{@attach vars({ pane: size })}
	{@attach mount}
>
	{@render children?.()}
</div>
