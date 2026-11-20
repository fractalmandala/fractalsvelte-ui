<!-- @example Text size :: The text scale can be set independently of the control height. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Button size="h-sm" textSize="text-xs">Extra-small type</Button>
	<Button size="h-sm" textSize="text-sm">Small type</Button>
	<Button size="h-md" textSize="text-md">Medium type</Button>
    <Button size="h-lg" textSize="text-bs">Base type</Button>
	<Button size="h-lg" textSize="text-lg">Large type</Button>
	<Button size="h-xl" textSize="text-xl">Extra-large type</Button>
	<Button size="h-2xl" textSize="text-2xl">2xl type</Button>
	<Button size="h-3xl" textSize="text-3xl">3xl type</Button>
</div>
