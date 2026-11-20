<!-- @example Leading and trailing :: Snippets sit before and after the label, alongside the icon props. -->
<script lang="ts">
	import { Button, Badge, Kbd } from '@fractaldesign/fractalsvelte-ui';
	import { luBell } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<Button variant="secondary">
		{#snippet leading()}
			<Badge size="h-sm" variant="danger">3</Badge>
		{/snippet}
		Inbox
	</Button>
	<Button variant="outline" icon={luBell}>
		Alerts
		{#snippet trailing()}
			<Badge size="h-sm" variant="secondary">New</Badge>
		{/snippet}
	</Button>
	<Button variant="ghost">
		Search the docs
		{#snippet trailing()}
			<Kbd size="h-sm" keys={['mod', 'K']} />
		{/snippet}
	</Button>
</div>
