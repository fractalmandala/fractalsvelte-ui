<!-- @example Usage :: A download button leans toward the pointer as it approaches. -->
<script lang="ts">
	import { Button, Magnetic } from '@fractaldesign/fractalsvelte-ui';
	import { luDownload } from '@fractaldesign/icons/lucide';
</script>

<Magnetic>
	<Button icon={luDownload}>Download the Saturday magazine</Button>
</Magnetic>
