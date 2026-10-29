<script lang="ts">
	// Step 2 + 3 joined: props table for one component, from props.json + prop-definitions.ts.
	import propsJson from './data/props.json';
	import { definitionFor, definitionHtml } from './data/prop-definitions';

	interface Props {
		/** Path under lib/styler without extension, e.g. "actions/Button". */
		path: string;
	}

	let { path }: Props = $props();

	type Row = { name: string; type: string; default: string | null; optional: boolean };
	const data = propsJson.props as Record<string, { extends: string[]; props: Row[] }>;
	const entry = $derived(data[path]);
</script>

{#if entry}
	<table class="props-table">
		<thead>
			<tr><th>Prop</th><th>Type</th><th>Default</th><th>Accepted Values</th></tr>
		</thead>
		<tbody>
			{#each entry.props as p (p.name)}
				{@const def = definitionFor(p.name, path)}
				<tr>
					<td><code>{p.name}{p.optional ? '?' : ''}</code></td>
					<td><code>{p.type}</code></td>
					<td>{#if p.default}<code>{p.default}</code>{:else}—{/if}</td>
					<td>{@html definitionHtml(def.text)}{#if def.draft}&nbsp;<span class="draft">(draft)</span>{/if}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
