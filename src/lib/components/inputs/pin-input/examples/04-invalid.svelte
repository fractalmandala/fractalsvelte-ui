<!-- @example Invalid :: A code that does not match, marked invalid. -->
<script lang="ts">
	import { Field, PinInput } from '@fractaldesign/fractalsvelte-ui';

	let code = $state('20418');
	const invalid = $derived(code.length === 6 && code !== '204184');
</script>

<div class="box gap-sm">
	<Field label="Staff code" error={invalid ? 'That code is not recognised.' : undefined}>
		<PinInput bind:value={code} {invalid} length={6} />
	</Field>
</div>
