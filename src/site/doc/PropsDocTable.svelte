<script lang="ts">
	// Props table for one component, joining props.json with src/site/data/prop-definitions.ts.
	import propsJson from './data/props.json';
	import { definitionFor, definitionHtml } from '$site/data/prop-definitions';

	interface Props {
		/** Path under lib/components without extension, e.g. "actions/Button". */
		path: string;
	}

	let { path }: Props = $props();

	type Row = {
		name: string;
		type: string;
		default: string | null;
		optional: boolean;
		comment?: string | null;
	};
	const data = propsJson.props as Record<string, { extends: string[]; props: Row[] }>;
	const entry = $derived(data[path]);
</script>

{#if entry}
	<table class="props-table">
		<thead>
			<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
		</thead>
		<tbody>
			{#each entry.props as p (p.name)}
				{@const defText = definitionFor(p.name, p.comment)}
				<tr>
					<td><code>{p.name}{p.optional ? '?' : ''}</code></td>
					<td><code>{p.type}</code></td>
					<td>{#if p.default}<code>{p.default}</code>{:else}—{/if}</td>
					<td>{#if defText}{@html definitionHtml(defText)}{:else}—{/if}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
