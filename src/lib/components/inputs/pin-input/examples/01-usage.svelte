<!-- @example Usage :: A six-digit confirmation code inside a Field. -->
<script lang="ts">
	import { Field, PinInput } from '@fractaldesign/fractalsvelte-ui';

	let code = $state('');
	let unlocked = $state(false);
</script>

<div class="box gap-sm">
	<Field label="Confirmation code" hint="The six-digit code from your authenticator.">
		<PinInput bind:value={code} onComplete={() => (unlocked = true)} />
	</Field>
	<p class="text-sm text-muted">
		{unlocked ? 'Code received. You can continue.' : code ? `Entered ${code.length} of 6 digits.` : 'Paste a code, or type it.'}
	</p>
</div>
