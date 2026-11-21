<!-- @example Description :: A label with supporting text — its own ink and scale — and rich content through children. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="column gap-bs">
	<Checkbox size="h-lg" textSize="text-sm" label="Smaller type at the same box" />
	<Checkbox gap="gap-md" checked label="Product updates" description="A wider gap between the box and the label." />
<Checkbox
		checked
		label="Marketing emails"
		description="Product news and the occasional offer, at most twice a month."
		childTextSize="text-md"
		childTextColor="text-muted"
	/>
	<Checkbox name="terms" value="accepted">
		I agree to the <a class="link" href="/terms">terms of service</a>
	</Checkbox>
</div>
