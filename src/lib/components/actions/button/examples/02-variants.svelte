<!-- @example Variants :: Every variant. Use one primary per view and let the rest step back. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Button variant="primary" class="text-inverse">Primary</Button>
	<Button variant="secondary">Secondary</Button>
	<Button variant="themed" class="text-inverse">Themed</Button>
	<Button variant="secondary">Soft</Button>
	<Button variant="outline">Outline</Button>
	<Button variant="ghost">Ghost</Button>
	<Button variant="link">Link</Button>
</div>
<div class="row wrap gap-sm ycenter">
	<Button variant="info" class="text-inverse">Info</Button>
	<Button variant="success">Success</Button>
	<Button variant="warning">Warning</Button>
	<Button variant="danger" class="text-inverse">Danger</Button>
</div>
