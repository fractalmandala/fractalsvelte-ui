<!-- @example Required and optional :: Mark the fields that must be filled with required, and the ones that may be left empty with optional. -->
<script lang="ts">
	import { Label } from '@fractaldesign/fractalsvelte-ui';
</script>

<form class="box gap-md measure-xs">
	<div class="box gap-xs">
		<Label for="work-email" required>Work email</Label>
		<input id="work-email" class="input h-lg" type="email" required autocomplete="email" />
	</div>
	<div class="box gap-xs">
		<Label for="company" optional>Company</Label>
		<input id="company" class="input h-lg" type="text" autocomplete="organization" />
	</div>
</form>
