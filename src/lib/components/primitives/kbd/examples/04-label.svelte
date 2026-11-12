<!-- @example Children :: Without keys, children draws a single key label, such as Esc or Enter. -->
<script lang="ts">
	import { Kbd } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter text-secondary">
	<span>Dismiss the dialog with</span>
	<Kbd>Esc</Kbd>
	<span>or confirm with</span>
	<Kbd size="sm">Enter</Kbd>
</div>
