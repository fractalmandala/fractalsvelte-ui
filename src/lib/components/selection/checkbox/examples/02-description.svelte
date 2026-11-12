<!-- @example Description :: A label with supporting text, and rich content through children. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-bs">
	<Checkbox
		checked
		label="Marketing emails"
		description="Product news and the occasional offer, at most twice a month."
	/>
	<Checkbox name="terms" value="accepted">
		I agree to the <a class="link" href="/terms">terms of service</a>
	</Checkbox>
</div>
