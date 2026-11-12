<!-- @example Card :: The Toast card used on its own, with a message, a description, actions and a close button. -->
<script lang="ts">
	import { Toast } from '@fractaldesign/fractalsvelte-ui';

	let gone = $state(false);
</script>

{#if !gone}
	<Toast
		type="success"
		message="Domain verified"
		description="atlas.studio is now serving traffic over HTTPS."
		dismissible
		action={{ label: 'View DNS', href: '#dns' }}
		cancel={{ label: 'Close' }}
		onDismiss={() => (gone = true)}
	/>
{/if}
