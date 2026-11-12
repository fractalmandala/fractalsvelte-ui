<!-- @example Variants :: Every variant, from the quiet ghost default to status colours. -->
<script lang="ts">
	import { IconButton } from '@fractaldesign/fractalsvelte-ui';
	import { luBell } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<IconButton icon={luBell} label="Primary" variant="primary" />
	<IconButton icon={luBell} label="Secondary" variant="secondary" />
	<IconButton icon={luBell} label="Themed" variant="themed" />
	<IconButton icon={luBell} label="Soft" variant="soft" />
	<IconButton icon={luBell} label="Outline" variant="outline" />
	<IconButton icon={luBell} label="Ghost" variant="ghost" />
	<IconButton icon={luBell} label="Link" variant="link" />
	<IconButton icon={luBell} label="Info" variant="info" />
	<IconButton icon={luBell} label="Success" variant="success" />
	<IconButton icon={luBell} label="Warning" variant="warning" />
	<IconButton icon={luBell} label="Danger" variant="danger" />
</div>
