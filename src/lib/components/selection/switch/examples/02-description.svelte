<!-- @example Description :: A label with supporting text, label position and rich content. -->
<script lang="ts">
	import { Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-bs measure-md">
	<Switch
		checked
		label="Two-factor authentication"
		description="Require a one-time code from your authenticator app when you sign in."
	/>
	<Switch labelPosition="start" label="Show line numbers" />
	<Switch labelPosition="end">
		Share anonymous <span class="text-theme">usage data</span>
	</Switch>
</div>
