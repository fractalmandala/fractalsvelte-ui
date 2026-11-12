<!-- @example Heading size :: Visual size is independent of the semantic level, so an h2 can look like a page title. -->
<script lang="ts">
	import { Heading, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography align="start">
	<Heading level={2} size={1}>A section that reads as a page title</Heading>
	<Heading level={2} size={2}>The default look for this level</Heading>
	<Heading level={2} size={3}>A quieter section heading</Heading>
	<Heading level={2} size={4}>A nested heading at this level</Heading>
</Typography>
