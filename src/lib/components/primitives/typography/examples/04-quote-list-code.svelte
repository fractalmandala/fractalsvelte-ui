<!-- @example Quote, lists and code :: A blockquote in its own ink, a bulleted list, a numbered list and inline code in its own scale, padding and shape. -->
<script lang="ts">
	import { Blockquote, InlineCode, List, Text, Typography } from '@fractaldesign/fractalsvelte-ui';
</script>

<Typography>
	<Blockquote textColor="text-primary">
		<Text>A component and its documentation are one. Neither is done without the other.</Text>
	</Blockquote>
	<List as="ul">
		<li>Compose from registered classes; do not add a type scale of your own.</li>
		<li>Keep the reading measure with <InlineCode>Typography</InlineCode>.</li>
		<li>Prefer a real heading to a styled <InlineCode>div</InlineCode>.</li>
	</List>
	<List as="ol" gap="gap-sm">
		<li>Write the brief against the existing classes.</li>
		<li>Run <InlineCode textSize="text-xs" shape="modern">pnpm verify primitives/typography</InlineCode>.</li>
		<li>Read the page back at the actual type sizes.</li>
	</List>
</Typography>
