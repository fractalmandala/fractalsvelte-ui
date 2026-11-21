<!-- @component One pane of the group, with its default, minimum, maximum and collapse sizes. -->

<script lang="ts">
	import type {  Snippet  } from 'svelte';
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { untrack } from 'svelte';
	import { vars } from '../../../motion/index.js';
	import { getResizable, type PaneEntry } from './resizable.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		collapsible?: boolean;
		collapsedSize?: number;
		collapsed?: boolean;
		children?: Snippet;
	}

	let {
		defaultSize,
		minSize = 10,
		maxSize = 100,
		collapsible = false,
		collapsedSize = 0,
		collapsed = $bindable(false),
		class: className,
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
	class={['pane', !group.dragging && 'settle', className]}
	data-collapsed={shut || undefined}
	inert={shut && collapsedSize === 0 ? true : undefined}
	{@attach vars({ pane: size })}
	{@attach mount}
>
	{@render children?.()}
</div>
