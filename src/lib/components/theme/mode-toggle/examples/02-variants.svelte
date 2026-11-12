<!-- @example Variants :: An icon button, a switch and a segmented group. -->
<script lang="ts">
	import { ModeToggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-xl">
	<ModeToggle variant="icon" />
	<ModeToggle variant="switch" label="Dark appearance" />
	<ModeToggle variant="segmented" label="Appearance" />
</div>
