<!-- @example Footer :: A group can end in an action row. -->
<script lang="ts">
	import { Button, Fieldset, Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<Fieldset legend="Destructive actions" description="These apply to every environment." class="measure-sm">
	<Switch label="Allow force pushes" />
	{#snippet footer()}
		<Button variant="danger" size="h-md" textSize="text-sm">Revoke access</Button>
	{/snippet}
</Fieldset>
