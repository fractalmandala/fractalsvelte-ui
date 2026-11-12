<!-- @example Usage :: A label bound to its input with for, so clicking the name focuses the field. -->
<script lang="ts">
	import { Label } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-xs measure-xs">
	<Label for="project-name">Project name</Label>
	<input id="project-name" class="input h-lg" type="text" placeholder="fractalsvelte-ui" />
</div>
