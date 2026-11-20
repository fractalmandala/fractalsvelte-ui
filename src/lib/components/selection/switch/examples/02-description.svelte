<!-- @example Description :: A label with supporting text, label position and rich content. -->
<script lang="ts">
	import { Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-bs measure-md">
	<Switch size="h-lg" textSize="text-sm" label="Smaller type at the same switch" />
<Switch
		checked
		label="Two-factor authentication"
		description="Require a one-time code from your authenticator app when you sign in."
	/>
	<Switch align="start" label="Show line numbers" />
	<Switch align="end">
		Share anonymous <span class="text-theme">usage data</span>
	</Switch>
</div>
