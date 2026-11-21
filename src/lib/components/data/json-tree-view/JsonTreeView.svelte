<!-- @component Collapsible JSON and JavaScript value inspector with syntax highlighting and value copy. -->

<script lang="ts">
	import type {  HTMLAttributes  } from 'svelte/elements';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		jsonToTree,
		nodeToValue,
		type JsonNode,
		type JsonNodePreviewOptions
	} from './json.js';
	import { type Pad, type Shape, type Surface, type TextSize } from '../../../internal/tokens.js';
	import JsonNodeRow from './JsonNodeRow.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		data: unknown;
		defaultExpandedDepth?: number;
		rootName?: string;
		sortKeys?: boolean;
		copyable?: boolean;
		maxStringLength?: number;
		surface?: Surface;
		shape?: Shape;
		pad?: Pad;
		textSize?: TextSize;
	}

	let {
		data,
		defaultExpandedDepth = 1,
		rootName = 'root',
		sortKeys = false,
		copyable = true,
		maxStringLength = 60,
		surface = 'elevated',
		shape = 'modern',
		pad = 'pad-sm',
		textSize = 'text-sm',
		class: className,
		...rest
	}: Props = $props();

	function cloneSorted(val: unknown, seen = new WeakSet<object>()): unknown {
		if (!sortKeys || typeof val !== 'object' || val === null) return val;
		if (seen.has(val)) return val;
		seen.add(val);
		if (Array.isArray(val)) return val.map((item) => cloneSorted(item, seen));
		if (Object.getPrototypeOf(val) !== Object.prototype) return val;
		const out: Record<string, unknown> = {};
		for (const key of Object.keys(val).sort()) {
			out[key] = cloneSorted((val as Record<string, unknown>)[key], seen);
		}
		return out;
	}

	const previewOpts = $derived<Partial<JsonNodePreviewOptions>>({
		collapseStringsAfterLength: maxStringLength
	});

	const normalized = $derived(cloneSorted(data));
	const rootNode = $derived(jsonToTree(normalized));

	let expandedIds = $state(new SvelteSet<string>());
	let copiedId = $state<string | null>(null);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	$effect.pre(() => {
		const initial = new SvelteSet<string>();
		function seed(node: JsonNode, depth: number) {
			if (depth < defaultExpandedDepth && node.children?.length) {
				initial.add(nodeToValue(node));
				for (const child of node.children) seed(child, depth + 1);
			}
		}
		seed(rootNode, 0);
		expandedIds = initial;
	});

	$effect(() => () => clearTimeout(copyTimer));

	function toggle(id: string) {
		const next = new SvelteSet(expandedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedIds = next;
	}

	async function copyNode(node: JsonNode) {
		const id = nodeToValue(node);
		try {
			const serialized =
				typeof node.value === 'string'
					? node.value
					: (JSON.stringify(node.value, null, 2) ?? String(node.value));
			await navigator.clipboard?.writeText(serialized);
			copiedId = id;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => {
				if (copiedId === id) copiedId = null;
			}, 1500);
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div
	role="tree"
	aria-label={`${rootName} JSON tree`}
	class={['font-mono scroll-y', surface, shape, pad, textSize, className]}
	{...rest}
>
	<JsonNodeRow
		node={rootNode}
		depth={0}
		{rootName}
		{expandedIds}
		{copiedId}
		{copyable}
		{previewOpts}
		onToggle={toggle}
		onCopy={copyNode}
	/>
</div>
