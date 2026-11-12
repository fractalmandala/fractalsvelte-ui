<!-- @example Usage :: Hover or focus a name to preview the person, then move onto the card. -->
<script lang="ts">
	import { HoverCard } from '@fractaldesign/fractalsvelte-ui';
</script>

<p class="text-md lh15 text-secondary">
	Assigned to
	<HoverCard>
		{#snippet trigger({ props })}
			<a href="https://northwind.dev/people/ada" class="text-theme weight-500" {...props}>Ada Lovelace</a>
		{/snippet}
		<div class="box gap-sm">
			<div class="row ycenter gap-sm">
				<span class="box xcenter ycenter h-xl square radius-full bg-surface text-sm weight-600 text-secondary">AL</span>
				<div class="box">
					<p class="weight-600 text-primary">Ada Lovelace</p>
					<p class="text-sm text-muted">@ada · Engineering</p>
				</div>
			</div>
			<p class="text-sm text-secondary">Wrote the first algorithm intended for a machine. Leads the invoices workspace at Northwind.</p>
			<p class="text-xs text-muted">Usually replies within an hour.</p>
		</div>
	</HoverCard>
	on the Harbour invoices project.
</p>
