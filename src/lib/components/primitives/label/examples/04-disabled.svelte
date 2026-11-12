<!-- @example Disabled :: The disabled state dims the label to match a control that cannot be edited. -->
<script lang="ts">
	import { Label } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-xs measure-xs">
	<Label for="billing-id" disabled>Billing account ID</Label>
	<input id="billing-id" class="input h-lg" type="text" value="acct_7731" disabled />
</div>
