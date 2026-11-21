<!-- @example Size, readout and disabled :: The dial climbs the height ladder, showValue hides the degrees, and disabled stills it. -->
<script lang="ts">
	import { AngleSlider } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="row wrap ycenter gap-lg">
	<AngleSlider value={30} size="h-md" label="Beam angle, medium" />
	<AngleSlider value={30} size="h-lg" label="Beam angle, large" />
	<AngleSlider value={30} size="h-xl" label="Beam angle, extra large" />
	<AngleSlider value={120} size="h-lg" showValue={false} label="Arm rotation, value hidden" />
	<AngleSlider value={200} size="h-lg" label="Locked bearing" disabled />
</div>
