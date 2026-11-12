<!-- @example Bottom save bar :: A save bar that sticks to the bottom, offset from the edge. -->
<script lang="ts">
	import { Button, StickyBar } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="scroll-y max-h-sm border-subtle radius-md">
	<div class="box gap-bs pad-lg">
		<p class="text-sm weight-500">Workspace roles</p>
		<p class="text-sm text-secondary">
			Commenters can leave notes. Editors can publish. Admins can change the plan and the seat cap. You have 3
			of 10 seats in use on the Team plan.
		</p>
		<p class="text-sm text-secondary">
			Changing a role takes effect on the next sign-in. Existing sessions keep their current permissions until
			then, so a change mid-review does not yank someone out of a draft.
		</p>
		<p class="text-sm text-secondary">
			Yearly billing is available again for the two workspaces that had been stuck on the monthly plan. The
			change is written to the shared audit log.
		</p>
	</div>
	<StickyBar position="bottom" offset="var(--space-sm)" class="px-md py-sm bg-surface">
		<div class="row ycenter xbetween gap-sm">
			<span class="text-sm text-secondary">Unsaved changes to workspace roles.</span>
			<Button size="sm">Save changes</Button>
		</div>
	</StickyBar>
</div>
