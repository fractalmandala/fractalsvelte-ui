<!-- @example Text :: Body, lead, muted, large and small — every text role. -->
<script lang="ts">
	import { Text, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography align="center">
	<Text variant="lead">Fractalsvelte-ui is a component library for SvelteKit, styled only with fractalstyler.</Text>
	<Text variant="body">Use the body role for running copy: release notes, empty-state explanations, the paragraph under a heading.</Text>
	<Text variant="large">Storage used this month</Text>
	<Text variant="small">Updated a few minutes ago</Text>
	<Text variant="muted">Figures exclude the archive volume in eu-west-1.</Text>
</Typography>
