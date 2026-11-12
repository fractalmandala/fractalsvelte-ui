<!-- @example Icon-only button :: An icon button keeps its name in a visually hidden span, so it reads as "Delete draft" and looks like an icon. -->
<script lang="ts">
	import { Button, VisuallyHidden } from '@fractaldesign/fractalsvelte-ui';
	import { Icon } from '@fractaldesign/icons';
	import { luTrash2 } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap ycenter gap-sm">
	<Button variant="ghost" size="sm" shape="round">
		<Icon icon={luTrash2} />
		<VisuallyHidden as="span">Delete draft</VisuallyHidden>
	</Button>
	<p class="text-secondary">
		Draft saved <VisuallyHidden as="span">as Q3 planning notes,</VisuallyHidden> 2 minutes ago.
	</p>
</div>
