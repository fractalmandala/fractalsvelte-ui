<!-- @example Dismissible :: A close button, with an optional storageKey that remembers the dismissal. -->
<script lang="ts">
	import { Banner } from '@fractaldesign/fractalsvelte-ui';

	let dismissed = $state(0);
</script>

<div class="box gap-sm">
	<Banner
		tone="info"
		title="Keyboard shortcuts"
		dismissible
		onDismiss={() => dismissed++}
	>
		Press ? anywhere to see every shortcut in the editor.
	</Banner>
	<Banner
		tone="success"
		title="Inbox connected"
		dismissible
		storageKey="fractalsvelte-ui-docs-banner-inbox"
		onDismiss={() => dismissed++}
	>
		mail.atlas.studio is forwarding replies to this workspace.
	</Banner>
	<p class="text-sm text-muted tabular-nums">Dismissed {dismissed} this session</p>
</div>
