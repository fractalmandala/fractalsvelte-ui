<!-- @example States :: Invalid and disabled, plus a form-ready name and value. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';
</script>

<form class="column gap-bs" onsubmit={(e) => e.preventDefault()}>
	<Checkbox
		name="privacy"
		value="read"
		invalid
		label="I have read the privacy policy"
		description="You need to accept before continuing."
	/>
	<Checkbox disabled checked label="Two-factor authentication (managed by your admin)" />
	<Checkbox disabled label="Beta features" />
</form>
