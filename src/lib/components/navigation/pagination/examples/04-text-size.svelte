<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { Pagination } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Pagination size="lg" textSize="xs" page={4} count={24} label="Extra-small type" />
	<Pagination size="lg" textSize="sm" page={4} count={24} label="Small type" />
	<Pagination size="lg" textSize="md" page={4} count={24} label="Medium type" />
	<Pagination size="lg" textSize="lg" page={4} count={24} label="Large type" />
	<Pagination size="lg" textSize="xl" page={4} count={24} label="Extra-large type" />
</div>
