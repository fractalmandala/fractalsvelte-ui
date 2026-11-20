<!-- @example Sizes :: Five sizes on the control ladder, matching inputs and selects of the same size. -->
<script lang="ts">
	import { Button } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Button size="h-xs" class="text-inverse" textSize="text-xs">Extra small</Button>
	<Button size="h-sm" class="text-inverse" textSize="text-sm">Small</Button>
	<Button size="h-md" class="text-inverse" textSize="text-sm">Medium</Button>
		<Button size="h-bs" class="text-inverse" textSize="text-md">Base</Button>
	<Button size="h-lg" class="text-inverse" textSize="text-md">Large</Button>
	<Button size="h-xl" class="text-inverse" textSize="text-bs">Extra large</Button>
	<Button size="h-2xl" class="text-inverse" textSize="text-bs">2× large</Button>
	<Button size="h-3xl" class="text-inverse" textSize="text-bs">3× large</Button>
</div>
