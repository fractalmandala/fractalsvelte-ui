<!-- @example Focusable skip link :: The skip link is hidden until a keyboard user tabs to it, then appears in place so they can jump past the navigation. -->
<script lang="ts">
	import { VisuallyHidden } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm measure-sm">
	<VisuallyHidden as="div" focusable>
		<a class="link" href="#main-content">Skip to main content</a>
	</VisuallyHidden>
	<p class="text-secondary">Press Tab to reveal the skip link at the top of this page.</p>
</div>
