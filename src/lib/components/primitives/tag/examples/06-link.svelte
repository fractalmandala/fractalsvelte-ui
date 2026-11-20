<!-- @example Link :: href renders the tag as a link to its topic. A link holds no remove control, so removable is ignored there. -->
<script lang="ts">
	import { Tag } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Tag href="/topics/motion" variant="secondary">Motion</Tag>
	<Tag href="/topics/tokens" variant="secondary" removable>Tokens</Tag>
</div>
