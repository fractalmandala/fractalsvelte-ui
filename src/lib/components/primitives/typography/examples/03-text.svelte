<!-- @example Text :: Body, lead, muted, large and small — every text role. -->
<script lang="ts">
	import { Text, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography align="center">
	<Text look="lead">Fractalsvelte-ui is a component library for SvelteKit, styled only with fractalstyler.</Text>
	<Text look="body">Use the body role for running copy: release notes, empty-state explanations, the paragraph under a heading.</Text>
	<Text look="large">Storage used this month</Text>
	<Text look="small">Updated a few minutes ago</Text>
	<Text look="muted">Figures exclude the archive volume in eu-west-1.</Text>
</Typography>

<Typography align="left">
	<Text look="small">Pinned to the start edge, for a caption under a table.</Text>
</Typography>

<Typography align="right">
	<Text look="small">Pinned to the end edge, for a figure or a signature.</Text>
</Typography>
