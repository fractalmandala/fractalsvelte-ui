<!-- @example Usage :: A labelled checkbox bound to a boolean. -->
<script lang="ts">
	import { Checkbox } from '@fractaldesign/fractalsvelte-ui';

	let accepted = $state(false);
</script>

<Checkbox bind:checked={accepted} label="Send me release notes" />
<p class="text-sm text-muted">{accepted ? 'You will receive release notes.' : 'Not subscribed.'}</p>
