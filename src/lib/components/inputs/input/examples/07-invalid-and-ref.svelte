<!-- @example Invalid and ref :: invalid marks the field; ref reaches the native input to focus it. -->
<script lang="ts">
	import { Button, Input } from '@fractaldesign/fractalsvelte-ui';

	let value = $state('4242 4242');
	let input = $state<HTMLInputElement | null>(null);
	const invalid = $derived(value.replace(/\s/g, '').length !== 16);
</script>

<div class="box gap-sm measure-sm">
	<Input bind:value bind:ref={input} {invalid} inputmode="numeric" aria-label="Card number" aria-describedby="card-hint" />
	<div class="row ycenter gap-sm">
		<Button size="sm" variant="secondary" onclick={() => input?.select()}>Select number</Button>
		<span id="card-hint" class="text-sm text-muted">{invalid ? 'Card numbers have 16 digits.' : 'Looks good.'}</span>
	</div>
</div>
