<!-- @example System :: withSystem adds the OS preference as a third mode. -->
<script lang="ts">
	import { ModeToggle } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-xl">
	<ModeToggle form="segmented" withSystem label="Appearance" />
	<ModeToggle form="icon" withSystem />
</div>
