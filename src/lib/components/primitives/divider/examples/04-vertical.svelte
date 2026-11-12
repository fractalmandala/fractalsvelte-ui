<!-- @example Vertical :: A vertical divider sits in a row and stretches to its height, separating the sections of a toolbar. -->
<script lang="ts">
	import { Divider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-sm text-secondary">
	<span>Draft</span>
	<Divider orientation="vertical" spacing="xs" />
	<span>Published</span>
	<Divider orientation="vertical" variant="strong" spacing="xs" />
	<span>Archived</span>
</div>
