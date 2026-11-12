<!-- @example Link :: href renders the tag as a link to its topic. A link holds no remove control, so removable is ignored there. -->
<script lang="ts">
	import { Tag } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Tag href="/topics/motion" variant="soft">Motion</Tag>
	<Tag href="/topics/tokens" variant="soft" removable>Tokens</Tag>
</div>
