<!-- @example Disabled and id :: A disabled field dims its label; id lets you link to the control from elsewhere. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-bs measure-sm">
	<Field label="API region" disabled id="api-region" hint="Locked after the workspace is created.">
		<Input value="eu-west-1" />
	</Field>
	<p class="text-sm text-muted">
		Need to move regions? <a class="link" href="#api-region">Jump to the field</a>.
	</p>
</div>
