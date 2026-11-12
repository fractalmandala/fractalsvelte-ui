<!-- @example Error and required :: An error message marks the control invalid and replaces the hint. -->
<script lang="ts">
	import { Field, Input } from '@fractaldesign/fractalsvelte-ui';

	let handle = $state('ada lovelace');
	const error = $derived(/^[a-z0-9_-]+$/.test(handle) ? undefined : 'Handles can only use lowercase letters, numbers, dashes and underscores.');
</script>

<div class="measure-sm">
	<Field label="Team handle" required hint="This becomes part of your workspace URL." {error}>
		<Input bind:value={handle} />
	</Field>
</div>
