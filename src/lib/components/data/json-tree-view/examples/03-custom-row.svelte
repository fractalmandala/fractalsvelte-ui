<!-- @example Your own row :: JsonNodeRow is exported, so the open set, the preview length and the copy handling are yours to wire. -->
<script lang="ts">
	import { JsonNodeRow, getRootNode, nodeToValue, type JsonNode } from '@fractaldesign/fractalsvelte-ui';
	import { SvelteSet } from 'svelte/reactivity';

	const deployment = {
		region: 'fra1',
		replicas: 3,
		healthy: true,
		tags: ['edge', 'eu-central']
	};
	const tree = getRootNode(deployment);
	const node = tree.children?.[0] ?? tree;
	const previewOpts = { maxPreviewItems: 2, collapseStringsAfterLength: 16 };

	let expandedIds = $state(new SvelteSet<string>([nodeToValue(node)]));
	let copiedId = $state<string | null>(null);

	function onToggle(id: string) {
		const next = new SvelteSet(expandedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedIds = next;
	}

	async function onCopy(entry: JsonNode) {
		await navigator.clipboard?.writeText(JSON.stringify(entry.value, null, 2) ?? String(entry.value));
		copiedId = nodeToValue(entry);
		setTimeout(() => (copiedId = null), 1500);
	}
</script>

<div role="tree" aria-label="deployment" class="outlined modern bg-surface pad-sm measure-sm font-mono text-sm">
	<JsonNodeRow
		{node}
		depth={0}
		rootName="deployment"
		{expandedIds}
		{copiedId}
		copyable
		{previewOpts}
		{onToggle}
		{onCopy}
		size="h-sm"
		textSize="text-sm"
		textColor="text-secondary"
		childTextColor="text-info"
	/>
</div>
