<!-- @example Variants and position :: A ring for the page, and a bar along the bottom. -->
<script lang="ts">
	import { ScrollProgress } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-lg">
	<div class="box gap-xs">
		<p class="text-xs text-muted">form: ring, target: page</p>
		<ScrollProgress form="ring" target="page" tone="neutral" />
	</div>
	<p class="text-sm text-secondary">A second bar is pinned to the bottom of the viewport (position: bottom). Scroll the page to see both.</p>
	<ScrollProgress form="bar" position="bottom" target="page" tone="success" />
</div>
