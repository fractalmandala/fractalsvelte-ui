<!-- @example Text size :: The text scale can be set independently of the cap height. -->
<script lang="ts">
	import { Kbd } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Kbd size="h-lg" textSize="text-sm" keys={['mod', 'K']} />
	<Kbd size="h-lg" textSize="text-md" keys={['mod', 'K']} />
	<Kbd size="h-lg" textSize="text-lg" keys={['mod', 'K']} />
</div>
