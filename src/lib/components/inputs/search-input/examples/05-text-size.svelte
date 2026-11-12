<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { SearchInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<SearchInput size="lg" textSize="xs" value="Extra-small type" aria-label="Extra-small type" />
	<SearchInput size="lg" textSize="sm" value="Small type" aria-label="Small type" />
	<SearchInput size="lg" textSize="md" value="Medium type" aria-label="Medium type" />
	<SearchInput size="lg" textSize="lg" value="Large type" aria-label="Large type" />
	<SearchInput size="lg" textSize="xl" value="Extra-large type" aria-label="Extra-large type" />
</div>
