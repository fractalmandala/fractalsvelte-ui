<!-- @example Usage :: A centred, padded page container for a release note. -->
<script lang="ts">
	import { Button, Container } from '@fractaldesign/fractalsvelte-ui';
</script>

<Container as="section" size="lg" padded center>
	<div class="box gap-sm">
		<span class="text-sm text-muted">Release 2.4</span>
		<span class="text-lg weight-500">Invoice run, reminders and a quieter dark mode</span>
		<p class="text-sm text-secondary">
			Statuses now follow draft, sent, overdue and paid. Reminders go out at 7, 14 and 21 days. The danger role
			is quieter in dark mode, and Friday's publish has a rollback note for the PDF renderer.
		</p>
		<div class="row gap-sm">
			<Button>Read the notes</Button>
			<Button variant="ghost">See the checklist</Button>
		</div>
	</div>
</Container>
