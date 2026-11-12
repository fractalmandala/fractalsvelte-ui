<!-- @example Icon :: An icon before the label names the kind of thing the tag holds. -->
<script lang="ts">
	import { Tag } from '@fractaldesign/fractalsvelte-ui';
	import { luBookmark, luStar, luUser } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<Tag icon={luUser} variant="outline">Maya Chen</Tag>
	<Tag icon={luStar} variant="warning">Starred</Tag>
	<Tag icon={luBookmark} variant="info">Read later</Tag>
</div>
