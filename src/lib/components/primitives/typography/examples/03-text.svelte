<!-- @example Text :: Body, lead, muted, large and small — every text role. -->
<script lang="ts">
	import { Text, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography align="center">
	<Text textSize="text-lg" textColor="text-secondary">Fractalsvelte-ui is a component library for SvelteKit, styled only with fractalstyler.</Text>
	<Text textSize="text-md">Use the body role for running copy: release notes, empty-state explanations, the paragraph under a heading.</Text>
	<Text textSize="text-lg">Storage used this month</Text>
	<Text textSize="text-sm">Updated a few minutes ago</Text>
	<Text textSize="text-sm" textColor="text-muted">Figures exclude the archive volume in eu-west-1.</Text>
</Typography>

<Typography align="left">
	<Text textSize="text-sm">Pinned to the start edge, for a caption under a table.</Text>
</Typography>

<Typography align="right">
	<Text textSize="text-sm">Pinned to the end edge, for a figure or a signature.</Text>
</Typography>
