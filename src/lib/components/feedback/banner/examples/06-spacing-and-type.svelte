<!-- @example Spacing and type :: A taller bar with both type scales set, above the default one. -->
<script lang="ts">
	import { Banner } from '@fractaldesign/fractalsvelte-ui';
</script>

<div class="box gap-sm">
	<Banner size="h-md" gap="gap-md" iconSize="text-md" textSize="text-md" childTextSize="text-sm" title="Atlas 2.8 is live">
		Usage reports now refresh every five minutes, and custom ranges go back 90 days.
	</Banner>
	<Banner size="h-bs" textSize="text-sm" childTextSize="text-xs" title="Quieter footer bar">
		Kept to the default height with a smaller body for a dense page.
	</Banner>
</div>
