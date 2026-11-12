<!-- @example Text size :: The text scale can be set independently of the default size token. -->
<script lang="ts">
	import { Textarea } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<Textarea size="lg" textSize="xs" rows={2} value="Extra-small type" aria-label="Extra-small type" />
	<Textarea size="lg" textSize="sm" rows={2} value="Small type" aria-label="Small type" />
	<Textarea size="lg" textSize="md" rows={2} value="Medium type" aria-label="Medium type" />
	<Textarea size="lg" textSize="lg" rows={2} value="Large type" aria-label="Large type" />
	<Textarea size="lg" textSize="xl" rows={2} value="Extra-large type" aria-label="Extra-large type" />
</div>
