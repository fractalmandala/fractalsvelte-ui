<!-- @example Usage :: A trigger snippet and a spring panel — the plain disclosure. -->
<script lang="ts">
	import { Collapsible } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luChevronDown } from '@fractaldesign/icons/lucide';

	let open = $state(false);
</script>

<Collapsible bind:open>
	{#snippet trigger({ open, props })}
		<button class="item" {...props}>
			<span class="grow ta-l weight-600">Release notes for v2.18</span>
			<span class={['caret spring spring-snappy', open && 'open']}>
				<Icon icon={luChevronDown} />
			</span>
		</button>
	{/snippet}
	<div class="pad-bs">
		<p class="text-sm text-secondary">This release adds sticky table headers, expandable detail rows and a quieter empty state for filtered grids. Billing invoices now include the seat breakdown you asked for.</p>
	</div>
</Collapsible>
