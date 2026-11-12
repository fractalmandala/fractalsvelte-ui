<!-- @example States :: Disabled, and a named slider that submits with a form. -->
<script lang="ts">
	import { Slider } from '@fractaldesign/fractalsvelte-ui';
</script>

<form class="measure-sm column gap-bs" onsubmit={(e) => e.preventDefault()}>
	<Slider name="brightness" value={70} label="Brightness" showValue />
	<Slider disabled value={25} label="Locked setting" />
</form>
