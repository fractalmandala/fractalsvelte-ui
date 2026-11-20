<!-- @example Variants :: An icon button, a switch and a segmented group. -->
<script lang="ts">
	import { ModeToggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-xl">
	<ModeToggle form="icon" />
	<ModeToggle form="switch" label="Dark appearance" />
	<ModeToggle form="segmented" label="Appearance" />
</div>
