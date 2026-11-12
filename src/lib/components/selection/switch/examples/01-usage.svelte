<!-- @example Usage :: A switch bound to a boolean setting. -->
<script lang="ts">
	import { Switch } from '@fractaldesign/fractalsvelte-ui';

	let airplane = $state(false);
</script>

<Switch bind:checked={airplane} label="Airplane mode" />
<p class="text-sm text-muted">Radios are {airplane ? 'off' : 'on'}.</p>
