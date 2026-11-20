<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<Input size="h-lg" textSize="text-xs" value="Extra-small type" aria-label="Extra-small type" />
	<Input size="h-lg" textSize="text-sm" value="Small type" aria-label="Small type" />
	<Input size="h-lg" textSize="text-md" value="Medium type" aria-label="Medium type" />
	<Input size="h-lg" textSize="text-lg" value="Large type" aria-label="Large type" />
	<Input size="h-lg" textSize="text-xl" value="Extra-large type" aria-label="Extra-large type" />
</div>
