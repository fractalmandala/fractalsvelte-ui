<script lang="ts">
	import { Icon } from '@fractaldesign/icons';
	import { luCheck, luChevronRight, luCopy } from '@fractaldesign/icons/lucide';
	import { vars } from '../../../motion/index.js';
	import {
		getAccessibleDescription,
		isRootKeyPath,
		jsonNodeToElement,
		keyPathToKey,
		nodeToValue,
		type JsonNode,
		type JsonNodePreviewOptions
	} from './json.js';
	import JsonNodeRow from './JsonNodeRow.svelte';

	interface Props {
		node: JsonNode;
		depth: number;
		rootName: string;
		expandedIds: Set<string>;
		copiedId: string | null;
		copyable: boolean;
		previewOpts: Partial<JsonNodePreviewOptions>;
		onToggle: (id: string) => void;
		onCopy: (node: JsonNode) => void;
	}

	let {
		node,
		depth,
		rootName,
		expandedIds,
		copiedId,
		copyable,
		previewOpts,
		onToggle,
		onCopy
	}: Props = $props();

	const id = $derived(nodeToValue(node));
	const hasChildren = $derived(Boolean(node.children && node.children.length > 0));
	const open = $derived(expandedIds.has(id));
	const isRoot = $derived(isRootKeyPath(node.keyPath));
	const keyLabel = $derived(isRoot ? rootName : keyPathToKey(node.keyPath));
	const accessibleLabel = $derived(getAccessibleDescription(node, previewOpts));
	const preview = $derived(jsonNodeToElement(node, previewOpts));

	function valueToneClass(type: JsonNode['type']): string {
		if (type === 'string') return 'tok-str';
		if (type === 'number' || type === 'bigint') return 'tok-num';
		if (type === 'boolean') return 'tok-kw';
		if (type === 'null' || type === 'undefined') return 'tok-punc';
		if (type === 'regex' || type === 'date') return 'tok-fn';
		return 'text-secondary';
	}

	function extractPreviewText(): string {
		function collect(el: typeof preview | { type: 'text'; value: unknown }): string {
			if (el.type === 'text') return el.value == null ? '' : String(el.value);
			return el.children.map(collect).join('');
		}
		return collect(preview);
	}
</script>

<div role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-selected="false" aria-label={accessibleLabel}>
	<div
		class="row ycenter xbetween gap-xs indent guides radius-sm px-xs py-xs interactive bg-none"
		{@attach vars({ level: depth })}
	>
		<div class="row ycenter gap-xs min0 grow">
			{#if hasChildren}
				<button
					type="button"
					class="bare row xcenter ycenter h-xs square text-muted pointer"
					aria-label={open ? `Collapse ${keyLabel}` : `Expand ${keyLabel}`}
					onclick={() => onToggle(id)}
				>
					<Icon icon={luChevronRight} class={['caret quarter text-xs', open && 'open']} />
				</button>
			{:else}
				<span class="h-xs square shrink-0" aria-hidden="true"></span>
			{/if}

			{#if keyLabel}
				<span class="tok-type weight-500 shrink-0">{keyLabel}</span>
				<span class="tok-punc shrink-0">:</span>
			{/if}

			<span class={['truncate', valueToneClass(node.type)]}>
				{extractPreviewText()}
			</span>
		</div>

		{#if copyable}
			<button
				type="button"
				class="bare row xcenter ycenter h-xs square text-muted pointer shrink-0"
				aria-label={`Copy ${keyLabel || 'value'}`}
				onclick={() => onCopy(node)}
			>
				<Icon icon={copiedId === id ? luCheck : luCopy} class={copiedId === id ? 'text-success' : undefined} />
			</button>
		{/if}
	</div>

	{#if hasChildren && open && node.children}
		<div role="group">
			{#each node.children as child (nodeToValue(child))}
				<JsonNodeRow
					node={child}
					depth={depth + 1}
					{rootName}
					{expandedIds}
					{copiedId}
					{copyable}
					{previewOpts}
					{onToggle}
					{onCopy}
				/>
			{/each}
		</div>
	{/if}
</div>
