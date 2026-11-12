<!-- @example Usage :: Mount a Toaster once, then call toast() from anywhere. -->
<script lang="ts">
	import { Button, Toaster, toast } from '@fractaldesign/fractalsvelte-ui';
</script>

<Toaster />

<Button size="sm" onclick={() => toast('Draft saved to atlas.studio')}>Save draft</Button>
