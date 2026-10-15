<script lang="ts">
	interface PropItem {
		name: string;
		type: string;
		optional?: boolean;
		default?: string | null;
		bindable?: boolean;
		description?: string | null;
	}

	interface Props {
		items: PropItem[];
		title?: string;
	}

	let { items = [], title = 'Props' }: Props = $props();
</script>

<div class="f-props-container">
	<h3 class="f-props-title">{title}</h3>
	{#if items.length === 0}
		<p class="f-props-empty">No declared {title.toLowerCase()}.</p>
	{:else}
		<div class="f-table-wrapper">
			<table class="f-props-table">
				<thead>
					<tr>
						<th>Prop</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item}
						<tr>
							<td class="f-prop-name">
								<code>{item.name}</code>
								{#if !item.optional}
									<span class="f-badge f-required" title="Required">required</span>
								{/if}
								{#if item.bindable}
									<span class="f-badge f-bindable" title="Supports bind:">bindable</span>
								{/if}
							</td>
							<td class="f-prop-type">
								<code>{item.type}</code>
							</td>
							<td class="f-prop-default">
								{#if item.default}
									<code>{item.default}</code>
								{:else}
									<span class="f-none">—</span>
								{/if}
							</td>
							<td class="f-prop-desc">
								{item.description || '—'}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	@layer fractalsvelte-ui.components {
		.f-props-container {
			margin-top: 1.5rem;
			margin-bottom: 2rem;
		}

		.f-props-title {
			font-size: var(--f-text-lg);
			font-weight: 600;
			color: var(--f-text);
			margin-bottom: 0.75rem;
		}

		.f-props-empty {
			font-size: var(--f-text-sm);
			color: var(--f-text-muted);
			font-style: italic;
		}

		.f-table-wrapper {
			width: 100%;
			overflow-x: auto;
			border: 1px solid var(--f-border);
			border-radius: var(--f-radius-md);
			background: var(--f-surface);
		}

		.f-props-table {
			width: 100%;
			border-collapse: collapse;
			text-align: left;
			font-size: var(--f-text-sm);
		}

		.f-props-table th {
			padding: 0.75rem 1rem;
			background: var(--f-sunken);
			color: var(--f-text-muted);
			font-weight: 600;
			border-bottom: 1px solid var(--f-border);
		}

		.f-props-table td {
			padding: 0.75rem 1rem;
			border-bottom: 1px solid var(--f-border-subtle);
			vertical-align: top;
		}

		.f-props-table tr:last-child td {
			border-bottom: none;
		}

		.f-prop-name {
			font-weight: 600;
			color: var(--f-primary);
			white-space: nowrap;
		}

		.f-prop-name code {
			font-family: var(--f-font-mono);
			font-size: 0.85em;
			background: var(--f-hover);
			padding: 0.15rem 0.35rem;
			border-radius: var(--f-radius-xs);
			color: var(--f-text);
		}

		.f-prop-type code {
			font-family: var(--f-font-mono);
			font-size: 0.82em;
			color: var(--f-text-muted);
			word-break: break-all;
		}

		.f-prop-default code {
			font-family: var(--f-font-mono);
			font-size: 0.82em;
			color: var(--f-primary);
		}

		.f-none {
			color: var(--f-text-subtle);
		}

		.f-prop-desc {
			color: var(--f-text);
			line-height: 1.5;
		}

		.f-badge {
			display: inline-block;
			margin-left: 0.35rem;
			font-size: 0.68rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			font-weight: 700;
			padding: 0.1rem 0.35rem;
			border-radius: var(--f-radius-xs);
		}

		.f-required {
			background: var(--f-danger-bg);
			color: var(--f-danger-text);
		}

		.f-bindable {
			background: var(--f-primary-subtle);
			color: var(--f-primary);
		}
	}
</style>
