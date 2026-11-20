<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { Pagination } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Pagination size="h-lg" textSize="text-xs" page={4} count={24} label="Extra-small type" />
	<Pagination size="h-lg" textSize="text-sm" page={4} count={24} label="Small type" />
	<Pagination size="h-lg" textSize="text-md" page={4} count={24} label="Medium type" />
	<Pagination size="h-lg" textSize="text-lg" page={4} count={24} label="Large type" />
	<Pagination size="h-lg" textSize="text-xl" page={4} count={24} label="Extra-large type" />
</div>
