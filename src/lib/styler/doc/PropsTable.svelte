<script lang="ts" module>
	export interface PropItem {
		name: string;
		type: string;
		optional?: boolean;
		default?: string | null;
		bindable?: boolean;
		description?: string | null;
	}
</script>

<script lang="ts">
	import Code from '../typography/Code.svelte';

	interface Props {
		items: PropItem[];
		title?: string;
		class?: string;
	}

	let { items = [], title = 'Props', class: className = '' }: Props = $props();
</script>

<section class="box gap-sm {className}">
	<h3 class="page-heading-bs">{title}</h3>
	{#if items.length === 0}
		<p class="text-body-sm text-muted">No declared {title.toLowerCase()}.</p>
	{:else}
		<div class="scroll-x border radius-md">
			<table class="wfull text-sm">
				<thead class="bg-sunken">
					<tr>
						<th scope="col" class="px-md py-sm bb ta-l weight-600 text-secondary">Prop</th>
						<th scope="col" class="px-md py-sm bb ta-l weight-600 text-secondary">Type</th>
						<th scope="col" class="px-md py-sm bb ta-l weight-600 text-secondary">Default</th>
						<th scope="col" class="px-md py-sm bb ta-l weight-600 text-secondary">Description</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item (item.name)}
						<tr>
							<td class="px-md py-sm bb-sub">
								<div class="row ycenter gap-xs wrap">
									<Code variant="primary" size="sm">{item.name}</Code>
									{#if !item.optional}<span class="chip bg-danger text-white">required</span>{/if}
									{#if item.bindable}<span class="chip bg-info text-white">bindable</span>{/if}
								</div>
							</td>
							<td class="px-md py-sm bb-sub"><Code size="sm">{item.type}</Code></td>
							<td class="px-md py-sm bb-sub">
								{#if item.default}<Code size="sm">{item.default}</Code>{:else}<span class="text-muted">—</span>{/if}
							</td>
							<td class="px-md py-sm bb-sub text-secondary">{item.description || '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
