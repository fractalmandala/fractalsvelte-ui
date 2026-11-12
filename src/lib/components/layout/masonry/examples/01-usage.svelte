<!-- @example Usage :: Three columns of studio notes at uneven heights. -->
<script lang="ts">
	import { Masonry } from '@fractaldesign/fractalsvelte-ui';

	const notes = [
		{
			title: 'Invoice run',
			body: 'Statuses now follow the draft, sent, overdue and paid path. Reminders go out at 7, 14 and 21 days.'
		},
		{ title: 'Type ramp', body: 'Dropped the old 15px body size. Everything reads on the text-md step.' },
		{
			title: 'Release 2.4',
			body: 'The changelog is written. Friday 16:00 IST, with a rollback note for the invoice PDF if the renderer misbehaves.'
		},
		{ title: 'Colour notes', body: 'Chroma on the danger role was too loud in dark mode; it now tracks the theme token.' },
		{
			title: 'Onboarding',
			body: 'The empty workspace now starts with one sample invoice and a three-step checklist, instead of a blank table.'
		},
		{ title: 'Support', body: 'Two tickets are waiting on the billing flag for yearly plans.' }
	];
</script>

<Masonry columns={3} gap="var(--space-md)" items={notes}>
	{#snippet children(note)}
		<div class="box gap-xs pad-md border-subtle radius-md bg-panel">
			<span class="text-sm weight-500">{note.title}</span>
			<span class="text-sm text-secondary">{note.body}</span>
		</div>
	{/snippet}
</Masonry>
