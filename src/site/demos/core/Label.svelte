<script lang="ts">
	import { Label, Input } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Label for="username" required description="Must be unique across your organization">
		Username
	</Label>
	<Input id="username" placeholder="e.g. johndoe" />
</div>
