<!-- @example Text size :: The text scale can be set independently of the default size token. -->
<script lang="ts">
	import { Textarea } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<Textarea size="h-lg" textSize="text-xs" rows={2} value="Extra-small type" aria-label="Extra-small type" />
	<Textarea size="h-lg" textSize="text-sm" rows={2} value="Small type" aria-label="Small type" />
	<Textarea size="h-lg" textSize="text-md" rows={2} value="Medium type" aria-label="Medium type" />
	<Textarea size="h-lg" textSize="text-lg" rows={2} value="Large type" aria-label="Large type" />
	<Textarea size="h-lg" textSize="text-xl" rows={2} value="Extra-large type" aria-label="Extra-large type" />
</div>
