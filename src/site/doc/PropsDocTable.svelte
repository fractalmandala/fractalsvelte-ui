<script lang="ts">
	// Props table for one component, directly reading live component props and src/site/data/prop-definitions.ts.
	import { getLiveComponentByPath } from '$site/doc/live-components';
	import { definitionFor, definitionHtml } from '$site/data/prop-definitions';

	interface Props {
		/** Path under lib/components without extension, e.g. "actions/Button". */
		path: string;
	}

	let { path }: Props = $props();

	const entry = $derived(getLiveComponentByPath(path));
</script>

{#if entry && entry.props.length}
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
