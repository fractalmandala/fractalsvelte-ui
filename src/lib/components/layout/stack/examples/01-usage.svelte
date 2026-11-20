<!-- @example Usage :: Vertical stack with hairline dividers and a horizontal toolbar row. -->
<script lang="ts">
	import { Badge, Stack } from '@fractaldesign/fractalsvelte-ui';
</script>

<Stack direction="vertical" gap="gap-sm" dividers class="outlined modern pad-md measure-sm">
	<Stack direction="horizontal" align="center" justify="between" gap="gap-sm">
		<span class="text-sm weight-500">Build status</span>
		<Badge variant="success" dot>Passing</Badge>
	</Stack>
	<Stack direction="horizontal" align="center" justify="between" gap="gap-sm">
		<span class="text-sm weight-500">Type check</span>
		<Badge variant="info">0 errors</Badge>
	</Stack>
</Stack>
