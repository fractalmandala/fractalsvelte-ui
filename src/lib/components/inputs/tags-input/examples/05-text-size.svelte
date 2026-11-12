<!-- @example Text size :: The text scale can be set independently of the field height. -->
<script lang="ts">
	import { TagsInput } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<TagsInput size="lg" textSize="xs" value={['Letterpress']} aria-label="Extra-small type" />
	<TagsInput size="lg" textSize="sm" value={['Letterpress']} aria-label="Small type" />
	<TagsInput size="lg" textSize="md" value={['Letterpress']} aria-label="Medium type" />
	<TagsInput size="lg" textSize="lg" value={['Letterpress']} aria-label="Large type" />
	<TagsInput size="lg" textSize="xl" value={['Letterpress']} aria-label="Extra-large type" />
</div>
