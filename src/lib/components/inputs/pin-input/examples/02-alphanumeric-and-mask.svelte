<!-- @example Alphanumeric and mask :: A shorter backup code, and a masked PIN. -->
<script lang="ts">
	import { Field, PinInput } from '@fractaldesign/fractalsvelte-ui';

	let backup = $state('');
	let pin = $state('');
</script>

<div class="box gap-lg">
	<Field label="Backup code" hint="Letters and digits, four characters.">
		<PinInput bind:value={backup} type="alphanumeric" length={4} onValueChange={() => {}} />
	</Field>
	<Field label="Till PIN" hint="Hidden as you type.">
		<PinInput bind:value={pin} type="numeric" length={4} mask />
	</Field>
</div>
