<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { TagsInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<TagsInput size="h-lg" textSize="text-xs" value={['Letterpress']} aria-label="Extra-small type" />
	<TagsInput size="h-lg" textSize="text-sm" value={['Letterpress']} aria-label="Small type" />
	<TagsInput size="h-lg" textSize="text-md" value={['Letterpress']} aria-label="Medium type" />
	<TagsInput size="h-lg" textSize="text-lg" value={['Letterpress']} aria-label="Large type" />
	<TagsInput size="h-lg" textSize="text-xl" value={['Letterpress']} aria-label="Extra-large type" />
</div>
