<!-- @example Text size :: The text scale can be set independently of the cap height. -->
<script lang="ts">
	import { Kbd } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap gap-sm ycenter">
	<Kbd size="lg" textSize="sm" keys={['mod', 'K']} />
	<Kbd size="lg" textSize="md" keys={['mod', 'K']} />
	<Kbd size="lg" textSize="lg" keys={['mod', 'K']} />
</div>
