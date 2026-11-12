<!-- @example States :: Disabled, invalid and form-ready name and value. -->
<script lang="ts">
	import { Switch } from '@fractaldesign/fractalsvelte-ui';
</script>

<form class="column gap-bs" onsubmit={(e) => e.preventDefault()}>
	<Switch name="newsletter" value="yes" label="Weekly newsletter" />
	<Switch disabled checked label="Managed by your organization" />
	<Switch disabled label="Early access" />
	<Switch invalid name="consent" value="granted" label="Allow cookies" description="Required to continue." />
</form>
