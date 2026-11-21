<!-- @example Spacing and type :: The inset, the gap, the corner, both type scales and the icon scale set on one alert. -->
<script lang="ts">
	import { Alert } from '@fractaldesign/fractalsvelte-ui';
</script>

<Alert
	tone="warning"
	variant="outline"
	title="Build minutes are nearly used"
	shape="curved"
	pad="pad-lg"
	gap="gap-sm"
	iconSize="text-md"
	textSize="text-bs"
	childTextSize="text-md"
>
	Two of twelve hours remain on the Team plan. Upgrade to keep deploys running after Thursday.
</Alert>
