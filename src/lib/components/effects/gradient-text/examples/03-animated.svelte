<!-- @example Animated :: A heading whose gradient travels slowly along the line. -->
<script lang="ts">
	import { GradientText } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-md">
	<p class="page-title">
		<GradientText gradient="aurora" animated>Still compiling the preview</GradientText>
	</p>
	<p class="page-heading-lg">
		<GradientText gradient="theme" animated={false}>A still fill, for a heading that should not move.</GradientText>
	</p>
</div>
