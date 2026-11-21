<!-- @example Dismissible :: A close button that springs the alert shut and reports it through onDismiss. -->
<script lang="ts">
	import { Alert } from '@fractaldesign/fractalsvelte-ui';

	let dismissed = $state(0);
</script>

<div class="box gap-sm">
	<Alert tone="info" title="Keyboard shortcuts" dismissible onDismiss={() => dismissed++}>
		Press ? anywhere to see every shortcut.
	</Alert>
	<Alert tone="success" variant="outline" title="Import complete" dismissible onDismiss={() => dismissed++}>
		1,284 contacts were added to your audience.
	</Alert>
	<p class="text-sm text-muted tabular-nums">Dismissed {dismissed} of 2</p>
</div>
