<!-- @example Usage :: A document toolbar that sticks to the top and gains glass while stuck. -->
<script lang="ts">
	import { Button, StickyBar } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="scroll-y max-h-md border-subtle radius-md">
	<StickyBar position="top" offset="0px" class="px-md py-sm bg-surface">
		<div class="row ycenter xbetween gap-sm">
			<span class="text-sm weight-500">Invoice run — Northwind 2.4</span>
			<div class="row ycenter gap-sm">
				<Button size="sm" variant="ghost">Preview</Button>
				<Button size="sm">Share</Button>
			</div>
		</div>
	</StickyBar>
	<div class="box gap-bs pad-lg">
		<p class="text-sm text-secondary">
			Statuses now follow draft, sent, overdue and paid. Reminders go out at 7, 14 and 21 days, and the PDF
			renderer has a rollback note if Friday's publish misbehaves.
		</p>
		<p class="text-sm text-secondary">
			The yearly billing flag is fixed for the two workspaces that had stayed on the monthly plan. Chroma on
			the danger role is quieter in dark mode and follows the theme token.
		</p>
		<p class="text-sm text-secondary">
			Onboarding starts with a sample invoice and a three-step checklist, instead of a blank table. Seats on
			the Team plan stay at ten, with three already in use.
		</p>
		<p class="text-sm text-secondary">
			Export a run as CSV: dates stay in Asia/Calcutta, amounts stay tabular. The audit log is shared with
			editors and admins, and commenters can still leave notes on a draft.
		</p>
	</div>
</div>
