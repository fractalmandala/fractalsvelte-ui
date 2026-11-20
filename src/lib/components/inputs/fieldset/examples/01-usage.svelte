<!-- @example Usage :: Notification preferences grouped inside a Fieldset with description. -->
<script lang="ts">
	import { Fieldset, Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<Fieldset
	legend="Release notifications"
	description="Choose how deployment events notify your workspace."
	class="measure-sm"
>
	<Switch checked label="Email digest on stable releases" />
	<Switch label="Slack webhook on failure" />
</Fieldset>
