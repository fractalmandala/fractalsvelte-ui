<!-- @example Keys and separator :: A longer chord, with the separator between keys set to a plain space or a plus sign, in its own ink. -->
<script lang="ts">
	import { Kbd } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<p class="row wrap ycenter gap-sm text-secondary">
		Save all files <Kbd keys={['mod', 'shift', 'S']} />
	</p>
	<p class="row wrap ycenter gap-sm text-secondary">
		Jump to a line <Kbd keys={['mod', 'G']} separator=" then " textColor="text-secondary" />
	</p>
</div>
