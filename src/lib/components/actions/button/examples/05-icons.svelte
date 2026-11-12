<!-- @example Icons :: A leading icon with icon, a trailing one with iconEnd. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
	import { luArrowRight, luDownload, luPlus, luTrash2 } from '@fractaldesign/icons/lucide';
</script>

<div class="row wrap gap-sm ycenter">
	<Button icon={luPlus}>New project</Button>
	<Button variant="secondary" icon={luDownload}>Export CSV</Button>
	<Button variant="themed" iconEnd={luArrowRight}>Continue</Button>
	<Button variant="soft" class="danger" icon={luTrash2}>Delete branch</Button>
</div>
