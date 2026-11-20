<!-- @example Heading size :: Visual size is independent of the semantic level, so an h2 can look like a page title. -->
<script lang="ts">
	import { Heading, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography align="left">
	<Heading level={2} scale={1}>A section that reads as a page title</Heading>
	<Heading level={2} scale={2}>The default look for this level</Heading>
	<Heading level={2} scale={3}>A quieter section heading</Heading>
	<Heading level={2} scale={4}>A nested heading at this level</Heading>
</Typography>
